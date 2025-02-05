import React, { useContext, useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ActivityIndicator, View, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';
import { TailwindProvider } from 'tailwind-rn';
import { UserProvider, UserContext } from './src/context/UserContext';
import utilities from './tailwind.json';
import HomeScreen from './src/screens/HomeScreen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import OnboardingScreen from './src/screens/OnboardingScreen';
import { NavigationContainer } from '@react-navigation/native';
import { Provider, useDispatch } from 'react-redux';
import store from './src/redux/store';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
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
  const [onboardingVisible, setOnboardingVisible] = useState(false);
  const dispatch = useDispatch();


  const [initializingRoadHopApp, setInitializingMinSpiritApp] = useState(true);

  useEffect(() => {
    dispatch(loadUserData());
  }, [dispatch]);

  useEffect(() => {
    const loadThisUser = async () => {
      try {
        const deviceId = await DeviceInfo.getUniqueId();
        const storageKey = `currentUser_${deviceId}`;
        const storedUser = await AsyncStorage.getItem(storageKey);
        const isOnboardingHasStarted = await AsyncStorage.getItem('isOnboardingHasStarted');

        if (storedUser) {
          setUser(JSON.parse(storedUser));
          setOnboardingVisible(false);
        } else if (isOnboardingHasStarted) {
          setOnboardingVisible(false);
        } else {
          setOnboardingVisible(true);
          await AsyncStorage.setItem('isOnboardingHasStarted', 'true');
        }
      } catch (error) {
        console.error('Error loading of this user', error);
      } finally {
        setInitializingMinSpiritApp(false);
      }
    };
    loadThisUser();
  }, [setUser]);

  if (initializingRoadHopApp) {
    return (
      <View style={{
        flex: 1, 
        backgroundColor: '#0A0C1D',  
        justifyContent: 'center', 
        alignItems: 'center',  
        }}>
        <ActivityIndicator size="large" color="#DDB43F" />
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
