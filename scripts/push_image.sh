cd ../backend
aws ecr get-login-password --region us-west-2 | docker login --username AWS --password-stdin 506479314133.dkr.ecr.us-west-2.amazonaws.com
docker build -t sage-development .
docker tag sage-development:latest 506479314133.dkr.ecr.us-west-2.amazonaws.com/sage-development:latest
docker push 506479314133.dkr.ecr.us-west-2.amazonaws.com/sage-development:latest