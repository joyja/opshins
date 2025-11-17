const isTheme = (theme: string): theme is 'themeLight' | 'themeDark' =>
    theme === 'themeLight' || theme === 'themeDark';

function readThemeCookie(): 'themeLight' | 'themeDark' | null {
    // Guard for SSR where document may be undefined
    if (typeof document === 'undefined') return null;
    const match = document.cookie?.match(/(?:^|; )theme=([^;]+)/);
    if (!match) return null;
    try {
        const value = decodeURIComponent(match[1]);
        return isTheme(value) ? value : null;
    } catch {
        return null;
    }
}

function initializeTheme() {
    const cookieTheme = readThemeCookie();
    if (cookieTheme) return cookieTheme;
    const prefersDark = globalThis.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
    return prefersDark ? 'themeDark' : 'themeLight';
}

export const theme = $state<'themeLight' | 'themeDark'>(initializeTheme());
