import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { TextInput } from 'react-native-paper';
import RNPickerSelect from 'react-native-picker-select';
import { useAuth } from "./authContext";
import axios from "axios";
import { ScrollView } from "react-native-gesture-handler";

function InputWrapper({ children }: { children: React.ReactNode }) {
    return <View style={styles.inputWrapper}>{children}</View>;
}


export default function AddRecipe({ navigation }: { navigation: any }) {
    const [name_recipe, setName_Recipe] = useState('');
    const [difficulty, setDifficulty] = useState('');
    const [category, setCategory] = useState('');
    const [duration, setDuration] = useState('');
    const [image, setImage] = useState('');
    const { user, token, createdRecipe } = useAuth();

    const resetForm = () => {
        setName_Recipe('');
        setDifficulty('');
        setCategory('');
        setDuration('');
        setImage('');
    };

    const handleCreateRecipe = async () => {
        console.log(token);
        if (!user) {
            Alert.alert("User Error", "No user logged in.");
            return;
        }
        try {
            const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/recipes`, {
                name_recipe,
                difficulty,
                category,
                duration,
                image,
                owner: user,
                validate: false,
                steps: ""
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            createdRecipe(response.data, user);
            console.log('Réponse du serveur :', response.data);
            resetForm();
            navigation.navigate("AddIngredient")
        } catch (error) {
            console.error('Erreur lors de la connexion :', error);
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
                <InputWrapper>
                    <TextInput
                        label="Nom de la recette"
                        value={name_recipe}
                        onChangeText={setName_Recipe}
                    />
                </InputWrapper>
                <InputWrapper>
                    <RNPickerSelect
                        placeholder={{ label: "Sélectionnez la difficulté...", value: null }}
                        onValueChange={setDifficulty}
                        value={difficulty}
                        items={[
                            { label: 'Facile', value: 'Weak' },
                            { label: 'Intermédiaire', value: 'Intermediary' },
                            { label: 'Difficile', value: 'Difficult' },
                        ]}
                        style={{ inputIOS: { color: 'black', paddingTop: 13, paddingHorizontal: 10, paddingBottom: 12 }, inputAndroid: { color: 'black' } }}
                    />
                </InputWrapper>
                <InputWrapper>
                    <TextInput
                        label="Durée de la recette"
                        value={duration}
                        onChangeText={setDuration}
                    />
                </InputWrapper>
                <InputWrapper>
                    <RNPickerSelect
                        placeholder={{ label: "Sélectionnez la catégorie...", value: null }}
                        onValueChange={setCategory}
                        items={[
                            { label: 'Entrée', value: 'Entree' },
                            { label: 'Plat', value: 'Dish' },
                            { label: 'Dessert', value: 'Dessert' },
                            { label: 'Boisson', value: 'Drink' },
                            { label: 'Apéritif', value: 'Aperitifs' },
                        ]}
                        value={category}
                        style={{ inputIOS: { color: 'black', paddingTop: 13, paddingHorizontal: 10, paddingBottom: 12 }, inputAndroid: { color: 'black' } }}
                    />
                </InputWrapper>
                <InputWrapper>
                    <TextInput
                        label="Lien de l'image"
                        value={image}
                        onChangeText={setImage}
                    />
                </InputWrapper>
            </View>
            <View style={styles.box3}>
                <TouchableOpacity style={styles.button} onPress={handleCreateRecipe}>
                    <Text style={styles.textbutton}>Ajouter des ingrédients</Text>
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
        width: "75%",
    },
    button2: {
        borderRadius: 35,
        backgroundColor: "#F38071",
        alignItems: "center",
        justifyContent: "center",
        width: "75%",
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
    },
    removeButton: {
        padding: 10,
        backgroundColor: "#FFCCCC",
        borderRadius: 5,
    },
});
