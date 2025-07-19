import random
from datetime import datetime

import httpx
from httpx import Request, Response, Cookies


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

    username: str
    password: str
    access_token: str
    cookies: Cookies | None
    refresh_url: str
    token_url: str
    client: httpx.Client

    def __init__(self, *, username, password, refresh_url, token_url, client):
        self.username = username
        self.password = password
        self.access_token = ""
        self.cookies = None
        self.refresh_url = refresh_url
        self.token_url = token_url
        self.client = client

    def auth_flow(self, request: Request):
        request.headers["Authentication"] = "Bearer " + self.access_token
        response = yield request

        if self.access_token == "":
            login_response = yield self.build_login_request()
            self.update_tokens(login_response)

            request.headers["Authentication"] = "Bearer " + self.access_token
            yield request

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
            self.token_url,
            params={"username": self.username, "password": self.password}
        )
        return req

    def build_refresh_request(self):
        # Return an `httpx.Request` for refreshing tokens.
        req = httpx.request(
            "POST",
            self.refresh_url,
            cookies=self.cookies
        )
        return req

    def update_tokens(self, response: Response):
        data = response.json()
        self.access_token = data["access_token"]
        self.cookies = response.cookies
