import type { Handle } from '@sveltejs/kit';
import * as auth from '$lib/server/auth';

const isTheme = (theme: string): theme is 'themeLight' | 'themeDark' =>
	theme === 'themeLight' || theme === 'themeDark';

const handleAuth: Handle = async ({ event, resolve }) => {
	const theme = event.cookies.get('theme') || 'themeSystem';
	event.locals.theme = isTheme(theme) ? theme : ('themeSystem' as const);
	// const sessionToken = event.cookies.get(auth.sessionCookieName);

	// if (!sessionToken) {
	// 	event.locals.user = null;
	// 	event.locals.session = null;
	// 	return resolve(event);
	// }

	// const { session, user } = await auth.validateSessionToken(sessionToken);

	// if (session) {
	// 	auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
	// } else {
	// 	auth.deleteSessionTokenCookie(event);
	// }

	// event.locals.user = user;
	// event.locals.session = session;
	return resolve(event, {
		transformPageChunk: ({ html }) => html.replace('%theme%', event.locals.theme)
	});
};

export const handle: Handle = handleAuth;
