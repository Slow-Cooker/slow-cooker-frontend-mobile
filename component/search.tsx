import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, FlatList, Image } from 'react-native';
import { Searchbar } from 'react-native-paper';
import { useAuth } from './authContext';
import axios from 'axios';

export default function Search() {
    const [searchQuery, setSearchQuery] = useState('');
    const { token } = useAuth();
    const [searchResults, setSearchResults] = useState([]);

    const handleSearch = async () => {
        try {
            const response = await axios.get(`http://10.0.2.2:3000/recipes/${searchQuery}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setSearchResults(response.data);  // Update the state with the response data
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.cardImage} />
            <Text style={styles.cardTitle}>{item.name_recipe}</Text>
        </View>
    );

    return (
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
            </View>
            <FlatList
                data={searchResults}
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
