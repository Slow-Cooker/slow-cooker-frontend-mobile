import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from "react-native";
import aliments from "../assets/aliments.jpg";
import homeimage from "../assets/imagebeoufhome.jpg";

export default function HomePage({navigation}) {
    return (
        <View style={styles.container}>
            <View style={styles.box1}>
                <Image
                    source={aliments}
                    style={styles.mainImage}
                />
                <Image
                    source={homeimage}
                    style={styles.overlayImage}
                />
            </View>
            <View style={styles.box2}>
                <Text style={styles.textbienvenu}>Bienvenue sur Slow Cooker</Text>
                <Text style={styles.textbienvenu}>Découvre plus de 70000 recettes testées et approuvées par la communauté, adoptées à vos envies et votre budget pour vous simplifier la cuisine au quotidien !</Text>
            </View>
            <View style={styles.box3}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('Register')}>
                    <Text style={styles.textbutton}>S'inscrire</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.inscription}
                    onPress={() => navigation.navigate('Connexion')}>
                    <Text style={styles.connexion}>J'ai déjà un compte</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "column",
    },
    box1: {
        height: "36%",
        width: "100%",
        alignItems: "center",
        justifyContent: "center", 
        marginTop: 30,
    },
    mainImage: {
        width: "100%",
        height: "100%",
        position: 'relative',
    },
    overlayImage: {
        position: 'absolute',
        width: 200,
        height: 200,
        top: "15%",
        left: "25%",
        right: 0,
        bottom: 0,
        margin: 'auto',
        borderWidth: 10,           // Largeur de la bordure
        borderColor: '#F38071',    // Couleur de la bordure
        borderRadius: 100,        // Rayon de la bordure
    },
    box2: {
        height: "36%",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 20,
    },
    box3: {
        height: "28%",
        width: "100%",
        alignItems: "center",
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
    }
});
