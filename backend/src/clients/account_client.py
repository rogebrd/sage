from typing import List
from model.account import Account
import boto3
import os
import logging


class AccountClient:
    def __init__(self):
        self.logger = logging.getLogger("AccountClient")
        self.dynamodb = boto3.client("dynamodb", region_name="us-west-2")
        self.account_table_name = os.getenv("ACCOUNT_TABLE_NAME")
        self.cached_accounts = []

    def get_all_accounts(self) -> List[Account]:
        self.logger.info("Attempting to fetch all accounts")
        if len(self.cached_accounts) != 0:
            return self.cached_accounts
        try:
            response = self.dynamodb.scan(TableName=self.account_table_name)
            data = response["Items"]

            while "LastEvaluatedKey" in response:
                response = self.dynamodb.scan(
                    TableName=self.account_table_name,
                    ExclusiveStartKey=response["LastEvaluatedKey"],
                )
                data.extend(response["Items"])

            return [Account.from_dynamodb(account) for account in data]
        except Exception as e:
            self.logger.error(e)

    def create_account(self, account: any):
        self.logger.info("Creating Account: %s" % (account))
        try:
            self.dynamodb.put_item(
                TableName=self.account_table_name,
                Item={
                    "AccountId": {"S": account.get("id")},
                    "Name": {"S": account.get("name")},
                    "Type": {"S": account.get("type")},
                    "Category": {"S": account.get("category")},
                    "ParentAccountId": {"S": account.get("parentAccountId", "")},
                    "MaxValue": {"S": account.get("maxValue", "")},
                },
            )

            self.cached_accounts = []
            return account.get("id")
        except Exception as e:
            self.logger.error(e)
            return None
