/**
 * GET https://github.com/login/oauth/authorize
 *
 * This endpoint takes the following input parameters.
 *
 * Details at https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps#web-application-flow
 */
export class GithubAuthParamsDTO {
  client_id: string;
  redirect_uri: string;
  login?: string;
  scope?: string;
  state?: string;

  code_challenge?: string;
  code_challenge_method?: 'S256';

  allow_signup?: boolean = true;

  prompt?: 'select_account';
}
