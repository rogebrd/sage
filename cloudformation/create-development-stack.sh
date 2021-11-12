aws cloudformation create-stack \
--stack-name sage-prod \
--template-body file://~/src/omni/cloudformation/cloudformation.yaml \
--capabilities CAPABILITY_NAMED_IAM
