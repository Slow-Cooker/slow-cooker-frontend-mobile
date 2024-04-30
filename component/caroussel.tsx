import React, { useEffect, useState } from 'react';
import { View, Image, Dimensions, Text, StyleSheet } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import axios from 'axios'; // Ensure axios is imported
import { useAuth } from './authContext';

interface ImageItem {
    id: string;
    name: string;
    url: string;
}

export default function ImageCarousel() {
    const { token } = useAuth();
    const [images, setImages] = useState<ImageItem[]>([]);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await axios.get('http://10.0.2.2:3000/recipes', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                console.log('Server response:', response.data);
                if (response.data && Array.isArray(response.data)) {
                    const newImages = response.data.map((recipe, index) => ({
                        id: String(index + 1),
                        name: recipe.name_recipe,
                        url: recipe.image
                    }));
                    setImages(newImages);
                } else {
                    console.log("No images or incorrect data structure");
                }
            } catch (error) {
                console.error('Error fetching images:', error);
            }
        };
        fetchImages();
    }, [token]);
    
    const renderItem = ({ item }: { item: ImageItem }) => (
        <View style={styles.imageContainer}>
            <Image 
                source={{ uri: item.url }}
                style={styles.image}
                resizeMode="cover"
            />
            <Text style={styles.recipeName}>
                {item.name}
            </Text>
        </View>
    );

    return (
        <View style={styles.carouselContainer}>
            {images.length > 0 ? (
                console.log(images),
                <Carousel
                data={images}
                renderItem={renderItem}
                sliderWidth={Dimensions.get('window').width * 0.8} // Adjust based on the new width
                itemWidth={Dimensions.get('window').width * 0.8} // Adjust based on the new width
                loop={true}
                autoplay={true}
                autoplayDelay={500}
                autoplayInterval={3000}
            />
            ) : (
                <Text>No images to display</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    carouselContainer: {
        flex: 1,
        alignSelf: 'center',
        height: 200,
        borderRadius: 20
    },
    imageContainer: {
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        position: 'relative',
        borderRadius: 20
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 20
    },
    recipeName: {
        color: 'black',
        fontSize: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        paddingVertical: 8,
        paddingHorizontal: 20,
        position: 'absolute',
        bottom: 0,
        width: '100%',
        textAlign: 'center',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20
    }
});
