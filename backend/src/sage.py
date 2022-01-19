from __future__ import print_function
from datetime import datetime

import json
import boto3
import os

from util import generate_uuid_key

print("Loading function")

dynamodb = boto3.client("dynamodb", region_name="us-west-2")


def create_transaction(transaction, logger, account_total_manager):
    try:
        transaction_table_name = get_transaction_table_name()
        entry_table_name = get_entry_table_name()
        logger.info(
            "configurations retrieved: %s %s"
            % (transaction_table_name, entry_table_name)
        )

        body = json.loads(transaction)
        transaction = body["transaction"]
        logger.info("Putting item: {}".format(transaction))
        transaction_key = generate_uuid_key()

        entries = body["entries"]
        entry_keys = []
        for entry in entries:
            entry_key = generate_uuid_key()
            logger.info("Putting item: {}".format(entry))
            item = {
                "EntryId": {"S": entry_key},
                "AccountId": {"S": entry.get("accountId")},
                "TransactionId": {"S": transaction_key},
                "Style": {"S": entry.get("style")},
                "Amount": {"S": str(entry.get("amount"))},
                "Date": {"N": entry.get("date")},
                "Description": {"S": entry.get("description")},
                "Category": {"S": entry.get("category")},
            }
            if len(entry.get("tags")) != 0:
                item["Tags"] = {"SS": entry.get("tags")}
            dynamodb.put_item(TableName=entry_table_name, Item=item)
            entry_keys.append(entry_key)
            account_total_manager.invalidate_account_subtotal(entry.get("accountId"))

        dynamodb.put_item(
            TableName=transaction_table_name,
            Item={
                "TransactionId": {"S": transaction_key},
                "Date": {"N": transaction.get("date")},
                "EntryIds": {"SS": entry_keys},
            },
        )

        return None
    except Exception as e:
        logger.error(e)


def scan_table(table_name):
    response = dynamodb.scan(TableName=table_name)
    data = response["Items"]

    while "LastEvaluatedKey" in response:
        response = dynamodb.scan(
            TableName=table_name, ExclusiveStartKey=response["LastEvaluatedKey"]
        )
        data.extend(response["Items"])

    return data


def get_account_table_name():
    account_table_name = os.getenv("ACCOUNT_TABLE_NAME")
    return account_table_name


def get_transaction_table_name():
    transaction_table_name = os.getenv("TRANSACTION_TABLE_NAME")
    return transaction_table_name


def get_entry_table_name():
    entry_table_name = os.getenv("ENTRY_TABLE_NAME")
    return entry_table_name
