package middleware

import (
	"context"
	"github.com/braincompiler/checklistix/internal/supabase"
	"net/http"
	"strings"
	"time"

	"github.com/braincompiler/checklistix/internal/utils"
	"gofr.dev/pkg/gofr/container"
)

func Auth(redis container.Redis) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			authHeader := r.Header.Get("Authorization")

			if authHeader != "" {
				headerParts := strings.Split(authHeader, " ")
				if len(headerParts) != 2 && strings.ToLower(headerParts[0]) != "Bearer" {
					http.Error(w, "Authorization header format must be Bearer {token}", http.StatusUnauthorized)
					return
				}

				token := headerParts[1]

				// @TODO: We need 2 ways:
				// 1. if "rememberMe" is false and the user was inactive for 1 hr the token expired and user is logged out
				// 2. if "rememberMe" is true the token will be refreshed as soon as the user is active again (Question: Should we have a max limit of inactivity for this kind of refreshing? 1 year?)
				// For expiration using the redis TTL, so if the Get returns nil or err != nil then the token is expired -> SignIn Page

				if redis != nil {
					// @TODO: Skip this on /sign-out request
					tokenResponse, err := utils.GetTokenResponseFromRedis(redis, token, r.Context())
					if err != nil {
						http.Error(w, err.Error(), http.StatusUnauthorized)
					}

					authClient, err := supabase.NewAuthClientWithAccessToken(token)
					if err != nil {
						http.Error(w, err.Error(), http.StatusUnauthorized)
						return
					}

					expiresAt := time.Unix(tokenResponse.ExpiresAt, 0) //.Add(-(5 * time.Minute))
					if time.Now().After(expiresAt) {
						if err != nil {
							http.Error(w, err.Error(), http.StatusUnauthorized)
							return
						}

						err := utils.DeleteTokenResponseFromRedisWithAccessToken(redis, r.Context(), token)
						if err != nil {
							http.Error(w, err.Error(), http.StatusUnauthorized)
							return
						}

						refreshTokenResponse, err := authClient.RefreshToken(tokenResponse.RefreshToken)
						if err != nil {
							http.Error(w, err.Error(), http.StatusUnauthorized)
							return
						}

						err = utils.StoreTokenResponseToRedis(redis, refreshTokenResponse, r.Context())
						if err != nil {
							http.Error(w, err.Error(), http.StatusUnauthorized)
							return
						}

						token = refreshTokenResponse.AccessToken
						w.Header().Set("X-New-Token", token)
					}
				}

				//w.Header().Set("X-New-Token", token)
				ctx := context.WithValue(r.Context(), "accessToken", token)
				*r = *r.Clone(ctx)
			}

			next.ServeHTTP(w, r)
		})
	}
}
