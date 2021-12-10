from typing import List, Optional
from model.entry import Entry
from model.account import Account
import boto3
from boto3.dynamodb.conditions import Attr
import os
import logging

class EntryClient:
    def __init__(self):
        self.logger = logging.getLogger("EntryClient")
        self.dynamodb = boto3.client('dynamodb', region_name='us-west-2')
        self.entry_table_name = os.getenv("ENTRY_TABLE_NAME")

    def get_all_entries(self) -> List[Entry]:
        self.logger.info("Attempting to fetch all entries")
        try:
            response = self.dynamodb.scan(
                    TableName=self.entry_table_name
                    )
            data = response['Items']

            while 'LastEvaluatedKey' in response:
                response = self.dynamodb.scan(
                    TableName=self.entry_table_name,
                    ExclusiveStartKey=response['LastEvaluatedKey']
                )
                data.extend(response['Items'])

            return data
        except Exception as e:
            self.logger.error(e)
            return []

    def get_entries_for_account(self, account: Account) -> Optional[List[Entry]]:
        self.logger.info("Attempting to fetch all entries for account - {}".format(account.name))
        try:
            account_id = account.id
            response = self.dynamodb.scan(
                    TableName=self.entry_table_name,
                    FilterExpression="AccountId = :account_id",
                    ExpressionAttributeValues={":account_id":{"S":account_id}}
                    )
            data = response['Items']

            while 'LastEvaluatedKey' in response:
                response = self.dynamodb.scan(
                    TableName=self.entry_table_name,
                    ExclusiveStartKey=response['LastEvaluatedKey']
                )
                data.extend(response['Items'])

            return [Entry.from_dynamodb(entry) for entry in data]
        except Exception as e:
            self.logger.error(e)
            return []
        return None
    
    