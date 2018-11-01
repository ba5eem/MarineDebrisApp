import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import AugmentedScreen from '../screens/AugmentedScreen';

const HomeStack = createStackNavigator({
  Home: AugmentedScreen, // TODO: change back to HomeScreen
});

HomeStack.navigationOptions = {
  tabBarLabel: 'AR',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? `ios-glasses${focused ? '' : '-outline'}` : 'md-options'}
    />
  ),
};





export default createBottomTabNavigator({
  HomeStack
});
