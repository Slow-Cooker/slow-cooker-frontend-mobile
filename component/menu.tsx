import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import HomePage from './home';
import ConnectedHome from './connected_home';
import Search from './search';

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
          } else if (route.name === 'Like') {
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
      <Tab.Screen name="Add" component={HomePage} options={{headerShown: false}} />
      <Tab.Screen name="Like" component={HomePage} options={{headerShown: false}} />
      <Tab.Screen name="Compte" component={HomePage} options={{headerShown: false}} />
    </Tab.Navigator>
  );
}
