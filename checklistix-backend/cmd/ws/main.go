package main

import (
	"github.com/braincompiler/checklistix/internal/middleware"
	"gofr.dev/pkg/gofr"
	"gofr.dev/pkg/gofr/datasource/redis"
	"gofr.dev/pkg/gofr/websocket"
	"net/http"
	"strings"
)

func main() {
	app := gofr.New()

	r := redis.NewClient(app.Config, app.Logger(), app.Metrics())
	app.UseMiddleware(middleware.Auth(r))

	app.OverrideWebsocketUpgrader(websocket.NewWSUpgrader(
		websocket.WithCheckOrigin(func(*http.Request) bool { return true }),
		//websocket.WithCompression(),
		//websocket.WithSubprotocols("checklistix", "websocket"),
	))
	app.WebSocket("/", wsHandler)
	app.Run()
}

type WSMessage struct {
	Type string `json:"type"`
	Data string `json:"data"`
}

func wsHandler(ctx *gofr.Context) (interface{}, error) {
	var message WSMessage

	err := ctx.Bind(&message)
	if err != nil {
		ctx.Logger.Errorf("Error binding message: %v", err)
		return nil, err
	}

	ctx.Logger.Infof("Received message: %v", message)

	err = ctx.WriteMessageToSocket(WSMessage{
		Type: "response",
		Data: "Hello GoFr!",
	})
	if err != nil {
		return nil, err
	}

	message.Change()

	return message, nil
}

func (m *WSMessage) Change() {
	m.Data = strings.ToUpper(m.Data)
}
