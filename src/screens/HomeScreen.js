import React, { useEffect, useState, useMemo, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { SafeAreaView } from 'react-native-safe-area-context';

import { PlusIcon } from 'react-native-heroicons/outline';
import AddRouteScreen from './AddRouteScreen';
import { ScrollView } from 'react-native-gesture-handler';
import RouteDetailsScreen from './RouteDetailsScreen';
import ProfileScreen from './ProfileScreen';
import CarrotScreen from './CarrotScreen';
import ShopScreen from './ShopScreen';




const fontOpenSansBold = 'OpenSans-Bold';
const fontOpenSansRegular = 'OpenSans-Regular';
const fontOpenSansSemiBold = 'OpenSans-SemiBold';



const buttons = [
  { screen: 'Home', notSelectedIcon: require('../assets/icons/buttonsIcons/routeIcon.png'), selectedIcon: require('../assets/icons/selectedIcons/selectedRouteIcon.png') },
  { screen: 'Carrot', notSelectedIcon: require('../assets/icons/buttonsIcons/carrotIcon.png'), selectedIcon: require('../assets/icons/selectedIcons/selectedCarrotIcon.png') },
  { screen: 'Shop', notSelectedIcon: require('../assets/icons/buttonsIcons/shopIcon.png'), selectedIcon: require('../assets/icons/selectedIcons/selectedShopIcon.png') },
  { screen: 'Profile', notSelectedIcon: require('../assets/icons/buttonsIcons/profileIcon.png'), selectedIcon: require('../assets/icons/selectedIcons/selectedProfileIcon.png') },
];



const HomeScreen = () => {

  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const [thisSelectedScreen, setThisSelectedScreen] = useState('Home');
  const [currentUser, setCurrentUser] = useState(null);
 
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);


  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('currentUser');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setCurrentUser(parsedUser);
        }
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };

    fetchCurrentUser();
  }, []);


  useEffect(() => {
    const loadEntertainments = async () => {
      try {
        const storedEntertainments = await AsyncStorage.getItem('Routes');
        if (storedEntertainments) {
          setRoutes(JSON.parse(storedEntertainments));
        }
      } catch (error) {
        console.error('Error loading routes:', error);
      }
    };

    loadEntertainments();
  }, [thisSelectedScreen]);


  const handleDelete = (id) => {
    Alert.alert(
      'Delete Route',
      'Are you sure you want to delete the route?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {
            const updatedRoutes = routes.filter(item => item.id !== id);
            setRoutes(updatedRoutes);
            await AsyncStorage.setItem('Routes', JSON.stringify(updatedRoutes));
          },
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={{
      flex: 1,
      alignItems: 'center',
      backgroundColor: '#0A0C1D',
    }}>



      {thisSelectedScreen === 'Home' ? (
        <SafeAreaView className="flex-1 px-5  " style={{ width: '100%', }}>

          <TouchableOpacity
            onPress={() => setThisSelectedScreen('AddRoute')}
            style={{
              width: '95%',
              backgroundColor: 'rgba(255, 255, 255, 0.09)',
              borderRadius: dimensions.width * 0.05,
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: dimensions.width * 0.05,
              alignSelf: 'center',
              alignItems: 'center',
            }}>
            <Text style={{
              marginTop: dimensions.height * 0.025,
              fontFamily: fontOpenSansBold,
              fontWeight: 700,
              textAlign: 'center',
              alignSelf: 'center',
              fontSize: dimensions.width * 0.05,
              color: '#DDB43F',
              marginBottom: dimensions.height * 0.025,
            }}>
              Road Explorer
            </Text>
            <PlusIcon size={dimensions.width * 0.1} color='#DDB43F' />

          </TouchableOpacity>




          {routes.length < 1 ? (
            <View style={{
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
            }}>
              <Image
                source={require('../assets/images/roadImage.png')}
                style={{
                  width: '100%',
                  height: dimensions.height * 0.35,
                  marginTop: dimensions.height * 0.14,
                }}
                resizeMode="contain"
              />
              <Text style={{
                marginTop: -dimensions.height * 0.03,
                fontFamily: fontOpenSansBold,
                fontWeight: 500,
                textAlign: 'center',
                alignSelf: 'center',
                fontSize: dimensions.width * 0.03,
                paddingHorizontal: dimensions.width * 0.1,
                color: 'white',
                marginBottom: dimensions.height * 0.025,
              }}>
                You don't have any routes created yet. Try creating the first one.
              </Text>

            </View>
          ) : (
            <ScrollView>
              <View style={{
                width: '100%',
                marginTop: dimensions.height * 0.02,
                marginBottom: dimensions.height * 0.25,
                flexWrap: 'wrap',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'flex-start', 
              }}>
                {routes.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => { setSelectedRoute(item); setThisSelectedScreen('RouteDetails') }}
                    onLongPress={() => handleDelete(item.id)}
                    style={{
                      backgroundColor: '#DDB43F',
                      alignSelf: 'center',
                      width: '45%',
                      position: 'relative',
                      borderRadius: dimensions.width * 0.1,
                      margin: dimensions.width * 0.016,
                      zIndex: 500,
                    }}

                  >
                    <View style={{
                      alignSelf: 'center',
                      width: '100%',
                      top: 0,
                    }}>
                      {item.images.length > 0 ? (
                        <Image
                          source={{ uri: item.images[0] }}
                          style={{
                            width: '100%',
                            height: dimensions.height * 0.2,
                            textAlign: 'center',
                            borderTopLeftRadius: dimensions.width * 0.1,
                            borderTopRightRadius: dimensions.width * 0.1,
                          }}
                          resizeMode="stretch"
                        />
                      ) : (
                        <View style={{
                          alignItems: 'center',
                          alignSelf: 'center',
                          padding: dimensions.width * 0.16,
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          borderTopRightRadius: dimensions.width * 0.1,
                          borderTopLeftRadius: dimensions.width * 0.1,
                          marginBottom: dimensions.height * 0.01,
                          width: '100%',
                        }}>
                          <Image
                            source={require('../assets/icons/emptyImageIcon.png')}
                            style={{
                              width: dimensions.width * 0.05,
                              height: dimensions.width * 0.05,
                              textAlign: 'center',
                              opacity: 0.7,
                            }}
                            resizeMode="contain"
                          />
                        </View>
                      )}
                    </View>
                    <View style={{
                      borderRadius: dimensions.width * 0.1,
                      paddingBottom: dimensions.height * 0.02,
                      marginBottom: dimensions.height * 0.01,
                      width: '100%',
                      paddingHorizontal: dimensions.width * 0.02,
                      paddingVertical: dimensions.height * 0.01,
                    }}>
                      <Text
                        style={{
                          fontFamily: fontOpenSansBold,
                          fontSize: dimensions.width * 0.046,
                          color: 'white',
                          paddingHorizontal: dimensions.width * 0.021,
                          paddingVertical: dimensions.height * 0.001,
                          marginTop: dimensions.height * 0.01,
                          fontWeight: 700
                        }}
                      >
                        {item.routeName ? item.routeName : 'No route Name'}
                      </Text>
                      <Text
                        style={{
                          fontFamily: fontOpenSansBold,
                          fontSize: dimensions.width * 0.034,
                          color: 'white',
                          paddingHorizontal: dimensions.width * 0.021,
                          paddingVertical: dimensions.height * 0.001,
                          fontWeight: 600
                        }}
                      >
                        {item.description ?
                          (item.description.length > 30 ? item.description.substring(0, 30) + '...' : item.description)
                          : 'No description'}
                      </Text>
                      <Text
                        style={{
                          fontFamily: fontOpenSansBold,
                          fontSize: dimensions.width * 0.034,
                          color: 'white',
                          paddingHorizontal: dimensions.width * 0.021,
                          paddingVertical: dimensions.height * 0.001,
                          fontWeight: 600,
                          marginTop: dimensions.height * 0.01,
                        }}
                      >
                        Type of route
                      </Text>
                      <View style={{
                        backgroundColor: 'white',
                        fontWeight: 600,
                        borderRadius: dimensions.width * 0.1,
                        alignSelf: 'flex-start',
                        marginTop: dimensions.height * 0.01,
                        marginLeft: dimensions.width * 0.021,
                      }}>
                        <Text
                          style={{
                            fontFamily: fontOpenSansBold,
                            fontSize: dimensions.width * 0.034,
                            color: '#DDB43F',
                            padding: dimensions.width * 0.021,
                          }}
                        >
                          {item.typeOfRoute ? item.typeOfRoute : 'No type Of Route'}
                        </Text>
                      </View>
                      <Text
                        style={{
                          fontFamily: fontOpenSansBold,
                          fontSize: dimensions.width * 0.034,
                          color: 'white',
                          paddingHorizontal: dimensions.width * 0.021,
                          paddingVertical: dimensions.height * 0.001,
                          marginTop: dimensions.height * 0.01,
                          fontWeight: 600
                        }}
                      >
                        Category
                      </Text>
                      <View style={{
                        backgroundColor: 'white',
                        fontWeight: 600,
                        borderRadius: dimensions.width * 0.1,
                        alignSelf: 'flex-start',
                        marginTop: dimensions.height * 0.01,
                        marginLeft: dimensions.width * 0.021,
                      }}>
                        <Text
                          style={{
                            fontFamily: fontOpenSansBold,
                            fontSize: dimensions.width * 0.034,
                            color: '#DDB43F',
                            padding: dimensions.width * 0.021,
                          }}
                        >
                          {item.categoryOfRoute ? item.categoryOfRoute : 'No category Of Route'}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          )}







        </SafeAreaView>

      ) : thisSelectedScreen === 'Shop' ? (
        <ShopScreen setThisSelectedScreen={setThisSelectedScreen} />
      ) : thisSelectedScreen === 'Carrot' ? (
        <CarrotScreen setThisSelectedScreen={setThisSelectedScreen} thisSelectedScreen={thisSelectedScreen}
        />
      ) : thisSelectedScreen === 'AddRoute' ? (
        <AddRouteScreen setThisSelectedScreen={setThisSelectedScreen} thisSelectedScreen={thisSelectedScreen} />
      ) : thisSelectedScreen === 'RouteDetails' ? (
        <RouteDetailsScreen setThisSelectedScreen={setThisSelectedScreen} thisSelectedScreen={thisSelectedScreen} selectedRoute={selectedRoute} />
      ) : thisSelectedScreen === 'Profile' ? (
        <ProfileScreen setThisSelectedScreen={setThisSelectedScreen} thisSelectedScreen={setThisSelectedScreen}
        />
      ) : null}

      {(thisSelectedScreen === 'Home' || thisSelectedScreen === 'Carrot' || thisSelectedScreen === 'Shop' || thisSelectedScreen === 'Profile') && (
        <View
          style={{
            position: 'absolute',
            bottom: '2.5%',
            backgroundColor: '#B08E2F',
            width: '86%',
            paddingHorizontal: dimensions.width * 0.03,
            borderRadius: dimensions.width * 0.1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            alignSelf: 'center',
            paddingVertical: dimensions.height * 0.004,
            zIndex: 5000

          }}
        >
          {buttons.map((button, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setThisSelectedScreen(button.screen)}
              style={{
                borderRadius: dimensions.width * 0.5,
                padding: dimensions.height * 0.019,
                alignItems: 'center',
                marginHorizontal: 5,
                backgroundColor: thisSelectedScreen === button.screen ? 'white' : 'transparent',
                shadowColor: '#000',
                shadowOffset: {
                  width: dimensions.width * 0.01,
                  height: dimensions.height * 0.01,
                },
                shadowOpacity: 0.3,
              }}
            >
              <Image
                source={thisSelectedScreen === button.screen ? button.selectedIcon : button.notSelectedIcon}
                style={{
                  width: dimensions.width * 0.055,
                  height: dimensions.width * 0.055,
                  textAlign: 'center'
                }}
                resizeMode="contain"
              />
            </TouchableOpacity>
          ))}
        </View>
      )}

    </View>
  );
};

export default HomeScreen;
