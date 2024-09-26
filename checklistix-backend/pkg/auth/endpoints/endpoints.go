package endpoints

import (
	"gofr.dev/pkg/gofr"

	"github.com/braincompiler/checklistix/pkg/auth"
)

func NewEndpoints(app *gofr.App, svc auth.Service) {
	app.POST("/sign-up", signUp(svc))
	app.POST("/sign-in", signIn(svc))
	app.POST("/sign-out", signOut(svc))
}

func signUp(svc auth.Service) gofr.Handler {
	return func(ctx *gofr.Context) (interface{}, error) {
		return svc.SignUp(ctx)
	}
}

func signIn(svc auth.Service) gofr.Handler {
	return func(ctx *gofr.Context) (interface{}, error) {
		return svc.SignIn(ctx)
	}
}

func signOut(svc auth.Service) gofr.Handler {
	return func(ctx *gofr.Context) (interface{}, error) {
		return nil, svc.SignOut(ctx)
	}
}
