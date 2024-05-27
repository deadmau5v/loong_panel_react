import {createContext, useContext, useState, ReactNode} from 'react';

interface AuthContextType {
    logined: boolean;
    setLogined: (logined: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({children}: { children: ReactNode }) => {
    const [logined, setLogined] = useState(false);

    return (
        <AuthContext.Provider value={{logined, setLogined}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};