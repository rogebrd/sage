from typing import List
from clients.stock_client import StockClient
from clients.entry_client import EntryClient
from clients.account_client import AccountClient
from clients.subtotal_client import SubtotalClient
from model.account import Account
import boto3
import os
import logging
import functools
import operator


class AccountTotalManager:
    def __init__(
        self,
        account_client: AccountClient,
        subtotal_client: SubtotalClient,
        entry_client: EntryClient,
        stock_client: StockClient,
    ):
        self.logger = logging.getLogger("AccountTotalManager")
        self.account_client = account_client
        self.subtotal_client = subtotal_client
        self.entry_client = entry_client
        self.stock_client = stock_client
        self.account_status = {}

    def get_account_value(self, account: Account):
        account_value = 0
        if self.account_status.get(account.id) != None:
            return self.account_status[account.id]

        account_value = self.__compute_account_total(account)
        if account.type != "INVESTMENT":
            self.account_status[account.id] = account_value
            self.subtotal_client.put_account_subtotal(account, account_value)
        return account_value

    def invalidate_account_subtotal(self, accountId: str):
        del self.account_status[accountId]

    def __compute_account_total(self, account: Account):
        entries = self.entry_client.get_entries_for_account_id(account.id)
        entry_symbols = [entry.amount["symbol"] for entry in entries if type(entry.amount) != float]
        self.stock_client.fetch_prices(entry_symbols)
        entry_values = [self.stock_client.get_entry_value(entry) for entry in entries]
        account_value = functools.reduce(operator.add, entry_values, 0)
        return account_value
