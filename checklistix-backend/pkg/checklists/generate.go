package checklists

//go:generate protoc --go_out=endpoints/grpc --go_opt=paths=source_relative --go-grpc_out=endpoints/grpc --go-grpc_opt=paths=source_relative checklists.proto
