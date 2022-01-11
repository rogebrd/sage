import json
import logging
from typing import Optional

from flask import request
from clients.token_client import TokenClient

LOGIN_TOKEN_KEY = "LOGIN_SHA"
ACCESS_TOKEN_KEY = "ACCESS_TOKEN"


class LoginClient:
    def __init__(self, token_client: TokenClient):
        self.logger = logging.getLogger("LoginClient")
        self.token_client = token_client
        self.access_token = self.token_client.get_token(ACCESS_TOKEN_KEY)

    def login(self, request: request) -> Optional[str]:
        request_data = request.get_data()
        login_sha = json.loads(request_data)["login_sha"]
        expected = self.token_client.get_token(LOGIN_TOKEN_KEY)
        if expected == login_sha:
            return {"access_token": self.access_token}
        else:
            self.logger.warn("Invalid Login Attempt")

    def validate_request_auth(self, request):
        request_headers = request.headers
        auth_header_value = request_headers.get("Authorization")
        if auth_header_value is None:
            self.logger.info("Authentication Header not present")
            raise Exception("Authentication Header not present")

        auth_token = auth_header_value.replace("Bearer ", "")

        if auth_token == self.access_token:
            self.logger.info("Successfully authenticated Request")
            return
        else:
            self.logger.info("Authentication Header invalid")
            raise Exception("Authentication Header invalid")
