import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useAuth } from './authContext';

export default function ConnectedPage() {
    const { user, signOut } = useAuth();
  
    if (!user) {
      console.error("Auth context not available or no user logged in");
      return <Text>You are not logged in.</Text>;
    }
  
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Welcome, {user.username}!</Text>
        <Text>Email: {user.email}</Text>
        <Text>Role: {user.role}</Text>
        <TouchableOpacity onPress={signOut}>
          <Text>Sign Out</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
