package graph

import "github.com/pencetech/cvhq/graph/model"
// This file will not be regenerated automatically.
//
// It serves as dependency injection for your app, add any dependencies you require here.

type Resolver struct{
	ProfileStore map[string]model.Profile
}
