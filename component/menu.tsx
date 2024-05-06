import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import ConnectedHome from './connected_home';
import Search from './search';
import AddRecipe from './add_recipe';
import Selection from './selection';
import AccountPage from './compte';

const Tab = createBottomTabNavigator();

export default function Menu() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = 'home';
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home';
          } else if (route.name === 'Search') {
            iconName = focused ? 'search' : 'search';
          } else if (route.name === 'Add') {
            iconName = focused ? 'plus' : 'plus';
          } else if (route.name === 'Sélections') {
            iconName = focused ? 'heart' : 'heart';
          } else if (route.name === 'Compte') {
            iconName = focused ? 'user' : 'user';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={ConnectedHome} options={{headerShown: false}} />
      <Tab.Screen name="Search" component={Search} options={{headerShown: false}} />
      <Tab.Screen name="Add" component={AddRecipe} options={{headerShown: false}} />
      <Tab.Screen name="Sélections" component={Selection} options={{headerShown: false}} />
      <Tab.Screen name="Compte" component={AccountPage} options={{headerShown: false}} />
    </Tab.Navigator>
  );
}
