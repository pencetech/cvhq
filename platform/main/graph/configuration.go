package graph

import (
	"fmt"
	"log"
	"os"

	"github.com/BurntSushi/toml"
	"github.com/joho/godotenv"
)

type Configuration struct {
	DefaultPort string
	EnhancementPrompt int
	SummaryPrompt int
	PDFUrl string
	AWSAccessKey string
	AWSSecretKey string
	OpenAIKey string
}

func NewConfiguration() *Configuration {
	var conf Configuration
	if _, err := toml.DecodeFile("configuration.toml", &conf); err != nil {
		log.Println("Error decoding configuration -> ", err)
	}
	fmt.Println("Configuration added")

	if os.Getenv("APP_ENV") != "prod" &&  
	os.Getenv("APP_ENV") != "demo" {
		err := godotenv.Load()
		if err != nil {
			log.Fatal("Error loading .env")
		}
	}

	conf.AWSAccessKey = os.Getenv("AWS_ACCESS_KEY")
	conf.AWSSecretKey = os.Getenv("AWS_SECRET_KEY")
	conf.OpenAIKey = os.Getenv("OPENAI_KEY")
	conf.PDFUrl = os.Getenv("PDF_URL")

	return &conf
}