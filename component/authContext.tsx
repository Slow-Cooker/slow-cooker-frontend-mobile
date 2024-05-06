import React, { createContext, useState, useContext, ReactNode } from 'react';

enum UserRole {
    User = "User",
    Admin = "Admin",
}

export interface User {
    id: number;
    username: string;
    email: string;
    password: string;
    role: UserRole;
    profilepicture: string | undefined;
}

export enum Difficulty {
    Weak = 'Weak',
    Intermediary = 'Intermediary',
    Difficult = 'Difficult',
}

export enum Category {
    Entree = 'Entree',
    Dish = 'Dish',
    Dessert = 'Dessert',
    Drink = 'Drink',
    Aperitifs = 'Aperitifs',
  }

export interface Recipe {
    id_recipe: string;
    name_recipe: string;
    difficulty: Difficulty;
    category: Category;
    owner: User;
    duration: string;
    validate: boolean;
    image: string;
    steps: string;
}

interface Like {
    id: string;
    owner: User;
    recipe: string;
}

interface AuthContextType {
    user: User | null;
    token: string;
    recipe: Recipe | null;
    like: Like | null;
    signIn: (userData: User, tokeb: string) => void;
    signOut: () => void;
    createdRecipe: (recipeData: Recipe, userData: User) => void;
    createdRecipeOut: (userData: User) => void;
    liked: (likeData: Like, userData: User) => void;
    unliked: (userData: User) => void;
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
    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [like, setLike] = useState<Like | null>(null);

    const signIn = (userData: User, token: string) => {
        setUser(userData);
        setToken(token);
        setRecipe(null);
    };

    const signOut = () => {
        setUser(null);
        setToken("");
        setRecipe(null);
    };

    const createdRecipe = (recipeData: Recipe, userData: User) => {
        setRecipe(recipeData);
        setToken(token);
        setUser(userData);
    };

    const createdRecipeOut = (userData: User) => {
        setUser(userData);
        setToken(token);
        setRecipe(null);
    };

    const liked = (likeData: Like, userData: User) => {
        setLike(likeData);
        setToken(token);
        setUser(userData);
    };

    const unliked = (userData: User) => {
        setUser(userData);
        setToken(token);
        setLike(null);
    };
    
    const value = { user, token, recipe, like, signIn, signOut, createdRecipe, createdRecipeOut, liked, unliked };
    

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
