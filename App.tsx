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
import AddIngredient from './component/add_ingredient';
import RecipeDetails from './component/recipe_details';
import RecipeOfSelection from './component/recipe_of_selection';
import RecipeOfMe from './component/recipe_of_me';

export type RootStackParamList = {
  Home: undefined;
  Register: undefined;
  Connexion: undefined;
  Connected: undefined;
  Menu: undefined;
  ConnectedHome: undefined;
  AddIngredient: undefined;
  RecipeDetails: { id: string };
  RecipeOfSelection: {id: string};
  RecipeOfMe: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

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
          <Stack.Screen name="AddIngredient" component={AddIngredient} options={{headerShown: false}} />
          <Stack.Screen name="RecipeDetails" component={RecipeDetails} options={{headerShown: false}} />
          <Stack.Screen name="RecipeOfSelection" component={RecipeOfSelection} options={{headerShown: false}} />
          <Stack.Screen name="RecipeOfMe" component={RecipeOfMe} options={{headerShown: false}} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}

export default App;
