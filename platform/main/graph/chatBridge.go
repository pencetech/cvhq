package graph

import (
	"context"
	"fmt"

	"regexp"
	"strings"
	"text/template"

	"github.com/sashabaranov/go-openai"
)

type ChatBridge struct {
	config *Configuration
}

func NewChatBridge(config *Configuration) *ChatBridge {
	return &ChatBridge{
		config: config,
	}
}

func (c *ChatBridge) InjectPrompt(prompt string, data any) (string, error) {
	t := template.Must(template.New("prompt").Parse(prompt))
	builder := &strings.Builder{}
	if err := t.Execute(builder, data); err != nil {
		return "", err
	}
	return builder.String(), nil
}

func (c *ChatBridge) ChatCompletion(content string) (string, error) {
	client := openai.NewClient(c.config.OpenAIKey)
	resp, err := client.CreateChatCompletion(
		context.Background(),
		openai.ChatCompletionRequest{
			Model: openai.GPT4,
			Messages: []openai.ChatCompletionMessage{
				{
					Role:    openai.ChatMessageRoleUser,
					Content: content,
				},
			},
		},
	)

	if err != nil {
		fmt.Printf("ChatCompletion error: %v\n", err)
		return "", err
	}

	return resp.Choices[0].Message.Content, nil
}

func (c *ChatBridge) ChatCompletionWithSystemPrompt(system string, content string) (string, error) {
	client := openai.NewClient(c.config.OpenAIKey)
	resp, err := client.CreateChatCompletion(
		context.Background(),
		openai.ChatCompletionRequest{
			Model: openai.GPT4,
			Messages: []openai.ChatCompletionMessage{
				{
					Role:    openai.ChatMessageRoleSystem,
					Content: system,
				},
				{
					Role:    openai.ChatMessageRoleUser,
					Content: content,
				},
			},
		},
	)

	if err != nil {
		fmt.Printf("ChatCompletion error: %v\n", err)
		return "", err
	}

	return resp.Choices[0].Message.Content, nil
}

func (c *ChatBridge) escapeNewline(rawStr *string) string {
	matchNewlines := regexp.MustCompile(`[\r\n]`)
	escapeNewlines := func(s string) string {
		return matchNewlines.ReplaceAllString(s, "\\n")
	}
	re := regexp.MustCompile(`"[^"\\]*(?:\\[\s\S][^"\\]*)*"`)
	return re.ReplaceAllStringFunc(*rawStr, escapeNewlines)
}

func (c *ChatBridge) escapeTabs(rawStr *string) string {
	matchTabs := regexp.MustCompile(`[\r\t]`)
	escapeTabs := func(s string) string {
		return matchTabs.ReplaceAllString(s, "\\t")
	}
	re := regexp.MustCompile(`"[^"\\]*(?:\\[\s\S][^"\\]*)*"`)
	return re.ReplaceAllStringFunc(*rawStr, escapeTabs)
}

func (c *ChatBridge) getSummaryPrompt() string {
	switch c.config.SummaryPrompt {
		case 1:
			return CvSummaryPrompt1
		case 2:
			return CvSummaryPrompt2
		case 3:
			return CvSummaryPrompt3
	}
	return ""
}

func (c *ChatBridge) getEnhancementPrompt() string {
	switch c.config.EnhancementPrompt {
		case 1:
			return EnhanceAchievementPrompt1
		case 2:
			return EnhanceAchievementPrompt2
		case 3:
			return EnhanceAchievementPrompt3
	}
	return ""
}