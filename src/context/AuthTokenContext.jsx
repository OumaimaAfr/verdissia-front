import React from 'react';
import { generateToken } from '../services/authService';
import { setAuthToken } from '../api/httpClient';

export const AuthTokenContext = React.createContext({
    token: null,
    loadingToken: false,
    refreshToken: async () => {},
});

export function AuthTokenProvider({ children }) {
    const [token, setToken] = React.useState(null);
    const [loadingToken, setLoadingToken] = React.useState(false);

    const hasFetchedRef = React.useRef(false);

    const refreshToken = React.useCallback(async () => {
        try {
            setLoadingToken(true);
            const tokenGenerated = await generateToken();
            setToken(tokenGenerated);
            setAuthToken(tokenGenerated);
        } catch (e) {
            console.error('Token generation failed', e);
            setToken(null);
            setAuthToken(null);
        } finally {
            setLoadingToken(false);
        }
    }, []);

    React.useEffect(() => {
        if (hasFetchedRef.current) return;
        hasFetchedRef.current = true;
        refreshToken();
    }, [refreshToken]);

    const value = React.useMemo(
        () => ({ token, loadingToken, refreshToken }),
        [token, loadingToken, refreshToken]
    );

    return (
        <AuthTokenContext.Provider value={value}>
            {children}
        </AuthTokenContext.Provider>
    );
}
