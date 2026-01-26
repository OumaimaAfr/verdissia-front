import { createContext, useState, useEffect } from 'react';
import { setAuthToken } from '../api/httpClient';

export const AuthContext = createContext();

const CONTRACTS_KEY = "contracts_cache";
const TOKEN_KEY = "access_token";

export function AuthProvider({ children }) {

    const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
    const [contracts, setContracts] = useState(() => {
        try { return JSON.parse(localStorage.getItem(CONTRACTS_KEY)) || []; }
        catch { return []; }
    });

    useEffect(() => {
        if (token) setAuthToken(token);
    }, [token]);

    const initSession = (accessToken, contractsList) => {
        localStorage.setItem(TOKEN_KEY, accessToken);
        setToken(accessToken);

        if (Array.isArray(contractsList)) {
            localStorage.setItem(CONTRACTS_KEY, JSON.stringify(contractsList));
            setContracts(contractsList);
        }
    };

    const logoutUser = () => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(CONTRACTS_KEY);
        setToken(null);
        setContracts([]);
        setAuthToken(null);
    };

    return (
        <AuthContext.Provider value={{
            token,
            contracts,
            setContracts,
            initSession,
            logoutUser
        }}>
            {children}
        </AuthContext.Provider>
    );
}
