import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { Searchbar } from 'react-native-paper';
import { Recipe, useAuth } from './authContext';
import axios from 'axios';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

interface ConnectedHomeProps {
    navigation: NavigationProp<ParamListBase>;
    route: {
        params: {
            id: string;
        };
    };
}

interface Selection {
    id: number;
    name: string;
    recipes: Recipe[];
  }

export default function RecipeOfSelection({route, navigation}: ConnectedHomeProps) {
    const {id} = route.params;
    const { token } = useAuth();
    const [selection, setSelection] = useState<Selection | null>(null);

    useEffect(() => {
        const fetchData = async () => {
        try {
            console.log(`${process.env.EXPO_PUBLIC_API_URL}/selections/${id}`)
            const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/selections/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setSelection(response.data);
            console.log(selection)
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    fetchData();
    }, [token]);

    const renderItem = ({ item } : { item: Recipe }) => (
        <View style={styles.card}>
            <TouchableOpacity onPress={() => navigation.navigate("RecipeDetails", { id: item.id_recipe })}>
                <Image source={{ uri: item.image }} style={styles.cardImage} />
                <Text style={styles.cardTitle}>{item.name_recipe}</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icon name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>{selection?.name}</Text>
                </View>
            </View>
            <FlatList
                data={selection?.recipes}
                renderItem={renderItem}
                keyExtractor={item => item.id_recipe}
                numColumns={2}  // Set up two columns
                contentContainerStyle={styles.resultsContainer}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 30,
    },
    contentContainer: {
        paddingHorizontal: 10,
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
        flex: 1, // Takes the remaining space
        alignItems: 'center', // Center aligns the title text horizontally
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
    cardTitle: {
        fontSize: 16,
        marginTop: 5,
        fontWeight: 'bold',
        textAlign: "center"
    }
});
