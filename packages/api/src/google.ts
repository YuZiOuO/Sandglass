import { getCookie, setCookie, deleteCookie } from "hono/cookie";
import { Hono } from "hono";
import { Google, generateCodeVerifier, generateState } from "arctic";

const GOOGLE_SCOPE = [
  "https://mail.google.com/",
  "https://www.googleapis.com/auth/calendar",
  "https://www.googleapis.com/auth/tasks",
];
const GOOGLE_PROFILE_URL =
  "https://gmail.googleapis.com/gmail/v1/users/me/profile";

const app = new Hono<{
  Bindings: {
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;
    WEB_ORIGIN?: string;
  };
}>();

// Starts the Google authorization flow.
app.get("/authorize", (c) => {
  const state = generateState();
  const codeVerifier = generateCodeVerifier();
  const google = new Google(
    c.env.GOOGLE_CLIENT_ID,
    c.env.GOOGLE_CLIENT_SECRET,
    new URL("/google/callback", c.req.url).toString(),
  );
  const authUrl = google.createAuthorizationURL(
    state,
    codeVerifier,
    GOOGLE_SCOPE,
  );
  authUrl.searchParams.set("access_type", "offline");
  authUrl.searchParams.set("prompt", "consent");

  setCookie(c, "google_oauth_state", state, {
    httpOnly: true,
    secure: c.req.url.startsWith("https:"),
    sameSite: "Lax",
    path: "/google",
    maxAge: 600,
  });
  setCookie(c, "google_oauth_verifier", codeVerifier, {
    httpOnly: true,
    secure: c.req.url.startsWith("https:"),
    sameSite: "Lax",
    path: "/google",
    maxAge: 600,
  });
  return c.redirect(authUrl.toString());
});

// Handles Google's authorization callback and stores the refresh token.
app.get("/callback", async (c) => {
  const code = c.req.query("code");
  const state = c.req.query("state");
  const savedState = getCookie(c, "google_oauth_state");
  const codeVerifier = getCookie(c, "google_oauth_verifier");
  if (!code || state !== savedState || !codeVerifier) {
    return c.text("Invalid Google OAuth callback.", 400);
  }

  const google = new Google(
    c.env.GOOGLE_CLIENT_ID,
    c.env.GOOGLE_CLIENT_SECRET,
    new URL("/google/callback", c.req.url).toString(),
  );
  let token;
  try {
    token = await google.validateAuthorizationCode(code, codeVerifier);
  } catch {
    return c.text("Google token exchange failed.", 400);
  }

  if (!token.hasRefreshToken()) {
    return c.text("Google did not return a refresh token.", 400);
  }

  deleteCookie(c, "google_oauth_state", { path: "/google" });
  deleteCookie(c, "google_oauth_verifier", { path: "/google" });
  setCookie(c, "google_refresh_token", token.refreshToken(), {
    httpOnly: true,
    secure: c.req.url.startsWith("https:"),
    sameSite: "Lax",
    path: "/google",
  });
  return c.redirect(c.env.WEB_ORIGIN ?? new URL("/", c.req.url).origin);
});

// Restores the Google authorization and returns a short-lived access token.
app.post("/access-token", async (c) => {
  const refreshToken = getCookie(c, "google_refresh_token");
  if (!refreshToken) {
    return c.json({ authenticated: false }, 401);
  }

  const google = new Google(
    c.env.GOOGLE_CLIENT_ID,
    c.env.GOOGLE_CLIENT_SECRET,
    new URL("/google/callback", c.req.url).toString(),
  );
  let token;
  try {
    token = await google.refreshAccessToken(refreshToken);
  } catch {
    deleteCookie(c, "google_refresh_token", { path: "/google" });
    return c.json({ authenticated: false }, 401);
  }

  const profileResponse = await fetch(GOOGLE_PROFILE_URL, {
    headers: { Authorization: `Bearer ${token.accessToken()}` },
  });
  if (!profileResponse.ok) {
    deleteCookie(c, "google_refresh_token", { path: "/google" });
    return c.json({ authenticated: false }, 401);
  }

  return c.json({ authenticated: true, accessToken: token.accessToken() });
});

export default app;
