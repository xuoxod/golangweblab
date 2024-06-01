#!/usr/bin/env bash

pauseTime=2
sleepTime=5
cleaningTime=3

clear
figlet -cptW "Starting Up ...."
printf "
"
sleep $sleepTime
# clear
figlet -cptW "Building file 'genes' executable ..."
printf "
"
go build -o genes ./cmd/*.go
sleep $pauseTime
# clear
figlet -cptW "Locking it all up ..."
printf "
"
go mod tidy
sleep $pauseTime
# clear
figlet -cptW "... Executing genes file"
# Run the executable file that was created
./genes
sleep $cleaningTime
printf "Start Script Completed Successfully\n\n"
