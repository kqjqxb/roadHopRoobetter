import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    Dimensions,
    Share,
    ScrollView,
    Alert,
    SafeAreaView,
    ImageBackground,
    Modal,
    Switch,
    TextInput,
    Linking,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ArrowRightIcon, CheckIcon, ChevronLeftIcon, ChevronRightIcon, PlusIcon } from 'react-native-heroicons/solid';
import { is, se } from 'date-fns/locale';
import MapView, { Marker } from 'react-native-maps';

const fontSFProBold = 'SFProText-Bold';
const fontOpenSansBold = 'OpenSans-Bold';

const RouteDetailsScreen = ({ setThisSelectedScreen, thisSelectedScreen, selectedRoute, setEntertainments, entertainments }) => {
    const [dimensions, setDimensions] = useState(Dimensions.get('window'));
    const [isTextClosed, setIsTextClosed] = useState(true);

    return (
        <SafeAreaView style={{
            width: dimensions.width,
            flex: 1,
            alignItems: 'center',
            justifyContent: 'flex-start',
            position: 'relative',
            width: '100%',
            zIndex: 1
        }} >


            <View style={{
                zIndex: 50,
                alignSelf: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '93%',

                padding: dimensions.width * 0.02,



                backgroundColor: 'rgba(147, 139, 249, 0.34)',
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
                    Road
                </Text>
            </View>




            <ScrollView style={{ width: '100%', }}>
                <View style={{
                    marginBottom: dimensions.height * 0.25,
                    alignItems: 'center',
                    alignSelf: 'center',
                    width: '100%',
                    marginTop: dimensions.height * 0.02,
                }}>

                    <View style={{
                        alignSelf: 'center',
                        width: '100%',

                        alignItems: 'center',
                        justifyContent: 'center',

                    }}>

                        {selectedRoute.images.length === 0 ? (
                            <View style={{
                                backgroundColor: '#202020',
                                alignSelf: 'center',
                                width: '100%',
                                borderRadius: dimensions.width * 0.07,
                                marginBottom: dimensions.height * 0.02,
                                alignItems: 'center',
                                justifyContent: 'center',
                                paddingVertical: dimensions.height * 0.07,
                            }}>



                                <Text
                                    style={{
                                        fontFamily: fontSFProBold,
                                        fontSize: dimensions.width * 0.041,
                                        color: 'white',
                                        textAlign: 'center',
                                        fontWeight: 700,
                                        marginTop: dimensions.height * 0.016,
                                        alignSelf: 'center',
                                        paddingHorizontal: dimensions.width * 0.14,
                                    }}
                                >
                                    No image here
                                </Text>


                            </View>
                        ) : (

                            <Image
                                source={{ uri: selectedRoute.images[0] }}
                                style={{
                                    width: selectedRoute.images.length > 0 ? dimensions.width : dimensions.width * 0.07,
                                    height: selectedRoute.images.length > 0 ? dimensions.height * 0.3 : dimensions.width * 0.07,
                                    textAlign: 'center',
                                    borderRadius: dimensions.width * 0.1,
                                }}
                                resizeMode="stretch"
                            />
                        )}



                    </View>


                    <View style={{
                        width: '100%',
                        flexDirection: 'row',
                        alignItems: 'center',

                        alignSelf: 'flex-start',
                    }}>

                        <Text
                            style={{
                                fontFamily: fontSFProBold,
                                fontSize: dimensions.width * 0.041,
                                color: 'white',
                                textAlign: 'left',
                                fontWeight: 700,
                                alignSelf: 'flex-start',
                                paddingHorizontal: dimensions.width * 0.021,
                                paddingVertical: dimensions.height * 0.014,
                                marginLeft: dimensions.width * 0.03,


                            }}
                        >
                            Name of route
                        </Text>
                    </View>


                    <View style={{
                        width: '91%',
                        flexDirection: 'row',
                        alignItems: 'center',
                        borderWidth: dimensions.width * 0.003,
                        borderColor: '#DDB43F',
                        borderRadius: dimensions.width * 0.03,
                        alignSelf: 'center',

                    }}>

                        <Text
                            style={{
                                fontFamily: fontSFProBold,
                                fontSize: dimensions.width * 0.041,
                                color: 'white',
                                textAlign: 'left',
                                fontWeight: 400,
                                alignSelf: 'flex-start',
                                paddingHorizontal: dimensions.width * 0.021,
                                paddingVertical: dimensions.height * 0.014,
                                marginLeft: dimensions.width * 0.03,


                            }}
                        >
                            {selectedRoute.routeName}
                        </Text>
                    </View>



                    <View style={{
                        width: '100%',
                        flexDirection: 'row',
                        alignItems: 'center',

                        alignSelf: 'flex-start',
                    }}>

                        <Text
                            style={{
                                fontFamily: fontSFProBold,
                                fontSize: dimensions.width * 0.041,
                                color: 'white',
                                textAlign: 'left',
                                fontWeight: 700,
                                alignSelf: 'flex-start',
                                paddingHorizontal: dimensions.width * 0.021,
                                paddingVertical: dimensions.height * 0.014,
                                marginLeft: dimensions.width * 0.03,


                            }}
                        >
                            Description of route
                        </Text>
                    </View>


                    <View style={{
                        width: '91%',
                        flexDirection: 'row',
                        alignItems: 'center',
                        borderWidth: dimensions.width * 0.003,
                        borderColor: '#DDB43F',
                        borderRadius: dimensions.width * 0.03,
                        alignSelf: 'center',
                        paddingVertical: dimensions.height * 0.014,

                    }}>

                        <Text
                            style={{
                                fontFamily: fontSFProBold,
                                fontSize: dimensions.width * 0.041,
                                color: 'white',
                                textAlign: 'left',
                                fontWeight: 400,
                                alignSelf: 'flex-start',
                                paddingHorizontal: dimensions.width * 0.021,
                                paddingVertical: dimensions.height * 0.014,
                                marginLeft: dimensions.width * 0.03,


                            }}
                        >
                            {selectedRoute.description}
                        </Text>
                    </View>


                    <View style={{
                        width: '100%',
                        flexDirection: 'row',
                        alignItems: 'center',

                        alignSelf: 'flex-start',
                    }}>

                        <Text
                            style={{
                                fontFamily: fontSFProBold,
                                fontSize: dimensions.width * 0.041,
                                color: 'white',
                                textAlign: 'left',
                                fontWeight: 700,
                                alignSelf: 'flex-start',
                                paddingHorizontal: dimensions.width * 0.021,
                                paddingVertical: dimensions.height * 0.014,
                                marginLeft: dimensions.width * 0.03,


                            }}
                        >
                            Type of route
                        </Text>
                    </View>


                    <View style={{
                        width: '91%',
                        flexDirection: 'row',
                        alignItems: 'center',
                        borderWidth: dimensions.width * 0.003,
                        borderColor: '#DDB43F',
                        borderRadius: dimensions.width * 0.03,
                        alignSelf: 'center',

                    }}>

                        <Text
                            style={{
                                fontFamily: fontSFProBold,
                                fontSize: dimensions.width * 0.041,
                                color: 'white',
                                textAlign: 'left',
                                fontWeight: 400,
                                alignSelf: 'flex-start',
                                paddingHorizontal: dimensions.width * 0.021,
                                paddingVertical: dimensions.height * 0.014,
                                marginLeft: dimensions.width * 0.03,


                            }}
                        >
                            {selectedRoute.typeOfRoute}
                        </Text>
                    </View>


                    <View style={{
                        width: '100%',
                        flexDirection: 'row',
                        alignItems: 'center',

                        alignSelf: 'flex-start',
                    }}>

                        <Text
                            style={{
                                fontFamily: fontSFProBold,
                                fontSize: dimensions.width * 0.041,
                                color: 'white',
                                textAlign: 'left',
                                fontWeight: 700,
                                alignSelf: 'flex-start',
                                paddingHorizontal: dimensions.width * 0.021,
                                paddingVertical: dimensions.height * 0.014,
                                marginLeft: dimensions.width * 0.03,


                            }}
                        >
                            Type of route
                        </Text>
                    </View>


                    <View style={{
                        backgroundColor: '#DDB43F',
                        fontWeight: 600,
                        borderRadius: dimensions.width * 0.1,
                        alignSelf: 'flex-start',
                        marginTop: dimensions.height * 0.003,
                        marginLeft: dimensions.width * 0.05,
                    }}>
                        <Text
                            style={{
                                fontFamily: fontOpenSansBold,
                                fontSize: dimensions.width * 0.034,
                                color: 'white',
                                padding: dimensions.width * 0.021,
                                fontWeight: 700,
                            }}
                        >
                            {selectedRoute.typeOfRoute ? selectedRoute.typeOfRoute : 'No type Of Route'}
                        </Text>
                    </View>


                    <View style={{
                        width: '100%',
                        flexDirection: 'row',
                        alignItems: 'center',

                        alignSelf: 'flex-start',
                    }}>

                        <Text
                            style={{
                                fontFamily: fontSFProBold,
                                fontSize: dimensions.width * 0.041,
                                color: 'white',
                                textAlign: 'left',
                                fontWeight: 700,
                                alignSelf: 'flex-start',
                                paddingHorizontal: dimensions.width * 0.021,
                                paddingVertical: dimensions.height * 0.014,
                                marginLeft: dimensions.width * 0.03,


                            }}
                        >
                            Road category
                        </Text>
                    </View>


                    <View style={{
                        backgroundColor: '#DDB43F',
                        fontWeight: 600,
                        borderRadius: dimensions.width * 0.1,
                        alignSelf: 'flex-start',
                        marginTop: dimensions.height * 0.003,
                        marginLeft: dimensions.width * 0.05,
                    }}>
                        <Text
                            style={{
                                fontFamily: fontOpenSansBold,
                                fontSize: dimensions.width * 0.034,
                                color: 'white',
                                padding: dimensions.width * 0.021,
                                fontWeight: 700,
                                paddingHorizontal: dimensions.width * 0.03,
                            }}
                        >
                            {selectedRoute.categoryOfRoute ? selectedRoute.categoryOfRoute : 'No type Of Route'}
                        </Text>
                    </View>


                    <View style={{
                        width: '100%',
                        flexDirection: 'row',
                        alignItems: 'center',

                        alignSelf: 'flex-start',
                    }}>

                        <Text
                            style={{
                                fontFamily: fontSFProBold,
                                fontSize: dimensions.width * 0.041,
                                color: 'white',
                                textAlign: 'left',
                                fontWeight: 700,
                                alignSelf: 'flex-start',
                                paddingHorizontal: dimensions.width * 0.021,
                                paddingVertical: dimensions.height * 0.014,
                                marginLeft: dimensions.width * 0.03,


                            }}
                        >
                            Road assessment
                        </Text>
                    </View>


                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                        borderRadius: dimensions.width * 0.03,
                        borderWidth: dimensions.width * 0.003,
                        borderColor: '#DDB43F',
                        width: '91%',
                        alignSelf: 'center',
                        padding: dimensions.width * 0.025,

                    }}>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((carrot) => (
                            <View key={carrot} onPress={() => handleStarPress(carrot)}>
                                <Image
                                    source={selectedRoute.rating >= carrot ? require('../assets/icons/orangeCarrotIcon.png') : require('../assets/icons/whiteCarrotIcon.png')}
                                    style={{
                                        textAlign: 'center', width: dimensions.width * 0.086, height: dimensions.width * 0.07,
                                        opacity: 1
                                    }}
                                    resizeMode="stretch"
                                />
                                {/* <StarIcon style={{ color: rating >= carrot ? '#DCA100' : 'gray', }} size={dimensions.width * 0.12} /> */}
                            </View>
                        ))}
                    </View>


                    <View style={{
                        width: '100%',
                        flexDirection: 'row',
                        alignItems: 'center',

                        alignSelf: 'flex-start',
                    }}>

                        <Text
                            style={{
                                fontFamily: fontSFProBold,
                                fontSize: dimensions.width * 0.041,
                                color: 'white',
                                textAlign: 'left',
                                fontWeight: 700,
                                alignSelf: 'flex-start',
                                paddingHorizontal: dimensions.width * 0.021,
                                paddingVertical: dimensions.height * 0.014,
                                marginLeft: dimensions.width * 0.03,


                            }}
                        >
                            Road on map
                        </Text>
                    </View>


                    <MapView
                        style={{
                            width: '91%',
                            height: dimensions.height * 0.35,
                            borderRadius: 40,
                            alignSelf: 'center',
                            marginTop: dimensions.height * 0.005,
                            height: dimensions.height * 0.25,
                        }}
                        region={{
                            latitude: selectedRoute.coordinates.latitude,
                            longitude: selectedRoute.coordinates.longitude,
                            // latitude: 50.32610323286961,
                            // longitude: 19.008192701538068,
                            latitudeDelta: 0.01,
                            longitudeDelta: 0.01,
                        }}
                    >

                        <Marker
                            key={selectedRoute.id}
                            coordinate={selectedRoute.coordinates}
                            // coordinate={{
                            //     latitude: 50.32610323286961,
                            //     longitude: 19.008192701538068
                            //   }}
                            title={selectedRoute.locationName ? selectedRoute.locationName : 'No location name here'}
                            description={selectedRoute.description ? (selectedRoute.description.length > 30 ? selectedRoute.description.substring(0, 30) + '...' : selectedRoute.description) : "This is the location you selected"}
                            pinColor="#DDB43F"
                        />

                    </MapView>


                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

export default RouteDetailsScreen;
