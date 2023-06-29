package main

import (
	"log"
	"net/http"
	"context"
	"bytes"
	"os"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/pencetech/cvhq/graph"
	"github.com/go-chi/chi"
	"github.com/rs/cors"
)

const defaultPort = "8080"

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = defaultPort
	}

	router := chi.NewRouter()

	// Add CORS middleware around every request
	// See https://github.com/rs/cors for full option listing
	router.Use(cors.New(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowCredentials: true,
		Debug:            true,
	}).Handler)

	srv := handler.NewDefaultServer(graph.NewExecutableSchema(graph.Config{Resolvers: &graph.Resolver{}}))

	router.Handle("/", playground.Handler("GraphQL playground", "/query"))
	router.Handle("/query", srv)
	router.Route("/cv", func(r chi.Router) {
		r.Route("/{filename}", func(r chi.Router) {
			r.Use(CvCtx)
			r.Get("/", getCV)
		})
		r.Route("/create", func(r chi.Router) {
			r.Put("/", createCV)
		})
	})

	log.Printf("connect to http://localhost:%s/ for GraphQL playground", port)
	log.Fatal(http.ListenAndServe(":"+port, router))
}

func CvCtx(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
	  filename := chi.URLParam(r, "filename")
	  fileReader, err := graph.GetCV(filename)
	  if err != nil {
		http.Error(w, http.StatusText(404), 404)
		return
	  }
	  ctx := context.WithValue(r.Context(), "file", fileReader)
	  next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func createCV(w http.ResponseWriter, r *http.Request) {
	markdown := r.Body
	defer r.Body.Close()
	buf := new(bytes.Buffer)
	buf.ReadFrom(markdown)
	markdownBytes := buf.Bytes()
	htmlByte := graph.MdToHtml(markdownBytes)
	pdfByte := graph.HtmlToPdf(htmlByte)

	header := w.Header()
	header.Add("Content-Type", "application/pdf")
	w.Write(pdfByte)
}

func getCV(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	file, ok := ctx.Value("file").([]byte)
	if !ok {
	  http.Error(w, http.StatusText(422), 422)
	  return
	}

	header := w.Header()
	header.Add("Content-Type", "application/pdf")
	w.Write(file)
  }