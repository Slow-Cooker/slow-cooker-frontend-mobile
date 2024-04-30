import { NavigationProp, ParamListBase } from '@react-navigation/native';
import { ScrollView, Text, StyleSheet, View } from "react-native";
import ImageCarousel from "./caroussel";
import React from "react";

interface ConnectedHomeProps {
    navigation: NavigationProp<ParamListBase>;
}
export default function ConnectedHome({ navigation }: ConnectedHomeProps) {
    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <View style={styles.box1}>
                <Text style={styles.titre}>SLOW COOKER</Text>
            </View>
            <View style={styles.box2}>
                <Text style={styles.textbutton}>Le top recettes</Text>
                <ImageCarousel />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        flexGrow: 1,
        flexDirection: "column",
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
    box3: {
        minHeight: "28%",
        width: "100%",
        marginTop: 'auto',
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
    }
});
