import React, { useState } from "react";
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input } from 'react-native-elements';
import { View, StyleSheet, Text, TouchableOpacity, Alert } from "react-native";
import axios from "axios";
import { useAuth } from "./authContext";

export default function Register({navigation}) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const { signIn } = useAuth();

    const handleSignUp = async () => {
        try {
            const response = await axios.post('http://10.0.2.2:3000/users/auth/sign-up', {
                email,
                username,
                password,
                role: "User"
            });
            console.log('Réponse du serveur :', response.data);
            // Redirection ou alerte de succès
            Alert.alert("Inscription réussie", "Il faut maintenant vous connecter.", [
                {text: "OK", onPress: () => navigation.navigate('Connexion')}
            ]);
        } catch (error) {
            console.error('Erreur lors de l\'inscription :', error);
            Alert.alert("Erreur d'inscription", "Impossible de s'inscrire.");
        }
    };
    return (
        <View style={styles.container}>
            <View style={styles.titre}>
                <Text style={styles.textetitre}>INSCRIPTION</Text>
            </View>
            <View style={styles.input}>
                <Input
                    placeholder="Username"
                    value={username}
                    onChangeText={setUsername}
                    leftIcon={<Icon name="user" size={24} color="black" />}
                />
                <Input
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    leftIcon={<Icon name="envelope" size={24} color="black" />}
                />
                <Input
                    placeholder="Password"
                    secureTextEntry={true}
                    value={password}
                    onChangeText={setPassword}
                    leftIcon={<Icon name="lock" size={24} color="black" />}
                />
            </View>
            <View style={styles.box3}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={handleSignUp}>
                    <Text style={styles.textbutton}>Valider</Text>
                </TouchableOpacity>
                <Text>J'ai déjà un compte?</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Connexion')}>
                    <Text style={styles.linkText}>Se connecter</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    titre: {
        alignItems: "center",
        marginTop: 20,
        height: "10%"
    },
    textetitre: {
        fontSize: 30,
        color: '#F38071',
    },
    input: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 20,
        height: "40%"
    },
    inputContainer: {
        width: '100%',
    },
    inputField: {
        borderBottomWidth: 1,
        borderBottomColor: '#ccc'
    },
    button: {
        borderRadius: 35,
        backgroundColor: "#F38071",
        alignItems: "center",
        justifyContent: "center",
        height: "25%",
        width: "75%",
    },
    textbutton: {
        fontSize: 24,
        fontWeight: "bold",
    },
    box3: {
        alignItems: "center",
        justifyContent: "center"
    },
    linkText: {
        color: '#F38071',
        textDecorationLine: 'underline'
    }
});
