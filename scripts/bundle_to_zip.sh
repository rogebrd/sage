cd ../backend
rm sage.zip
zip -r sage.zip .ebextentions 
zip -g sage.zip sage.py app.py Dockerfile requirements.txt docker-compose.yml
aws s3 cp sage.zip s3://sage-codedeployment-bucket/build/eb/
cd ../scripts