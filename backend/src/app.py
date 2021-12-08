from flask import Flask, request
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

logger = app.logger

@app.route('/')
def handle_base():
    logger.info("testing stock client")
    stock_client.fetch_prices(["AAPL", "GOOG"])
    logger.info(stock_client.current_prices)
    logger.info(stock_client.update_time)
    return "Welcome to Sage"

@app.route('/api/', methods = ['GET'])
def handle_home():
    logger.info('Handling Home Request')
    return get_home(logger)

@app.route('/api/account', methods = ['POST'])
def handle_account():
    logger.info(request.get_data())
    create_account(request.get_data(), logger)
    return "success"

@app.route('/api/transaction', methods = ['POST'])
def handle_transaction():
    create_transaction(request.get_data(), logger)
    return "success"

if __name__ == '__main__':
    app.logger.info("Spinning up main server")
    app.run(debug=True, host='0.0.0.0')
    