package supabase

import (
	"context"
	"github.com/braincompiler/checklistix/internal"
	"github.com/braincompiler/checklistix/internal/constants"
	"github.com/braincompiler/checklistix/internal/errors"
	"github.com/supabase-community/gotrue-go"

	"github.com/supabase-community/supabase-go"
)

func NewClientWithOptions(opts *supabase.ClientOptions) (*supabase.Client, error) {
	return supabase.NewClient(
		internal.EnvString("SUPABASE_URL", ""),
		internal.EnvString("SUPABASE_ACCESS_TOKEN", ""),
		opts,
	)
}

func NewClientWithAccessToken(accessToken string) (*supabase.Client, error) {
	return NewClientWithOptions(&supabase.ClientOptions{
		Headers: map[string]string{
			"Authorization": "Bearer " + accessToken,
		},
	})
}

func NewClientWithContext(ctx context.Context) (*supabase.Client, error) {
	value := ctx.Value(constants.AccessTokenKey)
	if value == nil {
		return nil, errors.NewMissingAccessTokenError("context")
	}

	accessToken := value.(string)

	return NewClientWithOptions(&supabase.ClientOptions{
		Headers: map[string]string{
			"Authorization": "Bearer " + accessToken,
		},
	})
}

func NewSupabaseClient() (*supabase.Client, error) {
	return NewClientWithOptions(nil)
}

func NewAuthClient() (gotrue.Client, error) {
	client, err := NewSupabaseClient()
	if err != nil {
		return nil, err
	}

	return client.Auth, nil
}

func NewAuthClientWithAccessToken(accessToken string) (gotrue.Client, error) {
	client, err := NewClientWithOptions(&supabase.ClientOptions{
		Headers: map[string]string{
			"Authorization": "Bearer " + accessToken,
		},
	})
	if err != nil {
		return nil, err
	}

	return client.Auth.WithToken(accessToken), nil
}

func NewAuthClientWithContext(ctx context.Context) (gotrue.Client, error) {
	value := ctx.Value(constants.AccessTokenKey)
	if value == nil {
		return nil, errors.NewMissingAccessTokenError("context")
	}

	accessToken := value.(string)

	return NewAuthClientWithAccessToken(accessToken)
}
