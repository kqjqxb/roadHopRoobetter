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
import { ChevronLeftIcon, PlusIcon } from 'react-native-heroicons/outline';
import { ScrollView } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserData, saveUserData } from '../redux/userSlice';



const fontOpenSansBold = 'OpenSans-Bold';



const shopButtons = [
    { id: 1, title: 'Your main dream road', image: require('../assets/images/shopImages/shopImage1.png'), price: 50 },
    { id: 2, title: 'Minimalistic way to get point', image: require('../assets/images/shopImages/shopImage2.png'), price: 50 },
    { id: 3, title: 'Through thorns to stars', image: require('../assets/images/shopImages/shopImage3.png'), price: 50 },
    { id: 4, title: 'Mechanical carrots', image: require('../assets/images/shopImages/shopImage4.png'), price: 90 },
    { id: 5, title: 'A bunch of carrots', image: require('../assets/images/shopImages/shopImage5.png'), price: 90 },
    { id: 6, title: 'Single carrot', image: require('../assets/images/shopImages/shopImage6.png'), price: 90 },
]




const ShopScreen = ({ setThisSelectedScreen, thisSelectedScreen }) => {

    const [dimensions, setDimensions] = useState(Dimensions.get('window'));
    const [isRulesVisible, setIsRulesVisible] = useState(false);
    const carrots = useSelector(state => state.user.carrots);
    const dispatch = useDispatch();
    const [savedIconsIds, setSavedIconsIds] = useState([]);

    useEffect(() => {
        console.log('carrots', carrots);
    }, [thisSelectedScreen])

    useEffect(() => {
        const fetchSavedIconsIds = async () => {
            try {
                const savedIds = await AsyncStorage.getItem('SavedIconsIds');
                if (savedIds !== null) {
                    setSavedIconsIds(JSON.parse(savedIds));
                }
            } catch (error) {
                console.error('Failed to fetch saved icons IDs', error);
            }
        };

        fetchSavedIconsIds();
    }, [savedIconsIds]);


    const addIconId = async (id) => {
        try {
            const updatedIds = [...savedIconsIds, id];
            setSavedIconsIds(updatedIds);
            await AsyncStorage.setItem('SavedIconsIds', JSON.stringify(updatedIds));
        } catch (error) {
            console.error('Failed to add icon ID', error);
        }
    };

    const removeIconId = async (id) => {
        try {
            const updatedIds = savedIconsIds.filter(iconId => iconId !== id);
            setSavedIconsIds(updatedIds);
            await AsyncStorage.setItem('SavedIconsIds', JSON.stringify(updatedIds));
        } catch (error) {
            console.error('Failed to remove icon ID', error);
        }
    };

    const isIconSaved = (id) => savedIconsIds.includes(id);

    const subtractCarrots = (amount) => {
        if (carrots >= amount) {
            const updatedCarrotsAmount = carrots - amount;
            dispatch(updateUserData({ carrots: updatedCarrotsAmount }));
            dispatch(saveUserData({ carrots: updatedCarrotsAmount }));
        } else Alert.alert('You do not have enough carrots');
    };



    const handleDelete = (amount) => {
        Alert.alert(
            'Return Icon',
            'Are you sure you want to return the icon?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Return',
                    onPress: async () => {
                        const updatedCarrotsAmount = carrots + amount;
                        dispatch(updateUserData({ carrots: updatedCarrotsAmount, }));
                        dispatch(saveUserData({ carrots: updatedCarrotsAmount, }));
                    },
                    style: 'destructive',
                },
            ],
            { cancelable: true }
        );
    };

    return (

        <SafeAreaView className="flex-1 px-5  " style={{ width: '100%', }}>

            <TouchableOpacity
                onPress={() => {
                    if (isRulesVisible) setIsRulesVisible(false);
                    else setThisSelectedScreen('Home')
                }}
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
                <ChevronLeftIcon size={dimensions.width * 0.1} color='white' />
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <Text style={{
                        marginTop: dimensions.height * 0.025,
                        fontFamily: fontOpenSansBold,
                        fontWeight: 700,
                        textAlign: 'center',
                        alignSelf: 'center',
                        fontSize: dimensions.width * 0.055,
                        color: 'white',
                        marginBottom: dimensions.height * 0.025,
                    }}>
                        {carrots ? carrots : 0}
                    </Text>
                    <Image
                        source={require('../assets/icons/carrotBigIcon.png')}
                        style={{
                            width: dimensions.height * 0.04,
                            height: dimensions.height * 0.04,
                            marginLeft: dimensions.width * 0.02,
                        }}
                        resizeMode='contain'
                    />

                </View>


            </TouchableOpacity>

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
                    {shopButtons.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => {
                                if (!isIconSaved(item.id)) {
                                    addIconId(item.id);
                                    subtractCarrots(item.price);
                                }
                            }}
                            onLongPress={() => {
                                if (isIconSaved(item.id)) {
                                    removeIconId(item.id);
                                    handleDelete(item.price);
                                }
                            }}
                            disabled={isIconSaved(item.id)}
                            style={{
                                alignSelf: 'center',
                                width: '45%',
                                position: 'relative',
                                margin: dimensions.width * 0.016,
                                overflow: 'hidden', // Ensure the border radius is applied to the image
                                zIndex: 500,
                                marginBottom: dimensions.height * 0.02,
                            }}
                        >
                            <Image
                                source={item.image}
                                style={{
                                    width: '100%',
                                    height: undefined,
                                    aspectRatio: 1,
                                    borderRadius: dimensions.width * 0.1,
                                }}
                                resizeMode="contain" // Change resize mode to cover
                            />
                            <Text
                                style={{
                                    fontFamily: fontOpenSansBold,
                                    fontSize: dimensions.width * 0.046,
                                    color: 'white',
                                    paddingHorizontal: dimensions.width * 0.021,
                                    paddingVertical: dimensions.height * 0.001,
                                    marginTop: dimensions.height * 0.01,
                                    fontWeight: '700',
                                }}
                            >
                                {item.title}
                            </Text>

                            <Text
                                style={{
                                    fontFamily: fontOpenSansBold,
                                    fontSize: dimensions.width * 0.025,
                                    color: '#F3F3F3',
                                    paddingHorizontal: dimensions.width * 0.021,
                                    paddingVertical: dimensions.height * 0.0005,
                                    marginTop: dimensions.height * 0.005,
                                    fontWeight: '700',
                                    opacity: 0.7
                                }}
                            >
                                Collector's item
                            </Text>
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginTop: dimensions.height * 0.01,
                                alignSelf: 'flex-start',
                                marginLeft: dimensions.width * 0.021,
                            }}>
                                <Text style={{
                                    fontFamily: fontOpenSansBold,
                                    fontWeight: 700,
                                    textAlign: 'center',
                                    alignSelf: 'center',
                                    fontSize: dimensions.width * 0.064,
                                    color: 'white',
                                }}>
                                    {item.price}
                                </Text>
                                <Image
                                    source={require('../assets/icons/carrotBigIcon.png')}
                                    style={{
                                        width: dimensions.height * 0.04,
                                        height: dimensions.height * 0.04,
                                        marginLeft: dimensions.width * 0.02,
                                    }}
                                    resizeMode='contain'
                                />

                            </View>

                            <View style={{
                                backgroundColor: '#DDB43F',
                                borderRadius: dimensions.width * 0.025,
                                paddingVertical: dimensions.height * 0.016,
                                marginTop: dimensions.height * 0.007,
                                alignSelf: 'center',
                                width: '95%',
                            }}>
                                <Text
                                    style={{ fontFamily: fontOpenSansBold, color: 'white', fontSize: dimensions.width * 0.04, textAlign: 'center', fontWeight: 600 }}>
                                    {isIconSaved(item.id) ? 'You have it' : 'Get'}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>










        </SafeAreaView>
    );
};

export default ShopScreen;
