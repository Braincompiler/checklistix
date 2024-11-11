package errors

import (
	"fmt"
	"net/http"
)

type MissingAccessTokenError struct {
	where string
}

func NewMissingAccessTokenError(where string) *MissingAccessTokenError {
	return &MissingAccessTokenError{where: where}
}

func (c MissingAccessTokenError) Error() string {
	return fmt.Sprintf("Missing access token in %s", c.where)
}

func (c MissingAccessTokenError) StatusCode() int {
	return http.StatusUnauthorized
}
