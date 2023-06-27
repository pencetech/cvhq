package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.
// Code generated by github.com/99designs/gqlgen version v0.17.33

import (
	"context"
	"encoding/json"
	"fmt"
	"log"

	"github.com/pencetech/cvhq/graph/model"
)

// CreateProfile is the resolver for the createProfile field.
func (r *mutationResolver) CreateProfile(ctx context.Context, input model.ProfileInput) (*model.Profile, error) {
	panic(fmt.Errorf("not implemented: CreateProfile - createProfile"))
}

// EnhanceAchievement is the resolver for the enhanceAchievement field.
func (r *mutationResolver) EnhanceAchievement(ctx context.Context, input model.AchievementInput) (*model.EnhancedAchievement, error) {
	var enhanced model.EnhancedAchievement
	content, err := InjectPrompt(EnhanceAchievementPrompt, input)
	if err != nil {
		log.Println("ERROR: prompt injection failed -> ", err)
		return nil, err
	}

	objStr, err := ChatCompletion(content)
	if err != nil {
		log.Println("ERROR: chat completion failed -> ", err)
		return nil, err
	}

	lineEscapedObjStr := escapeNewline(&objStr)
	tabEscapedObjStr := escapeTabs(&lineEscapedObjStr)
	err = json.Unmarshal([]byte(tabEscapedObjStr), &enhanced)
	if err != nil {
		log.Println("ERROR: JSON unmarshaling failed -> ", err)
		return nil, err
	}

	return &enhanced, nil
}

// GenerateCv is the resolver for the generateCV field.
func (r *mutationResolver) GenerateCv(ctx context.Context, input model.ProfileInput) (*model.Cv, error) {
	var cv model.Cv
	inputBytes, err := json.Marshal(input)
	if err != nil {
		log.Println("ERROR: JSON marshaling failed -> ", err)
	}

	content := fmt.Sprintf(GenerateCVPrompt, string(inputBytes))
	objStr, err := ChatCompletion(content)
	if err != nil {
		log.Println("ERROR: chat completion failed -> ", err)
		return nil, err
	}
	fmt.Println("MD received")
	lineEscapedObjStr := escapeNewline(&objStr)
	tabEscapedObjStr := escapeTabs(&lineEscapedObjStr)
	filename := generateFileName(input.UserBio.FirstName, input.UserBio.LastName)
	err = PutCV(tabEscapedObjStr, filename)

	if err != nil {
		log.Println("ERROR: put CV failed -> ", err)
		return nil, err
	}

	cv.Filename = filename
	return &cv, nil
}

// Profile is the resolver for the profile field.
func (r *queryResolver) Profile(ctx context.Context) (*model.Profile, error) {
	panic(fmt.Errorf("not implemented: Profile - profile"))
}

// Mutation returns MutationResolver implementation.
func (r *Resolver) Mutation() MutationResolver { return &mutationResolver{r} }

// Query returns QueryResolver implementation.
func (r *Resolver) Query() QueryResolver { return &queryResolver{r} }

type mutationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
