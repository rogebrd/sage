from flask import Flask, request
from login_manager import LoginManager
from stock_client import StockClient
from token_client import TokenClient
from flask_cors import CORS

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
    