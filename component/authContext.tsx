import React, { createContext, useState, useContext, ReactNode } from 'react';

enum UserRole {
    User = "User",
    Admin = "Admin",
}

interface User {
    id: number;
    username: string;
    email: string;
    password: string;
    role: UserRole;
}

interface AuthContextType {
    user: User | null;
    token: string;
    signIn: (userData: User, tokeb: string) => void;
    signOut: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string>("");

    const signIn = (userData: User, token: string) => {
        setUser(userData);
        setToken(token);
    };

    const signOut = () => {
        setUser(null);
        setToken("");
    };

    const value = { user, token, signIn, signOut };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
