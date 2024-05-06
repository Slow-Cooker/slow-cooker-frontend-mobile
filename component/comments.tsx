import React, {useEffect, useState} from 'react';
import { View, Text, StyleSheet, Image, TextInput, ScrollView } from 'react-native';
import axios from "axios";

interface CommentProps {
    recipeId: string;
    token: string;
}

interface Comment {
    comment: string;
    user: {
        profilepicture: string;
        username: string;
    };
}

const Comment: React.FC<CommentProps> = (recipeId, token) => {
    const [comments, setComments] = useState([]);
    const [inputText, setInputText] = useState('');

    const handlePost = async ()=> {
        try {
            const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/${recipeId}/comments`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: {'comment': inputText}
            });
        } catch (error) {
            console.error('Error to post comment', error);
        }
    }

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await axios.get(`http://10.0.2.2:3000/${recipeId}/comments`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setComments(response.data);
            } catch (error) {
                console.error('Error fetching comments of the recipe:', error);
            }
        };
        fetchComments();
    }, [recipeId, token]);

    return (
        <View>
            <ScrollView>
            {comments.map((comment:Comment, index) => {
                return (
                    <View key={index} style={styles.commentContainer}>
                        <Image
                            source={{ uri: comment.user.profilepicture }}
                            style={{ width: 200, height: 200 }}
                        />
                        <Text>{comment.user.username}</Text>
                        <Text style={styles.comment}>{comment.comment}</Text>
                    </View>
                );
            })}
            </ScrollView>
            <TextInput
                style={styles.input}
                placeholder="Ajouter un commentaire"
                onChangeText={text => setInputText(text)}
                onSubmitEditing={handlePost}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    commentContainer: {
        flexDirection: 'row',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    comment: {
        fontSize: 16,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        paddingLeft: 10,
    },
});

export default Comment;