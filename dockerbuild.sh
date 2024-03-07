#!/bin/sh

docker build . -t simbafs/sitcon_countdown:$1

docker image save simbafs/sitcon_countdown:$1 -o sitcon_countdown.tar
