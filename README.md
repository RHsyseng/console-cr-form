# Custom Resource Form Generation

[![Go Report](https://goreportcard.com/badge/github.com/kiegroup/kie-cloud-operator)](https://goreportcard.com/report/github.com/kiegroup/kie-cloud-operator)

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

