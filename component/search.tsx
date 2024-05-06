import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, Alert } from 'react-native';
import { Searchbar, Menu, Button, Checkbox, List } from 'react-native-paper';
import { Recipe, useAuth } from './authContext';
import axios from 'axios';
import { Provider as PaperProvider } from 'react-native-paper';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import { Ingredient } from './recipe_details';

interface ConnectedHomeProps {
    navigation: NavigationProp<ParamListBase>;
}

export default function Search({ navigation }: ConnectedHomeProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const { token } = useAuth();
    const [searchResults, setSearchResults] = useState<Recipe[]>([]);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [showSortOptions, setShowSortOptions] = useState(false);
    const [showSortMenu, setShowSortMenu] = useState(false);
    const [expanded, setExpanded] = useState(false); 
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [ingredientOptions, setIngredientOptions] = useState<Ingredient[]>([]);
    const [isIngredientsMenuVisible, setIsIngredientsMenuVisible] = useState(false);
    const [loadingIngredients, setLoadingIngredients] = useState(true); // State to track loading of ingredients

    useEffect(() => {
        async function fetchIngredient() {
            setLoadingIngredients(true); // Start loading
            try {
                const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/ingredients`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.data && Array.isArray(response.data) && response.data.length > 0) {
                    const options = response.data.map(ingredient => ({
                        id_ingredient: ingredient.id_ingredient,
                        name_ingredient: ingredient.name_ingredient,
                        image_ingredient: ingredient.image_ingredient
                    }));
                    setIngredientOptions(options);
                } else {
                    setIngredientOptions([]);
                    console.log("No ingredients found or incorrect data structure");
                }
            } catch (error) {
                console.error('Error fetching ingredients:', error);
                setIngredientOptions([]);
            }
            setLoadingIngredients(false); 
        }
        fetchIngredient();
    }, [token]);

    const fetchRecipesByIngredients = async (updatedIngredients: Ingredient[]) => {
        if (updatedIngredients.length === 0) {
            // Si aucun ingrédient n'est sélectionné, chargez toutes les recettes
            try {
                const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/recipes`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setSearchResults(response.data);
                setShowSortOptions(true);
            } catch (error) {
                console.error('Error fetching all recipes:', error);
                setShowSortOptions(false);
            }
        } else {
            // Logique existante pour charger les recettes par ingrédients
            try {
                const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/recipe-ingredients/ingredients`,
                    updatedIngredients, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setSearchResults(response.data);
                setShowSortOptions(true);
            } catch (error) {
                console.error('Error fetching data:', error);
                setShowSortOptions(false);
            }
        }
    };
    
    
    
    const handleSearch = async () => {
        if (loadingIngredients) {
            Alert.alert('Please wait, ingredients are still loading.');
            return;
        }
    
        try {
            const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/recipes/search/${searchQuery}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                params: {
                    ingredients: ingredients // Envoyer les ingrédients sélectionnés en tant que chaîne séparée par des virgules
                }
            });
            setSearchResults(response.data);
            setShowSortOptions(true);
        } catch (error) {
            console.error('Error fetching data:', error);
            setShowSortOptions(false);
        }
    };
    
    const handleIngredientToggle = (selectedIngredient: { name_ingredient: string; id_ingredient: string; image_ingredient: string }) => {
        // Create a new Ingredient object from the selectedIngredient
        const newIngredient: Ingredient = {
            name_ingredient: selectedIngredient.name_ingredient,
            id_ingredient: selectedIngredient.id_ingredient,
            image_ingredient: selectedIngredient.image_ingredient  // Assuming image_ingredient is a required property in your Ingredient type
        };
    
        // Check if the ingredient is already in the array
        const isAlreadySelected = ingredients.some(ingredient => ingredient.id_ingredient === newIngredient.id_ingredient);
    
        const updatedIngredients = isAlreadySelected
            ? ingredients.filter(ingredient => ingredient.id_ingredient !== newIngredient.id_ingredient)
            : [...ingredients, newIngredient];
    
        setIngredients(updatedIngredients);
        fetchRecipesByIngredients(updatedIngredients);
    };

    const toggleIngredientsMenu = () => {
        setIsIngredientsMenuVisible(!isIngredientsMenuVisible);
    };
    

    const renderItem = ({ item }: { item: Recipe }) => (
        <View style={styles.card}>
            <TouchableOpacity onPress={() => navigation.navigate("RecipeDetails", { id: item.id_recipe })}>
                <Image source={{ uri: item.image }} style={styles.cardImage} />
                <Text style={styles.cardTitle}>{item.name_recipe}</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <PaperProvider>
            <ScrollView style={styles.container}>
                <View style={styles.box1}>
                    <Text style={styles.titre}>RECHERCHE</Text>
                </View>
                <View style={styles.box2}>
                    <Searchbar
                        placeholder="Recherche"
                        onChangeText={setSearchQuery}
                        value={searchQuery}
                        onSubmitEditing={handleSearch}
                        onIconPress={handleSearch}
                    />
                    {showSortOptions && (
                        <Menu
                            visible={showSortMenu}
                            onDismiss={() => setShowSortMenu(false)}
                            anchor={<Button onPress={() => setShowSortMenu(true)}>Trier par</Button>}
                        >
                            <Menu.Item onPress={() => { setSortOrder('asc'); setShowSortMenu(false); }} title="Alphabétique Croissant" />
                            <Menu.Item onPress={() => { setSortOrder('desc'); setShowSortMenu(false); }} title="Alphabétique Décroissant" />
                        </Menu>
                    )}
                    <View style={styles.ingredientsContainer}>
                        <TouchableOpacity onPress={toggleIngredientsMenu}>
                            <Text style={styles.ingredientsTitle}>Ingrédients:</Text>
                        </TouchableOpacity>
                        {isIngredientsMenuVisible && (
                            ingredientOptions.map((ingredient) => (
                                <Checkbox.Item
                                    key={ingredient.id_ingredient}
                                    label={ingredient.name_ingredient}
                                    status={ingredients.some(item => item.id_ingredient === ingredient.id_ingredient) ? 'checked' : 'unchecked'}
                                    onPress={() => handleIngredientToggle(ingredient)}
                                />
                            ))
                        )}
                    </View>
                </View>
                <FlatList
                    data={searchResults}
                    renderItem={renderItem}
                    keyExtractor={item => item.id_recipe}
                    numColumns={2}
                    contentContainerStyle={styles.resultsContainer}
                />
            </ScrollView>
        </PaperProvider>
    );
    
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 30,
        height: "100%"
    },
    contentContainer: {
        paddingHorizontal: 10,
    },
    box1: {
        height: "10%",
        alignItems: "center",
        justifyContent: "center",
    },
    titre: {
        fontSize: 28,
        color: "#F38071",
        fontWeight: "bold"
    },
    box2: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingBottom: 10,
    },
    ingredientsContainer: {
        marginTop: 10,
    },
    ingredientsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    resultsContainer: {
        paddingVertical: 10,
        paddingBottom: 100
    },
    card: {
        flex: 1,
        margin: 5,
        backgroundColor: "#fff",
        borderRadius: 10,
        overflow: 'hidden',
        elevation: 3,
    },
    cardImage: {
        width: '100%',
        height: 150,
    },
    cardTitle: {
        padding: 10,
        fontSize: 16,
    },
});
