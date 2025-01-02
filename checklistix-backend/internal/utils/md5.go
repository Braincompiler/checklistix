package utils

import (
	"crypto/md5"
	"encoding/base64"
	"encoding/hex"
)

func Md5(s string) string {
	hash := md5.Sum([]byte(s))

	return hex.EncodeToString(hash[:])
}

func Md5B64(s string) string {
	hash := md5.Sum([]byte(s))

	return base64.StdEncoding.EncodeToString(hash[:])
}
