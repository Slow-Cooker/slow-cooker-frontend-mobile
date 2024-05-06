import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Recipe, User, useAuth } from './authContext';
import axios from 'axios';
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import Comment from "./comments";

interface RecipeDetailsProps {
    route: {
        params: {
            id: string;
        };
    };
    navigation: NavigationProp<ParamListBase>;
}

interface InfosDetailsProps {
    label: string;
    value: string;
}

export interface Ingredient {
    id_ingredient: string;
    image_ingredient: string;
    name_ingredient: string
}

interface IngredientRecipe {
    id: string;
    ingredient: Ingredient;
    quantity: string;
    unit: string;
}

interface Like {
    id: string;
    owner: User;
    recipe: string;
}

const RecipeDetails = ({ route, navigation }: RecipeDetailsProps) => {
    const { id } = route.params;
    const [recipeDetails, setRecipeDetails] = useState<Recipe | null>(null);
    const [ingredientRecipeDetails, setIngredientRecipeDetails] = useState<IngredientRecipe[]>([]);
    const [isLiked, setIsLiked] = useState(false);
    const [likeResponse, setLikeResponse] = useState<Like | null>(null);
    const { token, user, like, liked, unliked } = useAuth();

    useEffect(() => {
        const fetchRecipeDetails = async () => {
            try {
                const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setRecipeDetails(response.data);
            } catch (error) {
                console.error('Error fetching recipe details:', error);
            }
        };

        const fetchIngredientRecipeDetails = async () => {
            try {
                const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/recipe-ingredients/allIngredients/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setIngredientRecipeDetails(response.data);
            } catch (error) {
                console.error('Error fetching recipe details:', error);
            }
        };

        const fetchLiked = async () => {
            try {
                const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/${id}/likes/likeduser`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const likes = response.data; // supposons que cela renvoie un tableau
                const likedByUser = likes.some((like: Like) => like.owner.id === user?.id);
                setIsLiked(likedByUser);
                setLikeResponse(response.data);
            } catch (error) {
                console.error('Error fetching liked status:', error);
            }
        };
        fetchRecipeDetails();
        fetchIngredientRecipeDetails();
        fetchLiked();
    }, [id, token]);

    const handleLike = async () => {
        if (!user) {
            Alert.alert("User Error", "No user logged in.");
            return;
        }
        if (isLiked) {
            try {
                const response = await axios.delete(`${process.env.EXPO_PUBLIC_API_URL}/${id}/likes/${like?.id}`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                setIsLiked(false);
                setLikeResponse(null);
                unliked(user);
            } catch (error) {
                console.error('Error removing like:', error);
            }
        } else {
            try {
                const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/${id}/likes`, {
                    recipe: id,
                    owner: user
                }, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setIsLiked(true);
                setLikeResponse(response.data);
                liked(response.data, user);
            } catch (error) {
                console.error('Error adding like:', error);
            }
        }
    };

    if (!recipeDetails) {
        return (
            <View style={styles.container}>
                <Text>Loading or no recipe details available...</Text>
            </View>
        );
    }

    const renderItem = ({ item }: { item: IngredientRecipe }) => (
        <View style={styles.imageContainer}>
            <Image
                source={{ uri: item.ingredient.image_ingredient }}
                style={styles.imageIngredient}
                resizeMode="cover"
                onError={(e) => console.log('Image loading failed!', e)}
            />
            <View style={styles.ingredientDetails}>
                <Text style={styles.ingredientName}>
                    {item.ingredient.name_ingredient}
                </Text>
                <Text style={styles.ingredientQuantity}>
                    {item.quantity} {item.unit}
                </Text>
            </View>
        </View>
    );

    return (
            <><View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Icon name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>{recipeDetails.name_recipe}</Text>
            </View>
        </View><View style={styles.box2}>
                {recipeDetails.image && (
                    <Image source={{ uri: recipeDetails.image }} style={styles.image} />
                )}
                <TouchableOpacity
                    onPress={handleLike}
                    style={styles.likeButton}
                >
                    <Icon
                        name={isLiked ? "heart" : "heart-outline"}
                        size={24}
                        color={isLiked ? "red" : "black"} />
                </TouchableOpacity>
            </View><View style={styles.box3}>
                <InfoRow label="Type:" value={recipeDetails.category || 'No category available'} />
                <InfoRow label="Difficulté:" value={recipeDetails.difficulty || 'No difficulty available'} />
                <InfoRow label="Auteur:" value={recipeDetails.owner?.username || 'No owner available'} />
                <InfoRow label="Durée:" value={recipeDetails.duration || 'No duration available'} />
            </View><View style={styles.box4}>
                <FlatList
                    data={ingredientRecipeDetails}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={{ ...styles.box4, padding: 10 }}
                    numColumns={2}
                />
            </View>
            <Text style={styles.longInfo}>{recipeDetails.steps || 'No steps available'}</Text>
            <Comment recipeId={id} token={token}/>
        </>
    );
}

const InfoRow = ({ label, value }: InfosDetailsProps) => (
    <View style={styles.infoRow}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.info}>{value}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingHorizontal: 10,
        width: '100%',
        height: "10%",
    },
    backButton: {
        marginRight: 10,
    },
    contentContainer: {
        flexGrow: 1,
    },
    box1: {
        height: "10%",
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        fontSize: 28,
        color: "#F38071",
        fontWeight: "bold",
    },
    titleContainer: {
        flex: 1,
        alignItems: 'center',
    },
    imageContainer: {
        height: 150,
        width: 150,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        borderRadius: 20,
        marginBottom: 20,
        marginHorizontal: 10,
    },
    ingredientDetails: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    ingredientName: {
        color: 'black',
        fontSize: 16,
        textAlign: 'center',
    },
    ingredientQuantity: {
        color: 'black',
        fontSize: 14,
        textAlign: 'center',
        marginTop: 5,
    },
    imageIngredient: {
        width: 150,
        height: 150,
        borderRadius: 15,
    },
    box2: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    likeButton: {
        marginTop: 10,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },    
    box3: {
        marginTop: 20,
        alignItems: "center",
        paddingBottom: 20,
    },
    box4: {
        marginTop: 20,
        alignItems: "center",
        paddingBottom: 20,
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 15,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 20,
    },
    label: {
        width: 100,
        fontSize: 18,
        color: '#000',
        fontWeight: 'bold',
    },
    info: {
        fontSize: 18,
        color: '#000',
        marginLeft: 10,
    },
    longInfo: {
        width: '100%',
        fontSize: 18,
        color: '#000',
        paddingHorizontal: 20,
        marginTop: 10,
    },
});

export default RecipeDetails;
