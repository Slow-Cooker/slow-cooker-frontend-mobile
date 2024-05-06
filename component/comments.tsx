import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, ScrollView, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import { useAuth } from './authContext';
import { Comment, CommentsProps } from './interface';

const Comments:  React.FC<CommentsProps> = ({recipeId}) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [inputText, setInputText] = useState('');
    const { user, token } = useAuth()

    const handlePost = async () => {
        if (!inputText.trim()) {
            Alert.alert('Please enter a comment.');
            return;
        }
        try {
            await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/${recipeId}/comments`, { 
                comment: inputText ,
                user,
                recipe: recipeId
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setComments([...comments, { comment: inputText, user: { username: 'You', profilepicture: 'path/to/default/image' }}]);
            setInputText('');
        } catch (error) {
            console.error('Error posting comment:', error);
            Alert.alert('Failed to post comment.');
        }
    };

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/${recipeId}/comments`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setComments(response.data);
            } catch (error) {
                console.error('Error fetching comments:', error);
            }
        };
        fetchComments();
    }, [recipeId, token]);

    return (
        <View style={styles.container}>
            <ScrollView style={styles.commentsArea}>
                {comments.map((comment, index) => (
                    <View key={index} style={styles.commentContainer}>
                        <Image
                            source={{ uri: comment.user.profilepicture || 'path/to/default/image' }}
                            style={styles.profilePicture}
                        />
                        <View style={styles.commentTextContainer}>
                            <Text style={styles.username}>{comment.user.username}</Text>
                            <Text style={styles.comment}>{comment.comment}</Text>
                        </View>
                    </View>
                ))}
            </ScrollView>
            <TextInput
                style={styles.input}
                value={inputText}
                placeholder="Add a comment..."
                onChangeText={setInputText}
                onSubmitEditing={handlePost}
            />
            <TouchableOpacity onPress={handlePost} style={styles.button}>
                <Text style={styles.buttonText}>Post</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    commentsArea: {
        paddingHorizontal: 10,
    },
    commentContainer: {
        flexDirection: 'row',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        alignItems: 'center',
    },
    profilePicture: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    commentTextContainer: {
        flex: 1,
    },
    username: {
        fontWeight: 'bold',
    },
    comment: {
        fontSize: 16,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        paddingLeft: 10,
        flex: 1,
        marginRight: 10,
    },
    button: {
        backgroundColor: '#007BFF',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
    }
});

export default Comments;
