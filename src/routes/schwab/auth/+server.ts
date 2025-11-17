// src/routes/auth/schwab/+server.ts
import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';
const { SCHWAB_KEY, SCHWAB_REDIRECT_URI } = env;

export const GET: RequestHandler = async () => {
	const authUrl = new URL('https://api.schwabapi.com/v1/oauth/authorize');
	authUrl.searchParams.set('client_id', SCHWAB_KEY!);
	authUrl.searchParams.set('redirect_uri', SCHWAB_REDIRECT_URI!);

	// If Schwab requires scopes/PKCE for your app, you'd add them here:
	// authUrl.searchParams.set("response_type", "code");
	// authUrl.searchParams.set("scope", "api");
	// authUrl.searchParams.set("code_challenge", "...");
	// authUrl.searchParams.set("code_challenge_method", "S256");

	return new Response(null, {
		status: 302,
		headers: {
			Location: authUrl.toString()
		}
	});
};
