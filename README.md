# Custom Resource Form Generation

[![Go Report Card](https://goreportcard.com/badge/github.com/RHsyseng/console-cr-form)](https://goreportcard.com/report/github.com/RHsyseng/console-cr-form)
[![Build Status](https://travis-ci.org/RHsyseng/console-cr-form.svg?branch=master)](https://travis-ci.org/RHsyseng/console-cr-form)

## Requirements

- go v1.10+
- dep v0.5.0+
- npm

## Temporary Build

### Generate bundle.js
Change to `frontend` directory and run:
```bash
npm install
npm run build
```

### Build executable to run/test
Change back to root directory and run:
```bash
go build cmd/testwebapp.go
```

## Run & Test
```bash
./testwebapp
```
