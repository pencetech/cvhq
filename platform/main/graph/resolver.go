package graph

// This file will not be regenerated automatically.
//
// It serves as dependency injection for your app, add any dependencies you require here.

type Resolver struct{
	CVService *CVService
	ChatBridge *ChatBridge
}

func NewResolver(CVService *CVService, ChatBridge *ChatBridge) *Resolver {
	return &Resolver{
		CVService: CVService,
		ChatBridge: ChatBridge,
	}
}