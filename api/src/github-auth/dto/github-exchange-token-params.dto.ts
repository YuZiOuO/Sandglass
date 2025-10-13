export class GithubExchangeTokenDTO {
  client_id: string;
  client_secret: string;
  code: string;
  redirect_uri?: string;
  code_verifier?: string;
}
