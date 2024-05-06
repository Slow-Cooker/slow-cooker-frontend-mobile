import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useAuth } from './authContext'; 
import axios from 'axios';
import { Navigation, Recipe } from './interface';

export default function AccountPage({navigation}: Navigation) {
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
            console.error('Error fetching recipes:', error);
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

    const renderHeader = () => (
        <View style={styles.profileContainer}>
            <Image source={{ uri: user?.profilepicture || 'https://via.placeholder.com/150' }} style={styles.profileImage} />
            <Text style={styles.username}>Username: {user?.username}</Text>
            <Text style={styles.email}>Email: {user?.email}</Text>
            <Text style={styles.recipesTitle}>Mes recettes:</Text>
        </View>
    );

    return (
        <FlatList
            data={recipes}
            renderItem={renderItem}
            keyExtractor={item => item.id_recipe.toString()}
            numColumns={2}
            ListHeaderComponent={renderHeader}
            contentContainerStyle={styles.resultsContainer}
        />
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    profileContainer: {
        alignItems: 'center',
        margin: 20,
    },
    profileImage: {
        width: 150,
        height: 150,
        borderRadius: 75,
        marginBottom: 20,
    },
    username: {
        fontSize: 20,
        marginBottom: 5,
    },
    email: {
        fontSize: 20,
        marginBottom: 20,
    },
    recipesTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    resultsContainer: {
        paddingHorizontal: 5,
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
