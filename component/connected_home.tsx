import { Text, StyleSheet, View, TouchableOpacity, Image, FlatList } from "react-native";
import ImageCarousel from "./caroussel";
import { Button } from 'react-native-paper';
import React, { useEffect, useState } from "react";
import { useAuth } from './authContext';
import axios from 'axios';
import { Navigation, Recipe } from './interface';

export default function ConnectedHome({ navigation }: Navigation) {
    const { user, token } = useAuth();
    const [recipes, setRecipes] = useState<Recipe[]>([]);

    useEffect(() => {
        fetchRecipe();
    }, [token, user]);

    const fetchRecipe = async () => {
        try {
            const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/recipes/user/${user?.id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setRecipes(response.data || []);
        } catch (error) {
            console.error('Error fetching selection:', error);
        }
    };

    const renderItem = ({ item }: { item: Recipe }) => (
        <View style={styles.card}>
            <TouchableOpacity onPress={() => navigation.navigate("RecipeDetails", { id: item.id_recipe })}>
                {item.id_recipe && item.id_recipe.length > 0 ? (
                    <Image style={styles.cardImage} source={{ uri: item.image }} />
                ) : (
                    <View style={styles.cardImagePlaceholder}>
                        <Text style={styles.cardImagePlaceholderText}>Pas de recettes</Text>
                    </View>
                )}
                <Text style={styles.cardTitle}>{item.name_recipe}</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <FlatList
            ListHeaderComponent={
                <>
                    <View style={styles.box1}>
                        <Text style={styles.titre}>SLOW COOKER</Text>
                    </View>
                    <View style={styles.box2}>
                        <Text style={styles.textbutton}>Le top recettes</Text>
                        <ImageCarousel navigation={navigation} />
                    </View>
                    <View style={styles.box3}>
                        <Text style={styles.selectiontext}>Mes recettes</Text>
                        <View style={styles.buttonContainer}>
                            <Button onPress={() => navigation.navigate('RecipeOfMe')} labelStyle={styles.buttonLabel}>
                                Voir toutes mes recettes
                            </Button>
                        </View>
                    </View>
                </>
            }
            ListFooterComponent={
                <View style={{ height: 100 }}></View>
            }
            data={recipes.slice(0, 2)}
            renderItem={renderItem}
            keyExtractor={item => item.id_recipe.toString()}
            numColumns={2}
            contentContainerStyle={styles.resultsContainer}
        />
    );    
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    buttonLabel: {
        color: "#F38071",
    },
    contentContainer: {
        flexGrow: 1,
        flexDirection: "column",
    },
    selectiontext: {
        fontSize: 18,
        flex: 1,
    },
    buttonContainer: {
        flex: 0,
    },
    box1: {
        height: "10%",
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
    box2: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingBottom: 10,
    },
    recipesContainer: {
        flex: 1,
        marginTop: 20,
        paddingHorizontal: 10,
    },
    recipesTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    resultsContainer: {
        paddingHorizontal: 5,
    },
    box3: {
        paddingHorizontal: 20,
        paddingTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#F38071',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16
    },
    textbutton: {
        fontSize: 24,
        color: "#F38071",
    },
    inscription: {
        alignItems: "center",
        justifyContent: "center",
        height: "25%",
        width: "75%",
    },
    connexion: {
        fontSize: 16,
    },
    textbienvenu: {
        textAlign: "center",
        fontSize: 16,
    },
    card: {
        flex: 1,
        margin: 4,
        backgroundColor: '#FFF',
        borderRadius: 8,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 1.41,
        elevation: 2,
    },
    cardImage: {
        width: '100%',
        height: 150,
        borderRadius: 5,
    },
    cardImagePlaceholder: {
        width: '100%',
        height: 150,
        backgroundColor: '#eee',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    cardImagePlaceholderText: {
        color: '#666',
        fontSize: 16,
        textAlign: 'center'
    },
    cardTitle: {
        fontSize: 16,
        marginTop: 5,
        fontWeight: 'bold',
        textAlign: "center"
    },
});
