package main

import (
	"github.com/pencetech/cvhq/graph"
	"go.uber.org/dig"
)

func BuildContainer() *dig.Container {
	container := dig.New()

	container.Provide(graph.NewConfiguration)
	container.Provide(graph.NewCVService)
	container.Provide(graph.NewResolver)
	// This is redundant for now as graphql.ExecutableSchema is directly injected into server, but putit here for completeness
	container.Provide(graph.NewChatBridge)
	container.Provide(NewServer)
	
	return container
}

func main() {
	container := BuildContainer()

	err := container.Invoke(func(server *Server) {
		server.Run()
	})

	if err != nil {
		panic(err)
	}
}