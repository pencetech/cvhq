package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.
// Code generated by github.com/99designs/gqlgen version v0.17.33

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"strconv"
	"strings"
	"time"

	"github.com/pencetech/cvhq/graph/model"
)

// EnhanceAchievement is the resolver for the enhanceAchievement field.
func (r *mutationResolver) EnhanceAchievement(ctx context.Context, input model.AchievementInput) (*model.EnhancedAchievement, error) {
	var enhanced model.EnhancedAchievement
	content, err := r.ChatBridge.InjectPrompt(r.ChatBridge.getEnhancementPrompt(), input)
	if err != nil {
		log.Println("ERROR: prompt injection failed -> ", err)
		return nil, err
	}

	objStr, err := r.ChatBridge.ChatCompletion(content)
	if err != nil {
		log.Println("ERROR: chat completion failed -> ", err)
		return nil, err
	}

	lineEscapedObjStr := r.ChatBridge.escapeNewline(&objStr)
	tabEscapedObjStr := r.ChatBridge.escapeTabs(&lineEscapedObjStr)
	err = json.Unmarshal([]byte(tabEscapedObjStr), &enhanced)
	if err != nil {
		log.Println("ERROR: JSON unmarshaling failed -> ", err)
		return nil, err
	}

	return &enhanced, nil
}

// GenerateCv is the resolver for the generateCV field.
func (r *mutationResolver) GenerateCv(ctx context.Context, input model.CvInput) (*model.CvFile, error) {
	var cv model.CvFile

	if input.CvContent.Summary == nil {
		summary, err := r.GenerateSummary(ctx, input)
		if err != nil {
			log.Println("ERROR: generate summary failed -> ", err)
			return nil, err
		}
		input.CvContent.Summary.Summary = summary.Summary
	}

	var resultStr string
	var err error

	if input.CvType != nil {
		resultStr, err = r.CVService.ConstructCV(*input.CvContent, *input.CvType)
		if err != nil {
			log.Println("ERROR: CV construction failed -> ", err)
			return nil, err
		}
	} else {
		resultStr, err = r.CVService.ConstructCV(*input.CvContent, model.CvTypeBase)
		if err != nil {
			log.Println("ERROR: CV construction failed -> ", err)
			return nil, err
		}
	}
	creationTime := time.Now().UTC()
	timeStr := strconv.FormatInt(creationTime.Unix(), 10)
	tabEscapedObjStr := r.ChatBridge.escapeTabs(&resultStr)
	filename := r.CVService.generateFileName(
		input.CvContent.UserBio.FirstName,
		input.CvContent.UserBio.LastName,
		input.JobPosting.Title,
		input.JobPosting.Company,
		timeStr)
	filenameNoSpace := strings.Replace(filename, " ", "", -1)
	err = r.CVService.PutCV(tabEscapedObjStr, filenameNoSpace)

	if err != nil {
		log.Println("ERROR: put CV failed -> ", err)
		return nil, err
	}

	cv.Filename = filenameNoSpace
	cv.CreatedAt = creationTime.Format(time.RFC3339)
	return &cv, nil
}

// GenerateSummary is the resolver for the generateSummary field.
func (r *mutationResolver) GenerateSummary(ctx context.Context, input model.CvInput) (*model.Summary, error) {
	var summary model.Summary

	content, err := r.ChatBridge.InjectPrompt(r.ChatBridge.getSummaryPrompt(), input)
	if err != nil {
		log.Println("ERROR: prompt injection failed -> ", err)
		return nil, err
	}
	summStr, err := r.ChatBridge.ChatCompletion(content)
	if err != nil {
		log.Println("ERROR: chat completion failed -> ", err)
		return nil, err
	}

	summary.Summary = summStr
	return &summary, nil
}

// Filename is the resolver for the filename field.
func (r *queryResolver) Filename(ctx context.Context) ([]*model.CvFile, error) {
	panic(fmt.Errorf("not implemented: Filename - filename"))
}

// Summary is the resolver for the summary field.
func (r *queryResolver) Summary(ctx context.Context, id string) (*model.Summary, error) {
	panic(fmt.Errorf("not implemented: Summary - summary"))
}

// Mutation returns MutationResolver implementation.
func (r *Resolver) Mutation() MutationResolver { return &mutationResolver{r} }

// Query returns QueryResolver implementation.
func (r *Resolver) Query() QueryResolver { return &queryResolver{r} }

type mutationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
