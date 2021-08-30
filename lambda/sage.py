from __future__ import print_function
from datetime import datetime

import json
import boto3
import os

print('Loading function')

dynamodb = boto3.client('dynamodb')

def get_home(event, context):
    try:
        account_table_name = get_account_table_name()
        transaction_table_name = get_transaction_table_name()
        entry_table_name = get_entry_table_name()

        print('configurations retrieved: %s, %s, %s' % (account_table_name, transaction_table_name, entry_table_name))

        accounts = scan_table(account_table_name)
        transactions = scan_table(transaction_table_name)
        entries = scan_table(entry_table_name)

        response_body = {
            'accounts': accounts,
            'transactions': transactions,
            'entries': entries
        }

        response = create_response(200, json.dumps(response_body))
        return response
    except Exception as e:
        print(e)

def create_account(event, context):
    try:
        account_table_name = get_account_table_name()
        print('configurations retrieved: %s' % (account_table_name))

        body = json.loads(event['body'])
        account = body['account']
        dynamodb.put_item(
            TableName=account_table_name,
            Item={
                'AccountId': {'S': account.get('id')},
                'Name': {'S': account.get('name')},
                'Type': {'S': account.get('type')},
                'Category': {'S': account.get('category')},
                'ParentAccountId': {'S': account.get('parentAccountId', "")},
                'MaxValue': {'S': account.get('maxValue', "")}
            }
        )

        return create_response(200, None)
    except Exception as e:
        return create_response(500, e)

def create_response(statusCode, body):
    response = {
            'headers': {
                'Access-Control-Allow-Origin': '*'
            }
        }
    response['statusCode'] = statusCode
    response['body'] = body
    print('Response: %s' % (response))
    return response


def scan_table(table_name):
    response = dynamodb.scan(
        TableName=table_name
    )
    data = response['Items']

    while 'LastEvaluatedKey' in response:
        response = dynamodb.scan(
            TableName=table_name,
            ExclusiveStartKey=response['LastEvaluatedKey']
        )
        data.extend(response['Items'])

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
