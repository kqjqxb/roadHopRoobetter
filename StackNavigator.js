import React, { useContext, useEffect, useState } from 'react';
import { format } from 'date-fns'; 
import { ActivityIndicator, View, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';
import { TailwindProvider } from 'tailwind-rn';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import utilities from './tailwind.json';
import HomeScreen from './src/screens/HomeScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { UserProvider, UserContext } from './src/context/UserContext';
import { Provider, useDispatch } from 'react-redux';
import store from './src/redux/store';
import { loadUserData } from './src/redux/userSlice';


const Stack = createNativeStackNavigator();

const CultureStack = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <UserProvider>
            <TailwindProvider utilities={utilities}>
              <SafeAreaProvider>
                <AppNavigator />
              </SafeAreaProvider>
            </TailwindProvider>
        </UserProvider>
      </Provider>
    </GestureHandlerRootView>
  );
};

const AppNavigator = () => {
  const { user, setUser } = useContext(UserContext);
  const [initializing, setInitializing] = useState(true);
  const [onboardingVisible, setOnboardingVisible] = useState(false);
  const dispatch = useDispatch();


  const [initializingPolandApp, setInitializingMinSpiritApp] = useState(true);

  useEffect(() => {
    dispatch(loadUserData());
  }, [dispatch]);

  useEffect(() => {
    const loadThisUser = async () => {
      try {
        const deviceId = await DeviceInfo.getUniqueId();
        const storageKey = `currentUser_${deviceId}`;
        const storedUser = await AsyncStorage.getItem(storageKey);
        const isOnboardingWasAlreadyStarted = await AsyncStorage.getItem('isOnboardingWasAlreadyStarted');

        if (storedUser) {
          setUser(JSON.parse(storedUser));
          setOnboardingVisible(false);
        } else if (isOnboardingWasAlreadyStarted) {
          setOnboardingVisible(false);
        } else {
          setOnboardingVisible(true);
          await AsyncStorage.setItem('isOnboardingWasAlreadyStarted', 'true');
        }
      } catch (error) {
        console.error('Error cur loading of user', error);
      } finally {
        setInitializingMinSpiritApp(false);
      }
    };
    loadThisUser();
  }, [setUser]);

  if (initializingPolandApp) {
    return (
      <View style={{
        backgroundColor: '#020202',  
        alignItems: 'center',  
        flex: 1, 
        justifyContent: 'center', 
        }}>
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={onboardingVisible ? 'OnboardingScreen' : 'Home'}>
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="OnboardingScreen" component={OnboardingScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};



export default CultureStack;
