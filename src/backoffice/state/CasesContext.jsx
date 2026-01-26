import React, { createContext, useContext, useReducer } from 'react';

const CasesContext = createContext();

function reducer(state, action) {
    switch (action.type) {
        case 'DECLINE_CASE': {
            const { id, reason } = action.payload;
            return {
                ...state,
                cases: state.cases.map(c =>
                    c.id === id ? { ...c, status: 'DECLINE', rejectionReason: reason } : c
                ),
            };
        }
        case 'MARK_TO_CALL': {
            const { id } = action.payload;
            return {
                ...state,
                cases: state.cases.map(c =>
                    c.id === id ? { ...c, status: 'A_APPELER' } : c
                ),
            };
        }
        case 'CREATE_CONTRACT': {
            const { id } = action.payload;
            return {
                ...state,
                cases: state.cases.map(c =>
                    c.id === id ? { ...c, status: 'CONTRAT' } : c
                ),
            };
        }
        default:
            return state;
    }
}

export function CasesProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, null);
    return (
        <CasesContext.Provider value={{ state, dispatch }}>
            {children}
        </CasesContext.Provider>
    );
}

export function useCases() {
    return useContext(CasesContext);
}
