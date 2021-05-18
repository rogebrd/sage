aws cloudformation create-stack \
--stack-name sage-development \
--template-body file://~/src/omni/cloudformation/cloudformation.yaml \
--capabilities CAPABILITY_NAMED_IAM
