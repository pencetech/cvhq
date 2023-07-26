package graph

import (
	"bytes"
	"context"
	"fmt"
	"html/template"
	"log"
	"os"
	"strings"
	"time"

	"github.com/google/uuid"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/credentials"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/pencetech/cvhq/graph/model"
	"github.com/yuin/goldmark"
	"github.com/yuin/goldmark/extension"
	"github.com/yuin/goldmark/parser"
	"github.com/yuin/goldmark/renderer/html"

	pdf "github.com/SebastiaanKlippert/go-wkhtmltopdf"
)

// This file will not be regenerated automatically.
//
// It serves as dependency injection for your app, add any dependencies you require here.

type Resolver struct{
	ProfileStore map[string]model.Profile
}

func GetCV(filename string) ([]byte, error) {
	accessKey := os.Getenv("AWS_ACCESS_KEY")
	secretKey := os.Getenv("AWS_SECRET_KEY")
	options := s3.Options{
		Region:      "eu-west-2",
		Credentials: aws.NewCredentialsCache(credentials.NewStaticCredentialsProvider(accessKey, secretKey, "")),
	}
	
	client := s3.New(options)
	res, err := client.GetObject(context.TODO(), &s3.GetObjectInput{
		Bucket: aws.String("cvhqcv"),
		Key: aws.String(filename),
	})

	if err != nil {
		log.Println("[ERROR] Get object error -> ", err)
		return nil, err
	}

	defer res.Body.Close()
	buf := new(bytes.Buffer)
	buf.ReadFrom(res.Body)
	return buf.Bytes(), nil
}

func ConstructCV(input model.CVContentInput) (string, error) {

	err := ParseTimeCV(&input)
	if err != nil {
		log.Println("[ERROR] Parse time error -> ", err)
	}

	markdown := `
<div style="font-family: sans-serif">
<div align="center">
	
# {{ .UserBio.FirstName }} {{ .UserBio.LastName }}
	
<b>Email:</b> {{ .UserBio.Email }} | <b>Phone:</b> {{ .UserBio.Phone }}
	
<b>Address:</b> {{ .UserBio.Address }}
	
</div>
	
---

### Summary

{{ .Summary }}
	
---

## Experiences
{{ range .Experiences }}

**{{ .Title }}** at {{ .Company }} _({{ .StartDate }} - {{ if .IsCurrent }} Present{{ else }} {{ .EndDate }}{{ end }})_
	  
{{ .Achievements }}

{{ end }}
	
---

## Education
{{ range .Education }}

**{{ .Degree }}** in {{ .Subject }} at {{ .Institution }} _({{ .StartDate }} - {{ .EndDate }})_
	
{{ end }}
	
---

## Skillsets
	
{{ .Skillsets.Skillsets }}
</div>`
	
	t := template.Must(template.New("cv").Parse(markdown))
	builder := &strings.Builder{}
	if err := t.Execute(builder, input); err != nil {
		return "", err
	}
	fmt.Print(builder.String())
	return builder.String(), nil
}

func ParseTimeCV(input *model.CVContentInput) error {

	for i, exp := range input.Experiences {
		startParsed, err := time.Parse(time.RFC3339, exp.StartDate)
		if err != nil {
			log.Println("[ERROR] Parse time error -> ", err)
			return err
		}
		startMonthYear := startParsed.Format("Jan 2006")

		var endMonthYear string
		if exp.EndDate != nil {
			endParsed, err := time.Parse(time.RFC3339, *exp.EndDate)
			if err != nil {
				log.Println("[ERROR] Parse time error -> ", err)
				return err
			}

			endMonthYear = endParsed.Format("Jan 2006")
		}

		input.Experiences[i].StartDate = startMonthYear
		input.Experiences[i].EndDate = &endMonthYear
	}

	for i, ed := range input.Education {
		startEdParsed, err := time.Parse(time.RFC3339, ed.StartDate)
		if err != nil {
			log.Println("[ERROR] Parse time error -> ", err)
			return err
		}
		startEdMonthYear := startEdParsed.Format("Jan 2006")

		endEdParsed, err := time.Parse(time.RFC3339, ed.EndDate)
		if err != nil {
			log.Println("[ERROR] Parse time error -> ", err)
			return err
		}

		endEdMonthYear := endEdParsed.Format("Jan 2006")

		input.Education[i].StartDate = startEdMonthYear
		input.Education[i].EndDate = endEdMonthYear
	} 

	return nil
}

func PutCV(md string, filename string) error {
	accessKey := os.Getenv("AWS_ACCESS_KEY")
	secretKey := os.Getenv("AWS_SECRET_KEY")
	html := MdToHtml([]byte(md))
	pdf := HtmlToPdf(html)

	body := bytes.NewReader(pdf)

	options := s3.Options{
		Region:      "eu-west-2",
		Credentials: aws.NewCredentialsCache(credentials.NewStaticCredentialsProvider(accessKey, secretKey, "")),
	}

	client := s3.New(options)
	_, err := client.PutObject(context.TODO(), &s3.PutObjectInput{
		Bucket: aws.String("cvhqcv"),
		Key: aws.String(filename),
		Body: body,
	})

	if err != nil {
		log.Println("[ERROR] Put object error -> ", err)
		return err
	}
	fmt.Println("S3 put object successful")
	return nil
}

func MdToHtml(source []byte) []byte {
	md := goldmark.New(
		goldmark.WithExtensions(
			extension.GFM,
			// extension.NewLinkify(),
			extension.Footnote,
			extension.NewTable(),
			extension.DefinitionList,
			extension.NewTypographer(),
		),
		goldmark.WithParserOptions(
			parser.WithAutoHeadingID(),
		),
		goldmark.WithRendererOptions(
			html.WithHardWraps(),
			html.WithUnsafe(),
		),
	)
	var buf bytes.Buffer
	if err := md.Convert(source, &buf); err != nil {
		panic(err)
	}
	return buf.Bytes()
}

// htmltopdf uses go-wkhtmltopdf to render the source html as a pdf
func HtmlToPdf(source []byte) []byte {
	// Create new PDF generator
	pdfg, err := pdf.NewPDFGenerator()
	if err != nil {
		log.Fatal(err)
	}

	pdfg.Dpi.Set(600)
	pdfg.Orientation.Set(pdf.OrientationPortrait)
	pdfg.Grayscale.Set(false)
	pdfg.PageSize.Set(pdf.PageSizeA4)

	page := pdf.NewPageReader(bytes.NewReader(source))
	page.Encoding.Set("utf-8")
	
	page.Allow.Set(".")
	page.EnableLocalFileAccess.Set(true)
	
	pdfg.AddPage(page)

	// Create PDF document in internal buffer
	if err = pdfg.Create(); err != nil {
		log.Fatal(err)
	}
	return pdfg.Buffer().Bytes()
}

func generateFileName(firstName string, lastName string) string {
	return firstName + "_" + lastName + "_" + uuid.New().String() + ".pdf"

}