#!/bin/bash



aws ecr get-login-password --profile rishi-all-john | docker login --username AWS --password-stdin 885181169453.dkr.ecr.ap-south-1.amazonaws.com


# Build the Docker image
docker build -t solana_monitor_lambda .

# Tag the Docker image
docker tag solana_monitor_lambda:latest 885181169453.dkr.ecr.us-east-1.amazonaws.com/solana_monitor_lambda:latest

# Push the Docker image to ECR
docker push 885181169453.dkr.ecr.us-east-1.amazonaws.com/solana_monitor_lambda:latest

# Deploy using Serverless Framework
sls deploy