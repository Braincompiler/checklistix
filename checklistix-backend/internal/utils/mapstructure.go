package utils

import (
	"github.com/go-viper/mapstructure/v2"
	"github.com/google/uuid"
	"reflect"
	"time"
)

func toTimeHookFunc() mapstructure.DecodeHookFunc {
	return func(f reflect.Type, t reflect.Type, data interface{}) (interface{}, error) {
		if t == reflect.TypeOf(time.Time{}) {
			switch f.Kind() {
			case reflect.String:
				return time.Parse(time.RFC3339, data.(string))
			case reflect.Float64:
				return time.Unix(0, int64(data.(float64))*int64(time.Millisecond)), nil
			case reflect.Int64:
				return time.Unix(0, data.(int64)*int64(time.Millisecond)), nil
			default:
				return data, nil
			}
		}

		if t == reflect.TypeOf(uuid.UUID{}) {
			if f.Kind() == reflect.String {
				return uuid.Parse(data.(string))
			}
		}

		return data, nil
	}
}

func Decode(input interface{}, result interface{}) error {
	decoder, err := mapstructure.NewDecoder(&mapstructure.DecoderConfig{
		Metadata: nil,
		DecodeHook: mapstructure.ComposeDecodeHookFunc(
			toTimeHookFunc()),
		Result: result,
	})
	if err != nil {
		return err
	}

	if err := decoder.Decode(input); err != nil {
		return err
	}

	return err
}
