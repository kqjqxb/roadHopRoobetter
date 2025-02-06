import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    Dimensions,
    ScrollView,
    Alert,
    TextInput,
    SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ChevronLeftIcon, CheckIcon, PlusIcon } from 'react-native-heroicons/solid';
import * as ImagePicker from 'react-native-image-picker';
import { add } from 'date-fns';
import MapView, { Marker } from 'react-native-maps';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserData, saveUserData } from '../redux/userSlice';

const fontRobotoBold = 'Roboto-Bold';
const fontOpenSansBold = 'OpenSans-Bold';

const AddRouteScreen = ({ setThisSelectedScreen,  }) => {
    const [dimensions, setDimensions] = useState(Dimensions.get('window'));
    const [isTextClosed, setIsTextClosed] = useState(true);
    const [routeName, setTitle] = useState('');
    const [locationName, setLocationName] = useState('');
    const [description, setDescription] = useState('');
    const [images, setImages] = useState([]);
    const [selectedRouteType, setSelectedRouteType] = useState('Simple');
    const [selectedRouteCategory, setSelectedRouteCategory] = useState('Sport');
    const [rating, setRating] = useState(0);
    const [markerCoordinates, setMarkerCoordinates] = useState(null);
    const carrots = useSelector(state => state.user.carrots);
    const dispatch = useDispatch();

    const handleMapPress = (event) => {
        const { coordinate } = event.nativeEvent;
        setMarkerCoordinates(coordinate);
    };

    const handleStarPress = (rate) => {
        setRating(rate);
    };


    const addCarrots = () => {
        let amount = 5;
        if (!carrots) {
            dispatch(updateUserData({ carrots: 5, }));
            dispatch(saveUserData({ carrots: 5, }));
        } else {
            const updatedCarrotsAmount = carrots + amount;
            dispatch(updateUserData({ carrots: updatedCarrotsAmount, }));
            dispatch(saveUserData({ carrots: updatedCarrotsAmount, }));
        }
    };


    const handleImagePicker = () => {
        ImagePicker.launchImageLibrary({ mediaType: 'photo' }, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else {
                setImages([...images, response.assets[0].uri]);
            }
        });
    };

    const handleSaveRoute = async () => {
        const routes = JSON.parse(await AsyncStorage.getItem('Routes')) || [];
        const newId = routes.length > 0 ? Math.max(...routes.map(e => e.id)) + 1 : 1;
        const newEntertainment = {
            id: newId,
            locationName: locationName ? locationName : 'No location Name here',
            routeName: routeName ? routeName : 'No route name here',
            description: description ? description : 'No description here',
            typeOfRoute: selectedRouteType ? selectedRouteType : 'Simple',
            categoryOfRoute: selectedRouteCategory ? selectedRouteCategory : 'No category',
            locationName: locationName ? locationName : 'No locationName here',
            images,
            rating: rating ? rating : 0,
            coordinates: markerCoordinates ? { latitude: markerCoordinates.latitude, longitude: markerCoordinates.longitude } : { latitude: 0, longitude: 0 },
        };
        try {
            routes.unshift(newEntertainment);
            await AsyncStorage.setItem('Routes', JSON.stringify(routes));
            setThisSelectedScreen('Home');
        } catch (error) {
            console.error('Error saving entertainment:', error);
        }
    };




    const handleDeleteImage = (index) => {
        Alert.alert(
            "Delete Image",
            "Are you sure you want to delete this image?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Delete",
                    onPress: () => {
                        const newImages = [...images];
                        newImages.splice(index, 1);
                        setImages(newImages);
                    },
                    style: "destructive"
                }
            ]
        );
    };

    return (
        <SafeAreaView style={{
            width: dimensions.width,
            flex: 1,
            alignItems: 'center',
            justifyContent: 'flex-start',
            position: 'relative',
            width: '100%',
            zIndex: 1,
        }} >
            <View style={{
                zIndex: 50,
                alignSelf: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '93%',
                padding: dimensions.width * 0.02,
                backgroundColor: 'rgba(255, 255, 255, 0.09)',
                borderRadius: dimensions.width * 0.05,
                paddingHorizontal: dimensions.width * 0.05,

            }}>
                <TouchableOpacity
                    onPress={() => {
                        if (!isTextClosed) {
                            setIsTextClosed(true);
                        } else setThisSelectedScreen('Home');
                    }}
                    style={{

                        zIndex: 100,
                    }}>
                    <ChevronLeftIcon size={dimensions.width * 0.1} color='white' />
                </TouchableOpacity>

                <Text
                    style={{
                        fontSize: dimensions.width * 0.061,
                        fontFamily: fontOpenSansBold,
                        color: '#DDB43F',
                        textAlign: 'center',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',

                        paddingHorizontal: 21,
                    }}>
                    Add road
                </Text>
            </View>
            <ScrollView style={{ width: '100%', }}>
                <View style={{
                    marginBottom: dimensions.height * 0.25,
                    alignItems: 'center',
                    alignSelf: 'center',
                    width: '100%',
                    marginTop: dimensions.height * 0.01,
                }}>
                    <View style={{
                        width: '100%',
                        flexDirection: 'row',
                        alignSelf: 'center',
                        alignItems: 'center',
                        paddingHorizontal: dimensions.width * 0.03,
                    }}>
                        <Text
                            style={{
                                fontSize: dimensions.width * 0.03,
                                fontFamily: fontOpenSansBold,
                                color: '#F3F3F3',
                                textAlign: 'center',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 400,
                                opacity: 0.8

                                // paddingRight: dimensions.width * 0.01,
                            }}>
                            You will get +5
                        </Text>
                        <Image source={require('../assets/icons/carrotIconInCirce.png')} style={{
                            width: dimensions.width * 0.05,
                            height: dimensions.width * 0.05,
                            textAlign: 'center',
                            marginHorizontal: dimensions.width * 0.01,
                        }}
                            resizeMode='contain'
                        />
                        <Text
                            style={{
                                fontSize: dimensions.width * 0.03,
                                fontFamily: fontOpenSansBold,
                                color: '#F3F3F3',
                                textAlign: 'center',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 400,
                                opacity: 0.8,
                                paddingRight: dimensions.width * 0.01,
                            }}>
                            carrot coins for adding each route
                        </Text>

                    </View>


                    <Text
                        style={{
                            fontSize: dimensions.width * 0.04,
                            fontFamily: fontOpenSansBold,
                            color: 'white',
                            textAlign: 'left',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 600,

                            paddingHorizontal: dimensions.width * 0.03,
                            marginTop: dimensions.height * 0.012,
                        }}>
                        Select a mark on the map with the location of the road
                    </Text>

                    <Text
                        style={{
                            fontSize: dimensions.width * 0.04,
                            fontFamily: fontOpenSansBold,
                            color: 'white',
                            textAlign: 'left',
                            alignSelf: 'flex-start',
                            fontWeight: 600,

                            paddingHorizontal: dimensions.width * 0.03,
                            marginTop: dimensions.height * 0.016,
                            marginBottom: dimensions.height * 0.01,
                        }}>
                        Enter name of route
                    </Text>
                    <TextInput
                        placeholder="Name of route"
                        value={routeName}
                        onChangeText={setTitle}
                        placeholderTextColor="#8f8f8f"
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'left',
                            padding: dimensions.width * 0.035,
                            backgroundColor: 'transparent',
                            borderWidth: dimensions.width * 0.003,
                            borderColor: '#DDB43F',
                            borderRadius: dimensions.width * 0.03,
                            width: '95%',
                            marginBottom: dimensions.height * 0.005,
                            color: 'white',
                            fontFamily: fontRobotoBold,
                            fontSize: dimensions.width * 0.04,
                            fontWeight: 400,
                            textAlign: 'left',
                        }}
                    />


                    <Text
                        style={{
                            fontSize: dimensions.width * 0.04,
                            fontFamily: fontOpenSansBold,
                            color: 'white',
                            textAlign: 'left',
                            alignSelf: 'flex-start',
                            fontWeight: 600,

                            paddingHorizontal: dimensions.width * 0.03,
                            marginTop: dimensions.height * 0.016,
                            marginBottom: dimensions.height * 0.01,
                        }}>
                        Enter description of route
                    </Text>
                    <TextInput
                        placeholder="Description of route"
                        value={description}
                        onChangeText={setDescription}
                        placeholderTextColor="#8f8f8f"
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'left',
                            padding: dimensions.width * 0.035,
                            backgroundColor: 'transparent',
                            borderWidth: dimensions.width * 0.003,
                            borderColor: '#DDB43F',
                            borderRadius: dimensions.width * 0.03,
                            width: '95%',
                            marginBottom: dimensions.height * 0.005,
                            color: 'white',
                            fontFamily: fontRobotoBold,
                            fontSize: dimensions.width * 0.04,
                            fontWeight: 400,
                            textAlign: 'left',
                        }}
                    />


                    <Text
                        style={{
                            fontSize: dimensions.width * 0.04,
                            fontFamily: fontOpenSansBold,
                            color: 'white',
                            textAlign: 'left',
                            alignSelf: 'flex-start',
                            fontWeight: 600,

                            paddingHorizontal: dimensions.width * 0.03,
                            marginTop: dimensions.height * 0.016,
                            marginBottom: dimensions.height * 0.01,
                        }}>
                        Select type of route
                    </Text>

                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        width: '95%',
                    }}>

                        {['Simple', 'Intense'].map((rType, index) => (
                            <TouchableOpacity
                                onPress={() => setSelectedRouteType(rType)}
                                key={index} style={{
                                    borderRadius: dimensions.width * 0.5,
                                    paddingHorizontal: dimensions.width * 0.03,
                                    backgroundColor: selectedRouteType === rType ? '#DDB43F' : 'white',
                                    marginRight: dimensions.width * 0.03,
                                }}>
                                <Text
                                    style={{
                                        fontSize: dimensions.width * 0.03,
                                        fontFamily: fontOpenSansBold,
                                        color: selectedRouteType === rType ? 'white' : '#DDB43F',
                                        textAlign: 'left',
                                        alignSelf: 'flex-start',
                                        fontWeight: 600,

                                        paddingHorizontal: dimensions.width * 0.025,
                                        paddingVertical: dimensions.height * 0.01,

                                    }}>
                                    {rType}
                                </Text>

                            </TouchableOpacity>
                        ))}
                    </View>


                    <Text
                        style={{
                            fontSize: dimensions.width * 0.04,
                            fontFamily: fontOpenSansBold,
                            color: 'white',
                            textAlign: 'left',
                            alignSelf: 'flex-start',
                            fontWeight: 600,

                            paddingHorizontal: dimensions.width * 0.03,
                            marginTop: dimensions.height * 0.016,
                            marginBottom: dimensions.height * 0.01,
                        }}>
                        Select a route category
                    </Text>

                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        width: '95%',
                        flexWrap: 'wrap',
                    }}>

                        {['Sport', 'Family', 'Walking', 'With friends', 'Other'].map((rCategory, index) => (
                            <TouchableOpacity
                                onPress={() => setSelectedRouteCategory(rCategory)}
                                key={index} style={{
                                    borderRadius: dimensions.width * 0.5,
                                    paddingHorizontal: dimensions.width * 0.03,
                                    backgroundColor: selectedRouteCategory === rCategory ? '#DDB43F' : 'white',
                                    marginRight: dimensions.width * 0.03,
                                    marginVertical: dimensions.height * 0.005,
                                }}>
                                <Text
                                    style={{
                                        fontSize: dimensions.width * 0.03,
                                        fontFamily: fontOpenSansBold,
                                        color: selectedRouteCategory === rCategory ? 'white' : '#DDB43F',
                                        textAlign: 'left',
                                        alignSelf: 'flex-start',
                                        fontWeight: 600,

                                        paddingHorizontal: dimensions.width * 0.025,
                                        paddingVertical: dimensions.height * 0.01,

                                    }}>
                                    {rCategory}
                                </Text>

                            </TouchableOpacity>
                        ))}
                    </View>


                    <Text
                        style={{
                            fontSize: dimensions.width * 0.04,
                            fontFamily: fontOpenSansBold,
                            color: 'white',
                            textAlign: 'left',
                            alignSelf: 'flex-start',
                            fontWeight: 600,

                            paddingHorizontal: dimensions.width * 0.03,
                            marginTop: dimensions.height * 0.016,
                            marginBottom: dimensions.height * 0.01,
                        }}>
                        Location name
                    </Text>


                    <TextInput
                        placeholder="Location name"
                        value={locationName}
                        onChangeText={setLocationName}
                        placeholderTextColor="#8f8f8f"
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'left',
                            padding: dimensions.width * 0.035,
                            backgroundColor: 'transparent',
                            borderWidth: dimensions.width * 0.003,
                            borderColor: '#DDB43F',
                            borderRadius: dimensions.width * 0.03,
                            width: '95%',
                            marginBottom: dimensions.height * 0.005,
                            color: 'white',
                            fontFamily: fontRobotoBold,
                            fontSize: dimensions.width * 0.04,
                            fontWeight: 400,
                            textAlign: 'left',
                        }}
                    />

                    <Text
                        style={{
                            fontSize: dimensions.width * 0.04,
                            fontFamily: fontOpenSansBold,
                            color: 'white',
                            textAlign: 'left',
                            alignSelf: 'flex-start',
                            fontWeight: 600,

                            paddingHorizontal: dimensions.width * 0.03,
                            marginTop: dimensions.height * 0.016,
                            marginBottom: dimensions.height * 0.01,
                        }}>
                        Upload photo
                    </Text>



                    <View style={{
                        width: '100%',
                        alignSelf: 'flex-start',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'row',
                    }}>
                        {images.length === 0 && (
                            <TouchableOpacity
                                onPress={handleImagePicker}
                                style={{
                                    alignItems: 'center',
                                    marginBottom: dimensions.height * 0.01,
                                    alignSelf: 'flex-start',
                                    backgroundColor: '#202020',
                                    borderRadius: dimensions.width * 0.064,
                                    padding: dimensions.width * 0.1,

                                }}>
                                <TouchableOpacity
                                    onPress={handleImagePicker}
                                    style={{
                                        padding: dimensions.width * 0.025,
                                        backgroundColor: '#DDB43F',
                                        borderRadius: dimensions.width * 0.043,
                                        alignItems: 'center',
                                        justifyContent: 'center',

                                    }}>
                                    <PlusIcon size={dimensions.width * 0.064} color='black' />
                                </TouchableOpacity>
                            </TouchableOpacity>
                        )}
                        {images.map((image, index) => (
                            <TouchableOpacity key={index} onPress={() => handleDeleteImage(index)}>
                                <Image
                                    source={{ uri: image }}
                                    style={{
                                        width: dimensions.width * 0.3,
                                        height: dimensions.width * 0.3,
                                        marginRight: dimensions.width * 0.03,
                                        borderRadius: dimensions.width * 0.04,
                                    }}
                                    resizeMode="cover"
                                />
                            </TouchableOpacity>
                        ))}

                    </View>


                    <Text
                        style={{
                            fontSize: dimensions.width * 0.04,
                            fontFamily: fontOpenSansBold,
                            color: 'white',
                            textAlign: 'left',
                            alignSelf: 'flex-start',
                            fontWeight: 600,

                            paddingHorizontal: dimensions.width * 0.03,
                            marginTop: dimensions.height * 0.016,
                            marginBottom: dimensions.height * 0.01,
                        }}>
                        Road assessment
                    </Text>


                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                        borderRadius: dimensions.width * 0.03,
                        borderWidth: dimensions.width * 0.003,
                        borderColor: '#DDB43F',
                        width: '95%',
                        alignSelf: 'center',
                        padding: dimensions.width * 0.025,

                    }}>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((carrot) => (
                            <TouchableOpacity key={carrot} onPress={() => handleStarPress(carrot)}>
                                <Image
                                    source={rating >= carrot ? require('../assets/icons/orangeCarrotIcon.png') : require('../assets/icons/whiteCarrotIcon.png')}
                                    style={{
                                        textAlign: 'center', width: dimensions.width * 0.086, height: dimensions.width * 0.07,
                                        opacity: 1
                                    }}
                                    resizeMode="stretch"
                                />
                                {/* <StarIcon style={{ color: rating >= carrot ? '#DCA100' : 'gray', }} size={dimensions.width * 0.12} /> */}
                            </TouchableOpacity>
                        ))}
                    </View>




                    <Text
                        style={{
                            fontSize: dimensions.width * 0.04,
                            fontFamily: fontOpenSansBold,
                            color: 'white',
                            textAlign: 'left',
                            alignItems: 'center',
                            justifyContent: 'center',
                            alignSelf: 'flex-start',
                            fontWeight: 600,

                            paddingHorizontal: dimensions.width * 0.03,
                            marginTop: dimensions.height * 0.019,
                        }}>
                        Your address
                    </Text>
                    <MapView
                        style={{
                            width: '91%',
                            height: dimensions.height * 0.35,
                            borderRadius: 40,
                            alignSelf: 'center',
                            marginTop: dimensions.height * 0.01,
                            height: dimensions.height * 0.25,
                        }}
                        region={{
                            latitude: 40.730610,
                            longitude: -73.935242,
                            latitudeDelta: 0.01,
                            longitudeDelta: 0.01,
                        }}
                        onPress={handleMapPress}
                    >
                        {markerCoordinates && (
                            <Marker
                                coordinate={markerCoordinates}
                                title={locationName ? locationName : 'No location name here'}
                                description={description ? (description.length > 30 ? description.substring(0, 30) + '...' : description) : "This is the location you selected"}
                                pinColor="#DDB43F"
                            />
                        )}
                    </MapView>


                    <TouchableOpacity
                        disabled={!markerCoordinates || !locationName || !routeName || !rating || !selectedRouteCategory || !selectedRouteType}
                        onPress={() => {
                            handleSaveRoute();
                            addCarrots();
                        }}
                        style={{
                            backgroundColor: '#DDB43F',
                            borderRadius: dimensions.width * 0.025,
                            paddingVertical: dimensions.height * 0.016,
                            marginTop: dimensions.height * 0.03,
                            alignSelf: 'center',
                            width: '95%',
                            opacity: !markerCoordinates || !locationName || !routeName || !rating || !selectedRouteCategory || !selectedRouteType ? 0.5 : 1,
                        }}
                    >
                        <Text
                            style={{ fontFamily: fontOpenSansBold, color: 'white', fontSize: dimensions.width * 0.04, textAlign: 'center', fontWeight: 600 }}>
                            Select
                        </Text>
                    </TouchableOpacity>

                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default AddRouteScreen;
