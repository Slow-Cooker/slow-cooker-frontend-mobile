import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { Searchbar, Menu, Button } from 'react-native-paper';
import { Recipe, useAuth } from './authContext';
import axios from 'axios';
import { Provider as PaperProvider } from 'react-native-paper';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { NavigationProp, ParamListBase } from '@react-navigation/native';

interface ConnectedHomeProps {
    navigation: NavigationProp<ParamListBase>;
}

export default function Search({navigation}: ConnectedHomeProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const { token } = useAuth();
    const [searchResults, setSearchResults] = useState<Recipe[]>([]); 
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [showSortOptions, setShowSortOptions] = useState(false);
    const [showSortMenu, setShowSortMenu] = useState(false);


    const handleSearch = async () => {
        try {
            const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/recipes/search/${searchQuery}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setSearchResults(response.data);
            setShowSortOptions(true);  // Afficher le sélecteur de tri après la recherche
        } catch (error) {
            console.error('Error fetching data:', error);
            setShowSortOptions(false);
        }
    };    

    const sortResults = (results: Recipe[], order: 'asc' | 'desc') => {
        return results.sort((a, b) => {
            if (order === 'asc') {
                return a.name_recipe.localeCompare(b.name_recipe);
            } else {
                return b.name_recipe.localeCompare(a.name_recipe);
            }
        });
    };
    
    
    useEffect(() => {
        if (searchResults.length > 0) {
            const sortedResults = sortResults([...searchResults], sortOrder);
            setSearchResults(sortedResults);
        }
    }, [sortOrder]);
    

    const renderItem = ({ item } : { item: Recipe }) => (
        <View style={styles.card}>
            <TouchableOpacity onPress={() => navigation.navigate("RecipeDetails", { id: item.id_recipe })}>
                <Image source={{ uri: item.image }} style={styles.cardImage} />
                <Text style={styles.cardTitle}>{item.name_recipe}</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <PaperProvider>
        <View style={styles.container}>
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
            </View>
            <FlatList
                data={searchResults}
                renderItem={renderItem}
                keyExtractor={item => item.id_recipe}
                numColumns={2}  // Set up two columns
                contentContainerStyle={styles.resultsContainer}
            />
        </View>
        </PaperProvider>
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
