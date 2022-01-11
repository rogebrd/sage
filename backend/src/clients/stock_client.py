import logging
import time
import json
from typing import List
import requests
from model.entry import Entry

from clients.token_client import TokenClient
from util import chunkify

STOCK_TOKEN_KEY = "YAHOO_FINANCE"
STOCK_REFRESH_MINIMUM_INTERVAL = 600  # 10 minutes


class StockClient:
    def __init__(self, token_client: TokenClient):
        self.logger = logging.getLogger("StockClient")
        self.token_client = token_client
        self.update_time = None
        self.current_prices = {}
        self.stock_token = None

    def __get_stock_token(self) -> None:
        if not self.stock_token:
            self.logger.info("Fetching new stock token...")
            self.stock_token = self.token_client.get_token(STOCK_TOKEN_KEY)

    def fetch_prices(self, symbols: List[str]) -> None:
        # TODO - Make fetching dependent on time per stock rather than all? or make work with get entry value better
        self.__get_stock_token()

        fetch_time = time.time()

        # Checks for whether the symbols have been refreshed recently enough
        if self.update_time:
            time_since_refresh = fetch_time - self.update_time
        else:
            time_since_refresh = 9999999
        if time_since_refresh < STOCK_REFRESH_MINIMUM_INTERVAL:
            self.logger.info("Refresh of symbols not needed")
            return

        batches = list(chunkify(symbols, 10))
        for batch in batches:
            self.logger.info("Fetching stocks: {}".format(", ".join(batch)))
            try:
                request_url = "https://yfapi.net/v6/finance/quote?region=US&lang=en&symbols={}".format(
                    "%2C".join(batch)
                )
                result = requests.get(
                    request_url, headers={"X-API-KEY": self.stock_token}
                )
                self.logger.info(
                    "Executed Request to {} with status {}".format(
                        request_url, result.status_code
                    )
                )
                result.raise_for_status()

                # Parse successful results
                result_json = result.json()
                quotes = result_json["quoteResponse"]["result"]
                for quote in quotes:
                    symbol = quote["symbol"]
                    current_price = quote["regularMarketPrice"]
                    self.current_prices[symbol] = current_price
                self.update_time = fetch_time
            except Exception as e:
                self.logger.error(e)

    def get_entry_value(self, entry: Entry) -> float:
        amount_type_multiplier = 1 if (entry.style == "DEBIT") else -1

        try:
            # If float conversion works then amount is a general amount
            amount_float = float(entry.amount)
            return amount_type_multiplier * amount_float
        except:
            self.logger.debug("Float conversion failed, assuming stock amount")
        # If float conversion fails then amount is stock amount
        # ensure all double quotes
        escaped_amount = entry.amount.replace("'", '"')
        amount_blob = json.loads(escaped_amount)
        self.fetch_prices([amount_blob["symbol"]])
        current_price = self.current_prices.get(
            amount_blob["symbol"], amount_blob["unitPrice"]
        )

        return amount_type_multiplier * current_price * amount_blob["quantity"]
