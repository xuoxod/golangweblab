#! /usr/bin/bash

clear
ls
sleep 1
rm ./weblab
ls
sleep 1
go build -o weblab ./cmd/web/*.go
ls
sleep 1
clear
sleep 1
./weblab
