import { NavigationProp, ParamListBase } from "@react-navigation/native";

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

export interface Like {
    id: string;
    owner: User;
    recipe: string;
}

export interface RecipeIngredient {
    id_ingredient: string;
    name_ingredient: string;
    image_ingredient: string;
    quantity?: number;
    unit?: string;
}

export interface ImageItem {
    id: string;
    name: string;
    url: string;
}
export interface Navigation {
    navigation: NavigationProp<ParamListBase>;
}

export interface Comment {
    comment: string;
    user: {
        profilepicture: string;
        username: string;
    };
}

export interface CommentsProps {
    recipeId: string;
}
export interface Ingredient {
    id_ingredient: string;
    image_ingredient: string;
    name_ingredient: string
}

export interface IngredientRecipe {
    id: string;
    ingredient: Ingredient;
    quantity: string;
    unit: string;
}

export interface InfosDetailsProps {
    label: string;
    value: string;
}

export interface idNavigationProps {
    route: {
        params: {
            id: string;
        };
    };
    navigation: NavigationProp<ParamListBase>;
}

export interface Selection {
    id: number;
    name: string;
    recipes: Recipe[];
  }