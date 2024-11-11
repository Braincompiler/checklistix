package auth

import (
	"github.com/braincompiler/checklistix/internal/models"
	"github.com/braincompiler/checklistix/internal/supabase"
	"github.com/braincompiler/checklistix/internal/utils"
	"github.com/supabase-community/gotrue-go/types"
	"gofr.dev/pkg/gofr"
)

type Service interface {
	SignUp(*gofr.Context) (*types.SignupResponse, error)
	SignIn(*gofr.Context) (*types.TokenResponse, error)
	SignOut(*gofr.Context) error
}

type authService struct{}

func NewService() Service {
	return &authService{}
}

func (s *authService) SignUp(ctx *gofr.Context) (*types.SignupResponse, error) {
	var authFormData models.AuthForm

	err := ctx.Bind(&authFormData)
	if err != nil {
		return nil, err
	}

	client, err := supabase.NewAuthClient()
	if err != nil {
		return nil, err
	}

	signupResponse, err := client.Signup(types.SignupRequest{
		Email:    authFormData.Email,
		Password: authFormData.Password,
	})
	if err != nil {
		return nil, err
	}

	return signupResponse, nil
}

func (s *authService) SignIn(ctx *gofr.Context) (*types.TokenResponse, error) {
	var authFormData models.AuthForm

	err := ctx.Bind(&authFormData)
	if err != nil {
		return nil, err
	}

	client, err := supabase.NewAuthClient()
	if err != nil {
		return nil, err
	}

	tokenResponse, err := client.SignInWithEmailPassword(
		authFormData.Email,
		authFormData.Password,
	)
	if err != nil {
		return nil, err
	}

	err = utils.StoreTokenResponseToRedis(ctx.Redis, tokenResponse, ctx.Context)
	if err != nil {
		return nil, err
	}

	return tokenResponse, nil
}

func (s *authService) SignOut(ctx *gofr.Context) error {
	client, err := supabase.NewAuthClientWithContext(ctx.Request.Context())
	if err != nil {
		return err
	}

	err = utils.DeleteTokenResponseFromRedis(ctx.Redis, ctx.Context)
	if err != nil {
		return err
	}

	return client.Logout()
}
