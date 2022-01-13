from typing import List
from model.subtotal import Subtotal
from util import generate_uuid_key
from model.account import Account
import boto3
import os
import logging
import time


class SubtotalClient:
    def __init__(self):
        self.logger = logging.getLogger("SubtotalClient")
        self.dynamodb = boto3.client("dynamodb", region_name="us-west-2")
        self.subtotal_table_name = os.getenv("SUBTOTAL_TABLE_NAME")

    def get_account_subtotals(self, account: Account) -> List[Subtotal]:
        self.logger.info("Attempting to fetch subtotal - {}".format(account.name))

        try:
            response = self.dynamodb.scan(
                TableName=self.subtotal_table_name,
                FilterExpression="SubtotalTypeId = :account_id and SubtotalType = :subtotal_type",
                ExpressionAttributeValues={":account_id": {"S": account.id}, ":subtotal_type": {"S": "account"}},
            )
            data = response["Items"]

            while "LastEvaluatedKey" in response:
                response = self.dynamodb.scan(
                    TableName=self.entry_table_name,
                    ExclusiveStartKey=response["LastEvaluatedKey"],
                )
                data.extend(response["Items"])

            return [Subtotal.from_dynamodb(subtotal) for subtotal in data]
        except Exception as e:
            self.logger.error(e)
            return []

    def put_account_subtotal(self, account: Account, value: float) -> None:
        self.logger.info("Attempting to update subtotal - {}".format(account.name))

        try:
            self.dynamodb.put_item(
                TableName=self.subtotal_table_name,
                Item={
                    "SubtotalId": {"S": generate_uuid_key()},
                    "SubtotalType": {"S": "account"},
                    "SubtotalTypeId": {"S": account.id},
                    "Subtotal": {"N": str(value)},
                    "UpdateTime": {"N": str(time.time())}
                },
            )
        except Exception as e:
            self.logger.error(e)
            return -1


