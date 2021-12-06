from __future__ import print_function
from datetime import datetime

import json
import boto3
import os

print('Loading function')

dynamodb = boto3.client('dynamodb', region_name='us-west-2')

def get_home(logger):
    try:
        account_table_name = get_account_table_name()
        transaction_table_name = get_transaction_table_name()
        entry_table_name = get_entry_table_name()

        logger.info('configurations retrieved: %s, %s, %s' % (account_table_name, transaction_table_name, entry_table_name))

        accounts = scan_table(account_table_name)
        transactions = scan_table(transaction_table_name)
        entries = scan_table(entry_table_name)

        response_body = {
            'accounts': accounts,
            'transactions': transactions,
            'entries': entries
        }

        response = json.dumps(response_body)
        return response
    except Exception as e:
        logger.error(e)

def create_account(account, logger):
    try:
        account_table_name = get_account_table_name()
        logger.info('configurations retrieved: %s' % (account_table_name))

        body = json.loads(account)
        account = body['account']
        logger.info('Putting item: {}'.format(account))
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

        return None
    except Exception as e:
        logger.error(e)

def create_transaction(transaction, logger):
    try:
        transaction_table_name = get_transaction_table_name()
        entry_table_name = get_entry_table_name()
        logger.info('configurations retrieved: %s %s' % (transaction_table_name, entry_table_name))

        body = json.loads(transaction)
        transaction = body['transaction']
        logger.info('Putting item: {}'.format(transaction))
        dynamodb.put_item(
            TableName=transaction_table_name,
            Item={
                'TransactionId': {'S': transaction.get('id')},
                'EntryIds': {'SS': transaction.get('entryIds')},
            }
        )

        entries = body['entries']
        for entry in entries:
            logger.info('Putting item: {}'.format(entry))
            item = {
                    'EntryId': {'S': entry.get('id')},
                    'AccountId': {'S': entry.get('accountId')},
                    'Style': {'S': entry.get('style')},
                    'Amount': {'S': str(entry.get('amount'))},
                    'Date': {'N': entry.get('date')},
                    'Description': {'S': entry.get('description')},
                    'Category': {'S': entry.get('category')},
                }
            if len(entry.get('tags')) != 0:
                item['Tags'] = {'SS': entry.get('tags')}
            dynamodb.put_item(
                TableName=entry_table_name,
                Item=item
            )

        return None
    except Exception as e:
        logger.error(e)


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
