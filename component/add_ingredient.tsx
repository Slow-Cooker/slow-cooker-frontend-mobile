    import React, { useEffect, useState } from "react";
    import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
    import { TextInput } from 'react-native-paper';
    import RNPickerSelect from 'react-native-picker-select';
    import { useAuth } from "./authContext";
    import axios from "axios";
    import { ScrollView } from "react-native-gesture-handler";
    import Icon from 'react-native-vector-icons/FontAwesome';


    export interface Ingredient {
        id_ingredient: string;
        name_ingredient: string;
        image_ingredient: string;
        quantity?: number;
        unit?: string;
    }

    interface IngredientInputProps {
        ingredient: Ingredient;
        onUpdate: (index: number, ingredient: Ingredient) => void;
        onRemove: (index: number) => void;
        index: number;
        ingredientOptions: { label: string; value: string, id: string }[];  // Add this line
    }

    function IngredientInput({ ingredient, onUpdate, onRemove, index, ingredientOptions }: IngredientInputProps) {
        let [quantity, setQuantity] = useState<number>(0);
        let [unit, setUnit] = useState('');
        useEffect(() => {
            onUpdate(index, { ...ingredient, quantity: quantity, unit });
        }, [quantity, unit]);

        const handleQuantityChange = (text: string) => {
            // Convert the input text to a number, using 0 if conversion fails
            const num = parseInt(text, 10) || 0;
            setQuantity(num);
        };
        return (
            <View style={styles.ingredientWrapper}>
                <RNPickerSelect
    onValueChange={(value) => {
        const selectedIngredient = ingredientOptions.find(opt => opt.value === value);
        if (selectedIngredient) {
            onUpdate(index, { ...ingredient, name_ingredient: selectedIngredient.label, id_ingredient: selectedIngredient.id });
        } else {
            console.error('Selected ingredient is not found.');
        }
    }}
    items={ingredientOptions.map(ing => ({ label: ing.label, value: ing.value }))}
    placeholder={{ label: "Select an ingredient", value: null }}
    style={{
        inputIOS: {
            color: 'black',
            paddingTop: 13,
            paddingHorizontal: 10,
            paddingBottom: 12,
            height: 40,
            borderWidth: 1,
            borderColor: 'gray',
            borderRadius: 5
        },
        inputAndroid: {
            color: 'black',
            width: 150,
            paddingTop: 13,
            paddingHorizontal: 10,
            paddingBottom: 12,
            height: 40,
            borderWidth: 1,
            borderColor: 'gray', // Ajout pour mieux voir le champ
            borderRadius: 5
        }
    }}
    value={ingredient.name_ingredient}
/>

            <TextInput
                style={styles.ingredientInput}
                value={quantity.toString()} // Ensure the number is converted back to string for the input
                onChangeText={handleQuantityChange}
                keyboardType="numeric" // Ensure numeric keyboard is used on mobile devices
                placeholder="Quantité"
            />
                <TextInput
                    style={styles.ingredientInput}
                    value={unit}
                    onChangeText={setUnit}
                    placeholder="Unité"
                />
                <TouchableOpacity onPress={() => onRemove(index)} style={styles.removeButton}>
                    <Text>Supprimer</Text>
                </TouchableOpacity>
            </View>
        );
    }

    export default function AddIngredient({ navigation }: { navigation: any }) {
        const [ingredients, setIngredients] = useState<Ingredient[]>([]);  // This is for the ingredients in the recipe
        const [ingredientOptions, setIngredientOptions] = useState<{ label: string; value: string, id: string }[]>([]);  // Dropdown options

        const { token, user, recipe, createdRecipeOut } = useAuth();
        const handleAddIngredient = () => {
            setIngredients([...ingredients, {
                id_ingredient: '',
                name_ingredient: '',
                image_ingredient: '',
                quantity: 0,
                unit: ''
            }]);
        };

        const updateIngredient = (index: number, newIngredient: Ingredient) => {
            const newIngredients = [...ingredients];
            newIngredients[index] = { ...newIngredients[index], ...newIngredient };
            setIngredients(newIngredients);
        };

        // Supprime un ingrédient de la liste
        const removeIngredient = (index: number) => {
            const newIngredients = [...ingredients];
            newIngredients.splice(index, 1);
            setIngredients(newIngredients);
        };

        useEffect(() => {
            const fetchIngredient = async () => {
                try {
                    const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/ingredients`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    if (response.data && Array.isArray(response.data)) {
                        const options = response.data.map(ingredient => ({
                            id: ingredient.id_ingredient,
                            label: ingredient.name_ingredient,
                            value: ingredient.name_ingredient,
                        }));
                        setIngredientOptions(options); // Set the fetched names as options for the dropdown
                    } else {
                        console.log("No ingredient or incorrect data structure");
                    }
                } catch (error) {
                    console.error('Error fetching ingredients:', error);
                }
            };
            fetchIngredient();
        }, [token]);

        const handleCreateIngredientRecipe = async () => {
            if (!user) {
                Alert.alert("User Error", "No user logged in.");
                return;
            }
            try {
                for (const ingredient of ingredients) {
                    const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/recipe-ingredients`, {
                        ingredient: {
                            id_ingredient: ingredient.id_ingredient
                        },
                        recipe: {
                            id_recipe: recipe?.id_recipe
                        },
                        quantity: ingredient.quantity,
                        unit: ingredient.unit,
                    }, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    createdRecipeOut(user)
                }
                Alert.alert("Success", "All ingredients have been saved successfully.");
                navigation.navigate("Menu");
            } catch (error) {
                console.error('Erreur lors de la connexion:', error);
                Alert.alert("Erreur de connexion", "Impossible de la connexion.");
            }
        };


        return (
            <ScrollView style={styles.container} contentContainerStyle={styles.scrollViewContent}>
                <View style={styles.box1}>
                    <Text style={styles.titre}>
                        Add Recipe
                    </Text>
                </View>
                <View style={styles.box2}>
                    <Text style={styles.titre2}>Ingrédients:</Text>
                    <TouchableOpacity onPress={handleAddIngredient} style={styles.button2}>
                        <Icon name="plus" size={24} color="white" />
                        <Text style={styles.textbutton}>Ajouter un ingrédient</Text>
                    </TouchableOpacity>
                    {ingredients.map((ingredient, index) => (
                        <IngredientInput
                            key={index}
                            index={index}
                            ingredient={ingredient}
                            onUpdate={updateIngredient}
                            onRemove={removeIngredient}
                            ingredientOptions={ingredientOptions} // Now passing the correct prop
                        />
                    ))}
                </View>
                <View style={styles.box3}>
                    <TouchableOpacity style={styles.button} onPress={handleCreateIngredientRecipe}>
                        <Text style={styles.textbutton}>Enregistrer la recette</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        );
    }

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            minHeight: "100%"
        },
        scrollViewContent: {
            flexGrow: 1,
            paddingBottom: 100,
        },
        box1: {
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 30,
        },
        titre: {
            fontSize: 28,
            color: "#F38071",
            fontWeight: "bold"
        },
        titre2: {
            fontSize: 20,
            color: "#F38071",
            fontWeight: "bold"
        },
        box2: {
            paddingHorizontal: 20,
            paddingTop: 20,
        },
        inputWrapper: {
            marginBottom: 20,
        },
        button: {
            borderRadius: 35,
            backgroundColor: "#F38071",
            alignItems: "center",
            justifyContent: "center",
            height: "25%",
            minHeight: 50,
            width: "60%",
        },
        button2: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 35,
            backgroundColor: "#F38071",
            paddingVertical: 10,
            paddingHorizontal: 20,
            width: "80%",
            alignSelf: 'center',
            marginTop: 40, // Augmentez cette valeur pour ajouter plus d'espace
            marginBottom: 20, // Ajoutez une marge en bas si nécessaire
        },
        textbutton: {
            fontSize: 24,
            fontWeight: "bold",
        },
        box3: {
            alignItems: "center",
            justifyContent: "center",
        },
        ingredientWrapper: {
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 10,
        },
        ingredientInput: {
            flex: 1,
            borderBottomWidth: 1,
            marginRight: 10,
            padding: 5,
            height: 30,
        },
        removeButton: {
            padding: 10,
            backgroundColor: "#FFCCCC",
            borderRadius: 5,
        },
    });

