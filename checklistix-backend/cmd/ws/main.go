package main

import (
	"context"
	"github.com/braincompiler/checklistix/internal/middleware"
	"github.com/braincompiler/checklistix/internal/models"
	"github.com/braincompiler/checklistix/internal/utils"
	"github.com/braincompiler/checklistix/pkg/checklists/endpoints/grpc"
	"gofr.dev/pkg/gofr"
	"gofr.dev/pkg/gofr/datasource/redis"
	"gofr.dev/pkg/gofr/websocket"
	ngrpc "google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
	"google.golang.org/protobuf/types/known/timestamppb"
	"net/http"
)

type WSMessageType string

var (
	UpdateChecklist WSMessageType = "UpdateChecklist"
)

func main() {
	app := gofr.New()

	r := redis.NewClient(app.Config, app.Logger(), app.Metrics())
	app.UseMiddleware(middleware.Auth(r))

	//mapstructure.
	app.OverrideWebsocketUpgrader(websocket.NewWSUpgrader(
		websocket.WithCheckOrigin(func(*http.Request) bool { return true }),
		//websocket.WithCompression(),
		websocket.WithSubprotocols("Authorization", "websocket"),
	))
	app.WebSocket("/", wsHandler)
	app.Run()
}

type WSMessage struct {
	Type WSMessageType `json:"type"`
	Data interface{}   `json:"data"`
}

func wsHandler(ctx *gofr.Context) (interface{}, error) {
	var message WSMessage

	err := ctx.Bind(&message)
	if err != nil {
		ctx.Logger.Errorf("Error binding message: %v", err)

		return nil, err
	}

	ctx.Logger.Infof("Received message type: %s", message.Type)

	var checklist models.Checklist
	err = utils.Decode(message.Data, &checklist)
	if err != nil {
		return nil, err
	}

	ctx.Logger.Infof("Checklist: %v", checklist)

	conn, err := ngrpc.NewClient("localhost:8091", ngrpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		return nil, err
	}

	client := grpc.NewChecklistsGrpcServiceClient(conn)
	updatedChecklist, err := client.UpdateChecklist(context.Background(), &grpc.Checklist{
		Id:              checklist.Id.String(),
		Title:           checklist.Title,
		Created:         timestamppb.New(checklist.Created),
		Updated:         timestamppb.New(checklist.Updated),
		Style:           string(checklist.Style),
		PageSize:        string(checklist.PageSize),
		PageOrientation: string(checklist.PageOrientation),
		Columns:         int64(checklist.Columns),
		FontSize:        int64(checklist.FontSize),
		BorderThickness: int64(checklist.BorderThickness),
		FontFamily:      checklist.FontFamily,
		DefaultColor:    checklist.DefaultColor,
	})
	if err != nil {
		return nil, err
	}

	ctx.Logger.Infof("updated Checklist: %v", updatedChecklist)

	//err = ctx.WriteMessageToSocket(WSMessage{
	//	Type: "response",
	//	Data: "Hello GoFr!",
	//})
	//if err != nil {
	//	return nil, err
	//}
	//
	//message.Change()

	//return message, nil
	return nil, nil
}

//func (m *WSMessage) Change() {
//	m.Data = strings.ToUpper(m.Data)
//}
