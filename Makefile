# kernel-style V=1 build verbosity
ifeq ("$(origin V)", "command line")
       BUILD_VERBOSE = $(V)
endif

ifeq ($(BUILD_VERBOSE),1)
       Q =
else
       Q = @
endif

# VERSION = $(shell git describe --dirty --tags --always)
# REPO = github.com/RHsyseng/console-cr-form

.PHONY: all
all: build

.PHONY: npm
npm:
	cd frontend; npm install
	npm --prefix frontend run build

.PHONY: npm-watch
npm-watch:
	cd frontend; npm run watch

.PHONY: mod
mod: vet fmt
	$(Q)go mod tidy
	$(Q)go mod vendor

.PHONY: go-generate
go-generate: mod
	$(Q)go generate -mod=vendor ./...

.PHONY: vet
vet:
	$(Q)go vet ./...

.PHONY: fmt
fmt:
	$(Q)gofmt -s -l -w cmd/ pkg/

.PHONY: build
build: go-generate npm
	CGO_ENABLED=0 go build -v -mod=vendor -a -o build/console-cr-form ./cmd

.PHONY: clean
clean:
	rm -rf build/ frontend/node_modules/