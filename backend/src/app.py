from flask import Flask, request
from account_client import AccountClient
from entry_client import EntryClient
from login_manager import LoginManager
from stock_client import StockClient
from token_client import TokenClient
from flask_cors import CORS
import functools
import operator

from sage import create_account, create_transaction, get_home

from logging.config import dictConfig


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


app = Flask(__name__)
CORS(app)

# Create Clients
token_client = TokenClient()
account_client = AccountClient()
entry_client = EntryClient()
stock_client = StockClient(token_client)
login_manager = LoginManager(token_client)


logger = app.logger

@app.route('/')
def handle_base():
    log_request(request)
    login_manager.validate_request_auth(request)

    return "Welcome to Sage"

@app.route('/login', methods = ['POST'])
def handle_login():
    log_request(request)

    return login_manager.login(request)

@app.route('/sidebar', methods = ['GET'])
def handle_sidebar():
    log_request(request)
    login_manager.validate_request_auth(request)

    type_sums = {}
    category_data = {}
    net_worth = 0

    accounts = account_client.get_all_accounts()
    for account in accounts:
        entries = entry_client.get_entries_for_account(account)
        entry_values = [stock_client.get_entry_value(entry) for entry in entries]
        account_sum = functools.reduce(operator.add, entry_values, 0)
        type_sums[account.type] = type_sums.get(account.type, 0) + account_sum
        new_account_info = {
            "id": account.id,
            "name": account.name,
            "value": account_sum,
            "is_points": account.type == "SPECIAL",
            "is_remaining": account.max_value is not None and account.max_value != 0,
            "parent_account_id": account.parent_account_id
        }

        parent_category = [parent_account.category for parent_account in accounts if account.parent_account_id == parent_account.id]
        selected_category = parent_category[0] if len(parent_category) != 0 else account.category
        category = category_data.get(selected_category, {
            'sum': 0,
            'accounts': []
        })
        if account.type != "SPECIAL":
            category['sum'] = category.get('sum') + account_sum

        new_account_list = category.get('accounts', [])
        if new_account_list is None or len(new_account_list) == 0:
            new_account_list = [new_account_info]
        else:
            new_account_list.append(new_account_info)
        category['accounts'] = new_account_list

        category_data[selected_category] = category

        if account.type != "SPECIAL":
            net_worth += account_sum


    response_json = {
        "net_worth": net_worth,
        "type_sums": type_sums,
        "category_data": category_data
    }

    return response_json
    

@app.route('/api/', methods = ['GET'])
def handle_home():
    log_request(request)

    return get_home(logger)

@app.route('/api/account', methods = ['POST'])
def handle_account():
    log_request(request)

    create_account(request.get_data(), logger)
    return "success"

@app.route('/api/transaction', methods = ['POST'])
def handle_transaction():
    log_request(request)
    
    create_transaction(request.get_data(), logger)
    return "success"

def log_request(request):
    logger.info("Beginning request to {} with method {}".format(request.path, request.method))


if __name__ == '__main__':
    app.logger.info("Spinning up main server")
    app.run(debug=True, host='0.0.0.0')
    