cd ../lambda
zip --symlinks -r sage.zip sage.py
aws s3 cp sage.zip s3://sage-codedeployment-bucket/build/sage.zip 

aws cloudformation update-stack \
--stack-name sage-development \
--template-body file://~/src/omni/cloudformation/cloudformation.yaml \
--capabilities CAPABILITY_NAMED_IAM
