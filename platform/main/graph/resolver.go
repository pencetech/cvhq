package graph

import (
	"bytes"
	"context"
	"fmt"
	"log"
	"os"

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

	fmt.Println("S3 put object successful")

	if err != nil {
		log.Println("[ERROR] Put object error -> ", err)
		return err
	}

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