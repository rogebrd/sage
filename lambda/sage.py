from __future__ import print_function
from datetime import datetime

import json
import boto3
import os

print('Loading function')

dynamodb = boto3.client('dynamodb')

def get(event, context):
    account_table_name = os.getenv("ACCOUNT_TABLE_NAME")
    transaction_table_name = os.getenv("TRANSACTION_TABLE_NAME")

    account_table = dynamodb.Table(account_table_name)
    transaction_table = dynamodb.Table(transaction_table_name)

    accounts = scan_table(account_table)
    transactions = scan_table(transaction_table)

    return json.dumps(
        {
            'accounts': accounts,
            'transactions': transactions
        }
    )

def scan_table(table):
    response = table.scan()
    data = response['Items']

    while 'LastEvaluatedKey' in response:
        response = table.scan(ExclusiveStartKey=response['LastEvaluatedKey'])
        data.extend(response['Items'])

    return data
