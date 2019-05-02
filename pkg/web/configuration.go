package web

import (
	"github.com/go-openapi/spec"
	"github.com/sirupsen/logrus"
)

type Configuration interface {
	Host() string
	Port() int
	Schema() spec.Schema
	ApiVersion() string
	Kind() string
	Form() Form
	CallBack(yamlString string)
}

func NewConfiguration(host string, port int, schema spec.Schema, apiVersion string, kind string, form Form, callback func(yamlString string)) Configuration {
	valid := true
	if port == 0 {
		port = 8080
	}
	if apiVersion == "" {
		logrus.Error("No apiVersion value provided")
		valid = false
	} else if kind == "" {
		logrus.Error("No kind value provided")
		valid = false
	} else if len(form.Pages) == 0 {
		logrus.Error("No valid form provided")
		valid = false
	} else if callback == nil {
		logrus.Error("No callback provided")
		valid = false
	}
	if !valid {
		logrus.Fatal("Configuration is invalid", host, port, schema, apiVersion, kind, form, callback)
	}
	return &configuration{host, port, schema, apiVersion, kind, form, callback}
}

type configuration struct {
	host       string
	port       int
	schema     spec.Schema
	apiVersion string
	kind       string
	form       Form
	callback   func(yaml string)
}

func (config *configuration) Host() string {
	return config.host
}

func (config *configuration) Port() int {
	return config.port
}

func (config *configuration) Schema() spec.Schema {
	return config.schema
}

func (config *configuration) ApiVersion() string {
	return config.apiVersion
}

func (config *configuration) Kind() string {
	return config.kind
}

func (config *configuration) Form() Form {
	return config.form
}

func (config *configuration) CallBack(yamlString string) {
	config.callback(yamlString)
}
