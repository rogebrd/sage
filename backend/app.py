from flask import Flask, request
from flask_cors import CORS

from sage import create_account, create_transaction, get_home
app = Flask(__name__)
CORS(app)

logger = app.logger

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
    app.run(debug=True, host='0.0.0.0')