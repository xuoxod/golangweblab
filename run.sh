#! /usr/bin/bash

clear

go build -o weblab ./cmd/web/*.go

./weblab
