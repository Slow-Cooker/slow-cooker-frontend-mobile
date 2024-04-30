import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, Button as RNButton, Alert, Image, FlatList } from 'react-native';
import { Button } from 'react-native-paper';
import { Recipe, useAuth } from './authContext';
import { ScrollView } from 'react-native-gesture-handler';

interface Selection {
    id: number;
    name: string;
    recipes: Recipe[];
  }

  interface SelectionCardProps {
    selection: Selection;
  }


  export default function Selection() {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectionName, setSelectionName] = useState("");
    const [selections, setSelections] = useState<Selection[]>([]); // Use the Selection interface
    const { token, user } = useAuth();

    useEffect(() => {
        fetchSelections(); // Appel initial pour charger les sélections au montage
    }, [token, user]);

    const fetchSelections = async () => {
        try {
            const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/selections/${user?.id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            console.log(response.data.recipe)
            setSelections(response.data || []); // assuming the data is in response.data.selections
        } catch (error) {
            console.error('Error fetching selection:', error);
        }
    };

    const handleSave = async () => {
        try {
            await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/selections`, {
                userId: user?.id,
                name: selectionName,
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setSelectionName('');
            setModalVisible(false);
            fetchSelections(); // Rafraîchir la liste des sélections après l'ajout
        } catch (error) {
            console.error('Error saving selection:', error);
            Alert.alert("Error", "Unable to save the selection.");
        }
    };

    const renderItem = ({ item }: { item: Selection }) => (
        <View style={styles.card}>
            {item.recipes && item.recipes.length > 0 ? (
                item.recipes.map((recipe, index) => (
                    <Image key={index} style={styles.cardImage} source={{ uri: recipe.image }} />
                ))
            ) : (
                <View style={styles.cardImagePlaceholder}>
                    <Text style={styles.cardImagePlaceholderText}>Pas de recettes</Text>
                </View>
            )}
            <Text style={styles.cardTitle}>{item.name}</Text>
        </View>
    );
    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
    <View style={styles.box1}>
        <Text style={styles.titre}>MON CARNET</Text>
    </View>
    <View style={styles.box2}>
        <Text style={styles.selectiontext}>Mes sélections</Text>
        <View style={styles.buttonContainer}>
            <Button onPress={() => setModalVisible(true)} labelStyle={styles.buttonLabel}>
                Ajouter une sélection
            </Button>
        </View>
    </View>
    <View style={styles.selectionsContainer}>
        <FlatList
            data={selections}
            renderItem={renderItem}
            keyExtractor={item => item.id.toString()}
            numColumns={2}
            contentContainerStyle={styles.resultsContainer}
        />
    </View>
    <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
            setModalVisible(!modalVisible);
        }}
    >
        <View style={styles.centeredView}>
            <View style={styles.modalView}>
                <TextInput
                    style={styles.input}
                    onChangeText={setSelectionName}
                    value={selectionName}
                    placeholder="Entrez le nom de la sélection"
                />
                <View style={styles.modalButtons}>
                    <RNButton title="Annuler" onPress={() => setModalVisible(false)} />
                    <RNButton title="Sauvegarder" onPress={handleSave} />
                </View>
            </View>
        </View>
    </Modal>
</ScrollView>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 30,
    },
    contentContainer: {
        flexGrow: 1,
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
        paddingHorizontal: 20,
        paddingBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    selectiontext: {
        fontSize: 18,
        flex: 1,
    },
    buttonContainer: {
        flex: 0,
    },
    buttonLabel: {
        color: "#F38071",
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
        width: 0,
        height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    resultsContainer: {
        paddingHorizontal: 5,
    },
    input: {
        height: 40,
        marginVertical: 12,
        borderWidth: 1,
        padding: 10,
        width: 200,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 20,
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
        backgroundColor: '#eee', // Choisissez une couleur de fond appropriée
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    cardImagePlaceholderText: {
        color: '#666', // Choisissez une couleur de texte appropriée
        fontSize: 16,
        textAlign: 'center'
    },
    cardTitle: {
        fontSize: 16,
        marginTop: 5,
        fontWeight: 'bold',
        textAlign: "center"
    },
    selectionsContainer: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        paddingBottom: 100
    }
});
