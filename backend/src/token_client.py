from typing import Optional
import boto3
import os
import logging

class TokenClient:
    def __init__(self):
        self.logger = logging.getLogger("TokenClient")
        self.dynamodb = boto3.client('dynamodb', region_name='us-west-2')
        self.token_table_name = os.getenv("TOKEN_TABLE_NAME")

    def get_token(self, token_key: str) -> Optional[str]:
        self.logger.info("Attempting to fetch token: {}".format(token_key))
        try:
            item = self.dynamodb.get_item(
                TableName=self.token_table_name,
                Key={'TokenId': {'S': token_key}})
            return item['Item']['Token']['S']
        except Exception as e:
            self.logger.error(e)