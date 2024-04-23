// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomePage from './component/home';
import Register from './component/register';
import Connexion from './component/connexion';
import { AuthProvider } from './component/authContext';
import ConnectedPage from './component/connected';
import ConnectedHome from './component/connected_home';
import Menu from './component/menu';

const Stack = createStackNavigator();

function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomePage} options={{headerShown: false}} />
          <Stack.Screen name="Register" component={Register} options={{headerShown: false}} />
          <Stack.Screen name="Connexion" component={Connexion} options={{headerShown: false}} />
          <Stack.Screen name="Connected" component={ConnectedPage} options={{headerShown: false}} />
          <Stack.Screen name="Menu" component={Menu} options={{headerShown: false}} />
          <Stack.Screen name="ConnectedHome" component={ConnectedHome} options={{headerShown: false}} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}

export default App;
