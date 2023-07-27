package graph

import (
	"fmt"
	"log"

	"github.com/BurntSushi/toml"
)

type Configuration struct {
	DefaultPort string
	EnhancementPrompt int
	SummaryPrompt int
}

func NewConfiguration() *Configuration {
	var conf Configuration
	if _, err := toml.DecodeFile("configuration.toml", &conf); err != nil {
		log.Println("Error decoding configuration -> ", err)
	}
	fmt.Println("Configuration added")
	return &conf
}