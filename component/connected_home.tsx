import { ScrollView, Text, StyleSheet, View } from "react-native";
import ImageCarousel from "./caroussel";
import Menu from "./menu";

export default function ConnectedHome({ navigation }) {
    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <View style={styles.box1}>
                <Text style={styles.titre}>SLOW COOKER</Text>
            </View>
            <View style={styles.box2}>
                <Text style={styles.titre}>Le top recettes</Text>
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
        fontSize: 20,
        color: "#F38071",
    },
    box2: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 10,
    },
    box3: {
        minHeight: "28%",
        width: "100%",
        // Optional: If you want to ensure it always stays at the bottom,
        // you can add marginTop: 'auto' here.
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
