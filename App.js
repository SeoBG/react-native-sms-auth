import 'react-native-gesture-handler';
import * as React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import  SmsAuth  from './components/SmsAuth';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="SmsAuth" component={SmsAuth} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;