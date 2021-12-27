from logging import Logger, log
from clients.transaction_client import TransactionClient
from flask import Flask, request
from clients.account_client import AccountClient
from clients.entry_client import EntryClient
from clients.login_client import LoginClient
from clients.stock_client import StockClient
from clients.token_client import TokenClient
from flask_cors import CORS
import functools
import operator

from sage import create_account, create_transaction

from logging.config import dictConfig


# Setup Logging Config
dictConfig({
    'version': 1,
    'formatters': {'default': {
        'format': '[%(asctime)s] %(levelname)s in %(module)s: %(message)s',
    }},
    'handlers': {'wsgi': {
        'class': 'logging.StreamHandler',
        'stream': 'ext://flask.logging.wsgi_errors_stream',
        'formatter': 'default'
    }},
    'root': {
        'level': 'INFO',
        'handlers': ['wsgi']
    }
})


# Create Main App
flask_app: Flask = Flask(__name__)
CORS(flask_app)
logger: Logger = flask_app.logger

# Create Clients
token_client = TokenClient()
account_client = AccountClient()
entry_client = EntryClient()
transaction_client = TransactionClient()
stock_client = StockClient(token_client)
login_client = LoginClient(token_client)

@flask_app.route('/')
def handle_base():
    log_request(request)
    login_client.validate_request_auth(request)

    return "Welcome to Sage"

@flask_app.route('/sidebar', methods = ['GET'])
def handle_sidebar():
    log_request(request)
    login_client.validate_request_auth(request)

    category_sums = {}
    type_data = {}
    net_worth = 0

    accounts = account_client.get_all_accounts()
    for account in accounts:
        entries = entry_client.get_entries_for_account(account)
        entry_values = [stock_client.get_entry_value(entry) for entry in entries]
        account_sum = functools.reduce(operator.add, entry_values, 0)

        if account.max_value is not None and account.max_value != "" and float(account.max_value) != 0:
            account_sum = float(account.max_value) - account_sum

        category_sums[account.category] = category_sums.get(account.category, 0) + account_sum
        new_account_info = {
            "id": account.id,
            "name": account.name,
            "value": account_sum,
            "is_points": account.type == "POINT",
            "is_remaining": account.max_value is not None and account.max_value != '',
            "parent_account_id": account.parent_account_id
        }

        parent_type = [parent_account.type for parent_account in accounts if account.parent_account_id == parent_account.id]
        selected_type = parent_type[0] if len(parent_type) != 0 else account.type
        account_type = type_data.get(selected_type, {
            'sum': 0,
            'accounts': []
        })
        if account.type != "POINT":
            account_type['sum'] = account_type.get('sum') + account_sum

        new_account_list = account_type.get('accounts', [])
        if new_account_list is None or len(new_account_list) == 0:
            new_account_list = [new_account_info]
        else:
            new_account_list.append(new_account_info)
        account_type['accounts'] = new_account_list

        type_data[selected_type] = account_type

        if account.type != "POINT":
            net_worth += account_sum


    response_json = {
        "net_worth": net_worth,
        "category_sums": category_sums,
        "type_data": type_data
    }

    return response_json

@flask_app.route('/login', methods = ['POST'])
def handle_login():
    log_request(request)

    return login_client.login(request)

@flask_app.route('/transaction/table', methods = ['GET'])
def handle_table():
    log_request(request)
    login_client.validate_request_auth(request)

    transactions = transaction_client.get_recent_transactions()
    entry_ids = [entry for entry in (transaction.entry_ids for transaction in transactions)]
    entries = entry_client.get_entries(entry_ids)
    # format json
    response_json = {
        "transactions": [transaction.to_json(entries) for transaction in transactions]
    }

    return response_json

@flask_app.route('/modal/options', methods = ['GET'])
def handle_modal_options():
    log_request(request)
    login_client.validate_request_auth(request)

    accounts = account_client.get_all_accounts()
    account_json = [{
        "id": account.id,
        "parent_account_id": account.parent_account_id,
        "name": account.name
        } for account in accounts]

    response_json = {
        "accounts": account_json
    }

    return response_json


@flask_app.route('/api/account', methods = ['POST'])
def handle_account():
    log_request(request)

    create_account(request.get_data(), logger)
    return "success"

@flask_app.route('/transaction', methods = ['POST'])
def handle_transaction():
    log_request(request)
    
    create_transaction(request.get_data(), logger)
    return "success"

def log_request(request):
    logger.info("Beginning request to {} with method {}".format(request.path, request.method))


if __name__ == '__main__':
    flask_app.logger.info("Spinning up main server")
    flask_app.run(debug=True, host='0.0.0.0')
    