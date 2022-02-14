import React, { useContext, useState, createContext, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './config/firebase';

import Chat from './screens/Chat';
import Login from './screens/Login';
import Signup from './screens/Signup';
import Home from './screens/Home';

const Stack = createStackNavigator();
const authenticatedUserContext = createContext({}); 

const authenticatedUserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  return (
    <authenticatedUserContext.Provider value={{user, setUser}}>
      {children}
    </authenticatedUserContext.Provider>
  )
}

function ChatStack () {
  return (
    <Stack.Navigator defaultScreenOptions={Home} >
      <Stack.Screen name='Home' component={Home}/>
      <Stack.Screen name='Chat' component={Chat}/>
    </Stack.Navigator>
  )
}

function AuthStack () {
  return (
    <Stack.Navigator defaultScreenOptions={Login} screenOptions={{ headerShown: false }} >
      <Stack.Screen name='Login' component={Login}/>
      <Stack.Screen name='Signup' component={Signup}/>
    </Stack.Navigator>
  )
}

function RootNavigation () {
  const {user, setUser} = useContext(authenticatedUserContext);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged (auth,
      async authenticatedUser => {
          authenticatedUser? setUser(authenticatedUser): setUser(null);
          setLoading(false);
      }
    );
    return () => unsubscribe();
  }, [user])
  if (loading){
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size='large' />
      </View>
    )
  } else {
    return (
      <NavigationContainer>
        { user ? <ChatStack /> : <AuthStack /> }
      </NavigationContainer>
    )
  }
}

export default function App() {
  return (
    <authenticatedUserProvider>
      <RootNavigation />
    </authenticatedUserProvider> 
  )
}