package graph

import (
    "github.com/sashabaranov/go-openai"
    "context"
	"text/template"
	"regexp"
	"strings"
	"fmt"
)

var EnhanceAchievementPrompt = `{{ .UserBio.FirstName }} {{ .UserBio.LastName }} is currently a {{ .Experience.Title }} at {{ .Experience.Company }}, 
	and needs to write a CV for a {{ .JobPosting.Title }} role at {{ .JobPosting.Company }}, a {{ .JobPosting.Sector }} company. 
	Your task is to help improve on {{ .UserBio.FirstName }}'s bullet points for each of his experiences. The content has to 
	demonstrate that {{ .UserBio.FirstName }} meets most of the following job requirements and nice-to-haves: 
	- requirements: "{{ .JobPosting.Requirements }}"
	- nice-to-haves: "{{ .JobPosting.AddOn }}"
	Now, to achieve the abovementioned objective, follow exactly the following: 
	1. Before doing any improvements, state the match factor, an integer from 0-10 of the requirements to {{ .UserBio.FirstName }}'s original or given experience, 
	stating which bullet points do not meet the requirements and the reasons why. 
	2. Here is the list of {{ .UserBio.FirstName }}'s experience: "{{ .Experience.Achievements }}"
	containing the bullet points you need to improve. Return the improved bullet points. Please do the 
	following when you write your bullet points: 
	1. Note that the bullet points should contain not only things being done but also the impact to the business. 
	2. Please don't exceed 5 bullet points. 
	3. Do not just duplicate words from {{ .JobPosting.Company }}'s job requirements, you'll end up making up things that are not true! 
	Here are some examples of bullet points that you can produce for a random software engineer:
	"- Automated treasury reconciliation system by transforming SWIFT messages into a concise report in an internal portal, saving 70%% time
	- Developed alerting system for high-value foreign exchange (FX) transaction to better manage Starling's FX risk
	- Optimised PostgreSQL database transactions to more correctly calculate ledger balances, leading to 50%% cut in data processing time
	- Led collaboration with external partners to build better reporting capability inside Starling, saved months of potential backlog"\n 
	3. Return steps 1 and 2 into the following JSON format:
	{
		match: {
			matchFactor: number,
			reason: string
		},
		achievements: string,
	}
	Where "match" is the overall match of {{ .UserBio.FirstName }}'s achievements to the job requireemnts as stated in step 1, 
	and "achievements" is the improved version of {{ .UserBio.FirstName }}'s achievements as stated in step 2.
`

var GenerateCVPrompt = `Generate a CV in markdown using the following information: %s, 
where 'userBio' is the profile you'll put in the header, 'achievements' will be the main body of the CV, 
'education' and 'skillsets' will be at the bottom. Make sure that the header is justify centered using div tags.`

func InjectPrompt(prompt string, data any) (string, error) {
	t := template.Must(template.New("prompt").Parse(prompt))
	builder := &strings.Builder{}
	if err := t.Execute(builder, data); err != nil {
		return "", err
	}
	return builder.String(), nil
}

func ChatCompletion(content string) (string, error) {
	client := openai.NewClient("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")
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

func escapeNewline(rawStr *string) string {
	matchNewlines := regexp.MustCompile(`[\r\n]`)
	escapeNewlines := func(s string) string {
		return matchNewlines.ReplaceAllString(s, "\\n")
	}
	re := regexp.MustCompile(`"[^"\\]*(?:\\[\s\S][^"\\]*)*"`)
	return re.ReplaceAllStringFunc(*rawStr, escapeNewlines)
}

func escapeTabs(rawStr *string) string {
	matchTabs := regexp.MustCompile(`[\r\t]`)
	escapeTabs := func(s string) string {
		return matchTabs.ReplaceAllString(s, "\\t")
	}
	re := regexp.MustCompile(`"[^"\\]*(?:\\[\s\S][^"\\]*)*"`)
	return re.ReplaceAllStringFunc(*rawStr, escapeTabs)
}
