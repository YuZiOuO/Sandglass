import random
from datetime import datetime

import httpx


def now() -> float:
    return datetime.now().timestamp()


def random_timestamp_ms():
    """
    Generate a random millisecond timestamp.
    """
    random_time = random.uniform(0, now())
    return int(random_time * 1000)


class OAuthScheme(httpx.Auth):
    requires_response_body = True

    def __init__(self, username, password, refresh_url, token_url):
        self.username = username
        self.password = password
        self.access_token = ""
        self.refresh_token = ""
        self.refresh_url = refresh_url
        self.token_url = token_url

    def auth_flow(self, request):
        request.headers["Authentication"] = "Bearer " + self.access_token
        response = yield request

        if self.access_token == "":
            refresh_response = yield self.build_login_request()
            self.update_tokens(refresh_response)

        if response.status_code == 401:
            # If the server issues a 401 response, then issue a request to
            # refresh tokens, and resend the request.
            refresh_response = yield self.build_refresh_request()
            self.update_tokens(refresh_response)

            request.headers["Authentication"] = "Bearer " + self.access_token
            yield request

    def build_login_request(self):
        req = httpx.request(
            "POST",
            self.refresh_url,
            params={"username": self.username, "password": self.password}
        )
        return req

    def build_refresh_request(self):
        # Return an `httpx.Request` for refreshing tokens.
        # TODO:impl
        req = httpx.request(
            "POST",
            self.refresh_url,
            params={"username": self.username, "password": self.password}
        )
        return req

    def update_tokens(self, response):
        # Update the `.access_token` and `.refresh_token` tokens
        # based on a refresh response.
        data = response.json()
        self.access_token = data["access_token"]
        self.refresh_token = data["refresh_token"]
