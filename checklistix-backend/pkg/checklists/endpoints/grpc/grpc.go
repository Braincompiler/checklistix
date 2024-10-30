package grpc

//type Handler struct {
//	// container can be embedded into the server struct
//	// to access the datasource and logger functionalities
//	*container.Container
//
//	svc checklists.Service
//
//	UnimplementedChecklistsGrpcServiceServer
//}
//
//func NewGrpcServer(app *gofr.App, svc checklists.Service) {
//	RegisterChecklistsGrpcServiceServer(app, &Handler{
//		svc: svc,
//	})
//}
//
//func (h *Handler) UpdateChecklist(ctx context.Context, checklist *Checklist) (*Checklist, error) {
//	h.Logger.Infof("updating checklist: %v", checklist)
//
//	id, err := uuid.Parse(checklist.Id)
//	if err != nil {
//		return nil, err
//	}
//
//	//updatedChecklist, err := h.svc.Update(ctx, &models.Checklist{
//	//	ChecklistWithoutItems: &models.Checklist{
//	//		Title:           checklist.Title,
//	//		Created:         checklist.Created.AsTime(),
//	//		Updated:         time.Now(),
//	//		Style:           models.ChecklistStyle(checklist.Style),
//	//		PageSize:        models.PageSize(checklist.PageSize),
//	//		PageOrientation: models.PageOrientation(checklist.PageOrientation),
//	//		Columns:         int(checklist.Columns),
//	//		FontSize:        int(checklist.FontSize),
//	//		BorderThickness: models.BorderThickness(checklist.BorderThickness),
//	//		FontFamily:      checklist.FontFamily,
//	//		DefaultColor:    checklist.DefaultColor,
//	//	},
//	//	Id: id,
//	//})
//	if err != nil {
//		return nil, err
//	}
//
//	return &Checklist{
//		Id:              updatedChecklist.Id.String(),
//		Title:           updatedChecklist.Title,
//		Created:         timestamppb.New(updatedChecklist.Created),
//		Updated:         timestamppb.New(updatedChecklist.Updated),
//		Style:           string(updatedChecklist.Style),
//		PageSize:        string(updatedChecklist.PageSize),
//		PageOrientation: string(updatedChecklist.PageOrientation),
//		Columns:         int64(updatedChecklist.Columns),
//		FontSize:        int64(updatedChecklist.FontSize),
//		BorderThickness: int64(updatedChecklist.BorderThickness),
//		FontFamily:      updatedChecklist.FontFamily,
//		DefaultColor:    updatedChecklist.DefaultColor,
//	}, nil
//	// status.Errorf(codes.Unimplemented, "method UpdateChecklist not implemented")
//}
