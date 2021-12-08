cd ../backend
rm sage.zip
zip -r sage.zip .ebextentions 
zip -r sage.zip src
zip -g sage.zip Dockerfile requirements.txt docker-compose.yml
aws s3 cp sage.zip s3://sage-codedeployment-bucket/build/eb/
cd ../scripts