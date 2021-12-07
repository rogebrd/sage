# Configuration
Backend is configured to run through Elastic Beanstalk.

# Scripts
## bundle_to_zip.sh
- Bundles all backend python code along with dependencies and puts into code deployment bucket
- S3 zip file is meant to be used in Elastic Beanstalk to deploy code

## push_image.sh
- Pushes a new docker image to ECR