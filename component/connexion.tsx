import { NavigationProp, ParamListBase } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert } from "react-native";
import { Input } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import { useAuth } from './authContext';

interface ConnexionProps {
    navigation: NavigationProp<ParamListBase>;
}
export default function Connexion({navigation}: ConnexionProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { signIn } = useAuth();

    const handleLogin = async () => {
        try {
            const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/users/auth/login`, {
                email,
                password,
            });
            signIn(response.data.user, response.data.token);
            Alert.alert("Connexion réussie", "Vous êtes maintenant connecté.", [
                {text: "OK", onPress: () => navigation.navigate('Menu')}
            ]);
        } catch (error) {
            console.error('Erreur lors de la connexion :', error);
            Alert.alert("Erreur de connexion", "Impossible de la connexion.");
        }
    };
    return (
        <View style={styles.container}>
            <View style={styles.titre}>
                <Text style={styles.textetitre}>CONNEXION</Text>
            </View>
            <View style={styles.input}>
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
                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text style={styles.textbutton}>Se connecter</Text>
                </TouchableOpacity>
                <Text>J'ai pas de compte?</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                    <Text style={styles.linkText}>S'inscrire</Text>
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
