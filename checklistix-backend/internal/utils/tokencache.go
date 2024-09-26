package utils

import (
	"context"
	"errors"
	"github.com/braincompiler/checklistix/internal/constants"
	"github.com/redis/go-redis/v9"
	"github.com/supabase-community/gotrue-go/types"
	"gofr.dev/pkg/gofr/container"
)

func GetTokenResponseFromRedis(redisContainer container.Redis, token string, ctx context.Context) (*types.TokenResponse, error) {
	hash := Md5(token)
	tokenResponseB64 := redisContainer.Get(ctx, constants.RedisKeyToken+hash).Val()
	if tokenResponseB64 == "" {
		return nil, errors.New("no token response found in cache")
	}

	tokenResponse, err := UnmarshallFromB64[types.TokenResponse](tokenResponseB64)
	if err != nil {
		return nil, err
	}

	return tokenResponse, nil
}

func StoreTokenResponseToRedis(redisContainer container.Redis, tokenResponse *types.TokenResponse, ctx context.Context) error {
	tokenResponseB64, err := MarshallToB64(tokenResponse)
	if err != nil {
		return errors.Join(errors.New("error marshalling token response"), err)
	}

	hash := Md5(tokenResponse.AccessToken)
	err = redisContainer.Set(ctx, constants.RedisKeyToken+hash, tokenResponseB64, 0).Err()
	if err != nil && !errors.Is(err, redis.Nil) {
		return errors.Join(errors.New("error storing token in cache"), err)
	}

	return nil
}

func DeleteTokenResponseFromRedis(redisContainer container.Redis, ctx context.Context) error {
	accessToken := ctx.Value("accessToken").(string)

	return DeleteTokenResponseFromRedisWithAccessToken(redisContainer, ctx, accessToken)
}

func DeleteTokenResponseFromRedisWithAccessToken(redisContainer container.Redis, ctx context.Context, accessToken string) error {
	hash := Md5(accessToken)
	err := redisContainer.Del(ctx, constants.RedisKeyToken+hash).Err()
	if err != nil {
		return err
	}

	return nil
}
