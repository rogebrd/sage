from typing import List
from model.transaction import Transaction
import boto3
import os
import logging

class TransactionClient:
    def __init__(self):
        self.logger = logging.getLogger("TransactionClient")
        self.dynamodb = boto3.client('dynamodb', region_name='us-west-2')
        self.transaction_table_name = os.getenv("TRANSACTION_TABLE_NAME")

    def get_all_transactions(self) -> List[Transaction]:
        self.logger.info("Attempting to fetch all transactions")
        try:
            response = self.dynamodb.scan(
                    TableName=self.transaction_table_name
                    )
            data = response['Items']

            while 'LastEvaluatedKey' in response:
                response = self.dynamodb.scan(
                    TableName=self.transaction_table_name,
                    ExclusiveStartKey=response['LastEvaluatedKey']
                )
                data.extend(response['Items'])

            return [Transaction.from_dynamodb(transaction) for transaction in data]
        except Exception as e:
            self.logger.error(e)
            return []
    
    