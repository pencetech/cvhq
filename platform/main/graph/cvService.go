package graph

import (
	"bytes"
	"context"
	"fmt"
	"html/template"
	"log"
	"strings"
	"time"

	pdf "github.com/SebastiaanKlippert/go-wkhtmltopdf"
	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/credentials"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/google/uuid"
	"github.com/pencetech/cvhq/graph/model"
	"github.com/yuin/goldmark"
	"github.com/yuin/goldmark/extension"
	"github.com/yuin/goldmark/parser"
	"github.com/yuin/goldmark/renderer/html"
)

type CVService struct {
	config *Configuration
}

func NewCVService(config *Configuration) *CVService {
	return &CVService{
		config: config,
	}
}

func (c *CVService) GetCV(filename string) ([]byte, error) {
	accessKey := "AKIA5ZWKIYYRCSZBQEGP"
	secretKey := "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"
	options := s3.Options{
		Region:      "eu-west-2",
		Credentials: aws.NewCredentialsCache(credentials.NewStaticCredentialsProvider(accessKey, secretKey, "")),
	}

	client := s3.New(options)
	res, err := client.GetObject(context.TODO(), &s3.GetObjectInput{
		Bucket: aws.String("cvhqcv"),
		Key:    aws.String(filename),
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

func (c *CVService) ConstructCV(input model.CVContentInput, cvType model.CvType) (string, error) {
	c.ParseTimeCV(&input)
	var rawCV string

	switch (cvType) {
		case model.CvTypeBase: 
			rawCV = fmt.Sprintf(SansCV, baseSansCSS)
		case model.CvTypePrime: 
			rawCV = fmt.Sprintf(SansCV, primeSansCSS)
	}
	
	t := template.Must(template.New("cv").Funcs(fns).Parse(rawCV))
	builder := &strings.Builder{}
	if err := t.Execute(builder, input); err != nil {
		return "", err
	}
	fmt.Print(builder.String())
	return builder.String(), nil
}

func (c *CVService) ParseTimeCV(input *model.CVContentInput) {

	for i, exp := range input.Experiences {
		startParsed, err := time.Parse(time.RFC3339, exp.StartDate)
		if err != nil {
			log.Println("[ERROR] Parse time error -> ", err)
		}
		startMonthYear := startParsed.Format("Jan 2006")

		var endMonthYear string
		if exp.EndDate != nil && len(*exp.EndDate) > 0 {
			endParsed, err := time.Parse(time.RFC3339, *exp.EndDate)
			if err != nil {
				log.Println("[ERROR] Parse time error -> ", err)
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
		}
		startEdMonthYear := startEdParsed.Format("Jan 2006")

		endEdParsed, err := time.Parse(time.RFC3339, ed.EndDate)
		if err != nil {
			log.Println("[ERROR] Parse time error -> ", err)
		}

		endEdMonthYear := endEdParsed.Format("Jan 2006")

		input.Education[i].StartDate = startEdMonthYear
		input.Education[i].EndDate = endEdMonthYear
	}
}

func (c *CVService) PutCV(html string, filename string) error {
	accessKey := "AKIA5ZWKIYYRCSZBQEGP"
	secretKey := "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"
	pdf := c.HtmlToPdf([]byte(html))

	body := bytes.NewReader(pdf)

	options := s3.Options{
		Region:      "eu-west-2",
		Credentials: aws.NewCredentialsCache(credentials.NewStaticCredentialsProvider(accessKey, secretKey, "")),
	}

	client := s3.New(options)
	_, err := client.PutObject(context.TODO(), &s3.PutObjectInput{
		Bucket: aws.String("cvhqcv"),
		Key:    aws.String(filename),
		Body:   body,
	})

	if err != nil {
		log.Println("[ERROR] Put object error -> ", err)
		return err
	}
	fmt.Println("S3 put object successful")
	return nil
}

func (c *CVService) MdToHtml(source []byte) []byte {
	md := goldmark.New(
		goldmark.WithExtensions(
			extension.GFM,
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
func (c *CVService) HtmlToPdf(source []byte) []byte {
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

func (c *CVService) generateFileName(firstName string, lastName string) string {
	return firstName + "_" + lastName + "_" + uuid.New().String() + ".pdf"

}
