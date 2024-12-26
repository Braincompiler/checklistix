package constants

import "strings"

type ContextValueKey string
type RedisKey string

const (
	RedisKeyToken RedisKey = "Auth:Token:"

	AccessTokenKey ContextValueKey = "accessToken"
)

func Concat[ConstantsType RedisKey | ContextValueKey](c ConstantsType, s ...string) string {
	return string(c) + strings.Join(s, "")

}
