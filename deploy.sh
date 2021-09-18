#!/bin/bash

echo "Hello Docker-compose"

cd /home/ec2-user/deploy/visionnote-mac

docker-compose up -d --build

echo "Docker-compose started background"