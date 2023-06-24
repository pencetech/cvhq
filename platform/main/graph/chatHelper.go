package graph

import (
    "github.com/sashabaranov/go-openai"
    "context"
	"fmt"
	"os"
)

var enhanceAchievementPrompt = `Hi {{.}}`

func chatCompletion(content string) (string, error) {
	client := openai.NewClient(os.Getenv("OPENAI_KEY"))
	resp, err := client.CreateChatCompletion(
		context.Background(),
		openai.ChatCompletionRequest{
			Model: openai.GPT3Dot5Turbo,
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
