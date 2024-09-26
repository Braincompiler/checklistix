package utils

import (
	b64 "encoding/base64"
	"encoding/json"
)

func MarshallToB64[T any](o *T) (string, error) {
	oJson, err := json.Marshal(o)
	if err != nil {
		return "", err
	}

	return b64.StdEncoding.EncodeToString(oJson), nil
}

func UnmarshallFromB64[T any](s string) (*T, error) {
	b, err := b64.StdEncoding.DecodeString(s)
	if err != nil {
		return nil, err
	}

	var r T
	err = json.Unmarshal(b, &r)
	if err != nil {
		return nil, err
	}

	return &r, nil
}
