import React, {useEffect} from 'react';
import { View, Text, StyleSheet } from 'react-native';
import axios from "axios";
import {useState} from 'react';

interface CommentProps {
    recipeId: string;
    token: string;
}

interface Comment {
    comment: string;
}

const Comment: React.FC<CommentProps> = (recipeId, token) => {
    const [comments, setComments] = useState([]);

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
            {comments.map((comment:Comment, index) => {
                return (
                    <View key={index} style={styles.commentContainer}>
                        <Text style={styles.comment}>{comment.comment}</Text>
                    </View>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    commentContainer: {
        flexDirection: 'column',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    comment: {
        fontSize: 16,
    },
});

export default Comment;