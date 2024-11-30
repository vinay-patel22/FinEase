import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import IndexScreen from './index';
import TransactionsScreen from './transactions';
import BudgetsScreen from './budgets';
import GoalsScreen from './goals';
import ExploreScreen from './explore';
import LoginScreen from './auth/LoginScreen';
import SignUpScreen from './auth/SignUpScreen';
import { FontAwesome } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: React.ComponentProps<typeof FontAwesome>['name'];

          switch (route.name) {
            case 'Explore':
              iconName = 'search';
              break;
            case 'Index':
              iconName = 'home';
              break;
            case 'Transactions':
              iconName = 'money';
              break;
            case 'Budgets':
              iconName = 'credit-card';
              break;
            case 'Goals':
              iconName = 'star';
              break;
            default:
              iconName = 'question';
              break;
          }

          return <FontAwesome name={iconName} size={size} color={color} />;
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: 'bold',
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.inactive,
        tabBarStyle: {
          backgroundColor: Colors.background,
          borderTopWidth: 0,
          elevation: 2,
          height: 60,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Index" component={IndexScreen} options={{ tabBarLabel: 'Home' }} />
      <Tab.Screen name="Transactions" component={TransactionsScreen} options={{ tabBarLabel: 'Transactions' }} />
      <Tab.Screen name="Budgets" component={BudgetsScreen} options={{ tabBarLabel: 'Budgets' }} />
      <Tab.Screen name="Goals" component={GoalsScreen} options={{ tabBarLabel: 'Goals' }} />
      <Tab.Screen name="Explore" component={ExploreScreen} options={{ tabBarLabel: 'Explore' }} />
    </Tab.Navigator>
  );
};

const Layout = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Main" component={TabNavigator} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

export default Layout;
