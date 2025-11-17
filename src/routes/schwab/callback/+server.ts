// src/routes/auth/schwab/callback/+server.ts
import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';
const { SCHWAB_KEY, SCHWAB_SECRET, SCHWAB_REDIRECT_URI } = env;
import { json } from '@sveltejs/kit';
import { Buffer } from 'node:buffer';

function basicAuthHeader(clientId: string, clientSecret: string): string {
	const token = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
	return `Basic ${token}`;
}

export const GET: RequestHandler = async ({ url, fetch }) => {
	const code = url.searchParams.get('code');
	if (!code) return new Response('Missing code', { status: 400 });

	// 🔑 Your key & secret are used *here* to exchange code -> tokens
	const tokenResp = await fetch('https://api.schwabapi.com/v1/oauth/token', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			Authorization: basicAuthHeader(SCHWAB_KEY!, SCHWAB_SECRET!)
		},
		body: new URLSearchParams({
			grant_type: 'authorization_code',
			code: decodeURIComponent(code),
			redirect_uri: SCHWAB_REDIRECT_URI!
		})
	});

	if (!tokenResp.ok) {
		return new Response(await tokenResp.text(), { status: 500 });
	}

	const tokenData = (await tokenResp.json()) as { access_token: string };
	const accessToken = tokenData.access_token;

	// Hit a basic endpoint (AAPL quote)
	const quotesUrl = new URL('https://api.schwabapi.com/marketdata/v1/quotes');
	quotesUrl.searchParams.set('symbols', 'AAPL');
	quotesUrl.searchParams.set('fields', 'quote,fundamental');

	const quotesResp = await fetch(quotesUrl.toString(), {
		headers: {
			Authorization: `Bearer ${accessToken}`,
			Accept: 'application/json',
			'X-API-Key': SCHWAB_KEY! // again, your key
		}
	});

	const quotesData = await quotesResp.json();
	return json({ tokenData, quotesData });
};
