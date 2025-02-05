import React, { useEffect, useState, useMemo, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    StyleSheet,
    Dimensions,
    ActivityIndicator,
    Share,
    Animated,
    Easing,
    Alert,
    Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ChevronLeftIcon, PlusIcon } from 'react-native-heroicons/outline';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserData, saveUserData } from '../redux/userSlice';




const fontOpenSansBold = 'OpenSans-Bold';
const fontOpenSansRegular = 'OpenSans-Regular';
const fontOpenSansSemiBold = 'OpenSans-SemiBold';




const buttons = [
    { screen: 'Home', notSelectedIcon: require('../assets/icons/buttonsIcons/routeIcon.png'), selectedIcon: require('../assets/icons/selectedIcons/selectedRouteIcon.png') },
    { screen: 'Carrot', notSelectedIcon: require('../assets/icons/buttonsIcons/carrotIcon.png'), selectedIcon: require('../assets/icons/selectedIcons/selectedCarrotIcon.png') },
    { screen: 'Shop', notSelectedIcon: require('../assets/icons/buttonsIcons/shopIcon.png'), selectedIcon: require('../assets/icons/selectedIcons/selectedShopIcon.png') },
    { screen: 'Profile', notSelectedIcon: require('../assets/icons/buttonsIcons/profileIcon.png'), selectedIcon: require('../assets/icons/selectedIcons/selectedProfileIcon.png') },
];


const gameButtons = [
    { gameMode: 'Easy', image: require('../assets/images/gameImages/easyModeImage.png') },
    { gameMode: 'Medium', image: require('../assets/images/gameImages/mediumModeImage.png') },
    { gameMode: 'Hard', image: require('../assets/images/gameImages/hardModeImage.png') },
]



const CarrotScreen = ({ setThisSelectedScreen, thisSelectedScreen }) => {

    const [dimensions, setDimensions] = useState(Dimensions.get('window'));
    const [routes, setRoutes] = useState([]);
    const [isRulesVisible, setIsRulesVisible] = useState(false);
    const [isGameStarted, setIsGameStarted] = useState(false);
    const [difficulty, setDifficulty] = useState('Easy');
    const carrots = useSelector(state => state.user.carrots);
    const dispatch = useDispatch();
    const [gameCarrots, setGameCarrots] = useState(0);


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


    const addCarrots = (amount) => {
        if (!carrots) {
            dispatch(updateUserData({ carrots: 1, }));
            dispatch(saveUserData({ carrots: 1, }));
        } else {
            const updatedCarrotsAmount = carrots + amount;
            dispatch(updateUserData({ carrots: updatedCarrotsAmount, }));
            dispatch(saveUserData({ carrots: updatedCarrotsAmount, }));
        }
    };


    const [carrotPosition, setCarrotPosition] = useState(null);
    const [timer, setTimer] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const intervalRef = useRef(null);
    const timerRef = useRef(0);

    const maxTime = difficulty === 'easy' ? 2 : difficulty === 'medium' ? 1 : 0.8;

    useEffect(() => {
        generateCarrotPosition();
        startTimer();

        return () => clearInterval(intervalRef.current);
    }, []);

    const generateCarrotPosition = () => {
        const randomPosition = Math.floor(Math.random() * 6) + 1;
        setCarrotPosition(randomPosition);
    };

    const startTimer = () => {
        intervalRef.current = setInterval(() => {
            timerRef.current += 0.001;
            setTimer(timerRef.current);

            if (timerRef.current >= maxTime) {
                clearInterval(intervalRef.current);
                setGameOver(true);
            }
        }, 1);
    };

    const handlePress = (position) => {
        if (position === carrotPosition) {
            addCarrots(1);
            setGameCarrots(gameCarrots + 1);
            timerRef.current = 0;
            setTimer(0);
            generateCarrotPosition();
        } else {
            clearInterval(intervalRef.current);
            setGameOver(true);
        }
    };

    return (

        <SafeAreaView className="flex-1 px-5  " style={{ width: '100%', }}>

            <TouchableOpacity
                onPress={() => {
                    if (isGameStarted) setIsGameStarted(false);
                    else if (isRulesVisible) setIsRulesVisible(false);
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
                {isGameStarted ? (
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
                            {gameCarrots}
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
                ) : (
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
                        Carrot Game
                    </Text>
                )}


            </TouchableOpacity>
            {!isRulesVisible && !isGameStarted ? (
                <View style={{
                    width: '100%',
                    marginTop: dimensions.height * 0.02,
                    marginBottom: dimensions.height * 0.25,
                    flexWrap: 'wrap',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                }}>
                    {gameButtons.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => {
                                if (gameButtons.gameMode === 'Easy') setDifficulty('easy');
                                else if (gameButtons.gameMode === 'Medium') setDifficulty('medium');
                                else if (gameButtons.gameMode === 'Hard') setDifficulty('hard');
                                setIsGameStarted(true)
                            }}
                            onLongPress={() => handleDelete(item.id)}
                            style={{
                                alignSelf: 'center',
                                width: '45%',
                                position: 'relative',
                                margin: dimensions.width * 0.016,
                                overflow: 'hidden', // Ensure the border radius is applied to the image
                                zIndex: 500,
                            }}
                        >
                            <Image
                                source={item.image}
                                style={{
                                    width: '100%',
                                    height: dimensions.height * 0.2,
                                    borderRadius: dimensions.width * 0.1,
                                }}
                                resizeMode="cover" // Change resize mode to cover
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
                                {item.gameMode} mode
                            </Text>
                        </TouchableOpacity>
                    ))}
                    <TouchableOpacity
                        onPress={() => {
                            setIsRulesVisible(true);
                        }}
                        style={{
                            backgroundColor: '#DDB43F',
                            borderRadius: dimensions.width * 0.025,
                            paddingVertical: dimensions.height * 0.016,
                            marginTop: dimensions.height * 0.03,
                            alignSelf: 'center',
                            width: '95%',
                        }}
                    >
                        <Text
                            style={{ fontFamily: fontOpenSansBold, color: 'white', fontSize: dimensions.width * 0.04, textAlign: 'center', fontWeight: 600 }}>
                            Rules
                        </Text>
                    </TouchableOpacity>
                </View>
            ) : isGameStarted ? (
                <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center', }}>

                    <Text
                        style={{
                            fontFamily: fontOpenSansBold,
                            fontSize: dimensions.width * 0.055,
                            color: 'white',
                            paddingHorizontal: dimensions.width * 0.021,
                            marginTop: dimensions.height * 0.02,
                            fontWeight: '700',
                        }}
                    >
                        {timer.toFixed(3)}
                    </Text>
                    <View style={{
                        width: '100%',

                        marginBottom: dimensions.height * 0.25,
                        flexWrap: 'wrap',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'flex-start',
                    }}>

                        {[1, 2, 3, 4, 5, 6].map((item, index) => (
                            <TouchableOpacity
                                key={index}
                                onPress={() => handlePress(item)}

                                style={{
                                    alignSelf: 'center',
                                    width: '45%',
                                    position: 'relative',
                                    margin: dimensions.width * 0.016,
                                    overflow: 'hidden', // Ensure the border radius is applied to the image
                                    zIndex: 500,
                                }}
                            >
                                {carrotPosition === item && (
                                    <Image
                                        source={require('../assets/icons/carrotBigIcon.png')}
                                        style={{
                                            width: '100%',
                                            height: dimensions.height * 0.07,
                                            borderRadius: dimensions.width * 0.1,
                                            marginTop: dimensions.height * 0.06,
                                            position: 'absolute',
                                            zIndex: 1000,
                                            right: dimensions.width * 0.012,
                                        }}
                                        resizeMode="contain"
                                    />
                                )}
                                <Image
                                    source={require('../assets/images/pitImage.png')}
                                    style={{
                                        width: '100%',
                                        height: dimensions.height * 0.12,
                                        borderRadius: dimensions.width * 0.1,
                                        marginTop: dimensions.height * 0.06,
                                    }}
                                    resizeMode="stretch" // Change resize mode to cover
                                />
                            </TouchableOpacity>
                        ))}
                    </View>
                    <Modal
                        transparent={true}
                        visible={gameOver}
                        animationType="slide"
                        onRequestClose={() => setGameOver(false)}
                    >
                        <View style={styles.modalContainer}>
                            <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', }}>
                                <Text
                                    style={{
                                        fontFamily: fontOpenSansBold,
                                        fontSize: dimensions.width * 0.07,
                                        color: 'white',
                                        paddingHorizontal: dimensions.width * 0.021,
                                        paddingVertical: dimensions.height * 0.001,
                                        marginTop: dimensions.height * 0.01,
                                        fontWeight: '700',
                                    }}
                                >
                                    {gameCarrots > 0 ? 'Congratulations!' : 'Game over'}
                                </Text>
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
                                        + {gameCarrots}
                                    </Text>
                                    <Image
                                        source={require('../assets/icons/carrotBigIcon.png')}
                                        style={{
                                            width: dimensions.height * 0.046,
                                            height: dimensions.height * 0.046,
                                            marginLeft: dimensions.width * 0.02,
                                        }}
                                        resizeMode='contain'
                                    />

                                </View>
                                <TouchableOpacity
                                    onPress={() => {
                                        setGameOver(false);
                                        timerRef.current = 0;
                                        setTimer(0);
                                        generateCarrotPosition();
                                        startTimer();
                                        setGameCarrots(0);
                                    }}
                                    style={{
                                        backgroundColor: '#DDB43F',
                                        borderRadius: dimensions.width * 0.025,
                                        paddingVertical: dimensions.height * 0.016,
                                        marginTop: dimensions.height * 0.03,
                                        alignSelf: 'center',
                                        width: '91%',
                                    }}
                                >
                                    <Text
                                        style={{ fontFamily: fontOpenSansBold, color: 'white', fontSize: dimensions.width * 0.04, textAlign: 'center', fontWeight: 600 }}>
                                        Try again
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => {
                                        setGameOver(false);
                                        timerRef.current = 0;
                                        setTimer(0);
                                        setGameOver(false);
                                        setTimeout(() => {

                                            setThisSelectedScreen('Home');
                                        }, 500)

                                    }}
                                    style={{
                                        backgroundColor: '#DDB43F',
                                        borderRadius: dimensions.width * 0.025,
                                        paddingVertical: dimensions.height * 0.016,
                                        marginTop: dimensions.height * 0.01,
                                        alignSelf: 'center',
                                        width: '91%',
                                    }}
                                >
                                    <Text
                                        style={{ fontFamily: fontOpenSansBold, color: 'white', fontSize: dimensions.width * 0.04, textAlign: 'center', fontWeight: 600 }}>
                                        Back to menu
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                </View>
            ) : (
                <View style={{
                    width: '100%',
                    marginTop: dimensions.height * 0.02,
                    paddingHorizontal: dimensions.width * 0.025,
                }}>
                    <Text
                        style={{
                            fontFamily: fontOpenSansBold,
                            fontSize: dimensions.width * 0.055,
                            color: 'white',
                            paddingHorizontal: dimensions.width * 0.021,
                            paddingVertical: dimensions.height * 0.001,
                            marginTop: dimensions.height * 0.01,
                            fontWeight: '700',
                        }}
                    >
                        Rules of the game
                    </Text>
                    <Image
                        source={require('../assets/icons/carrotBigIcon.png')}
                        style={{
                            width: dimensions.height * 0.14,
                            height: dimensions.height * 0.14,
                            marginTop: dimensions.height * 0.01,
                        }}
                        resizeMode="cover" // Change resize mode to cover
                    />
                    <Text
                        style={{
                            fontFamily: fontOpenSansBold,
                            fontSize: dimensions.width * 0.037,
                            color: 'white',
                            paddingHorizontal: dimensions.width * 0.021,
                            paddingVertical: dimensions.height * 0.001,
                            marginTop: dimensions.height * 0.01,
                            fontWeight: 500,
                        }}
                    >
                        In the game you need to catch carrots at speed. On different difficulty levels you are given different amount of time to catch carrots.
                        {'\n\n'}
                        Easy
                        Up to 2 seconds
                        {'\n\n'}
                        Medium
                        Up to 1 second
                        {'\n\n'}
                        Hard
                        Up to 0.8 seconds
                        {'\n\n'}
                        Collect as many carrots as you can in a certain amount.
                    </Text>
                </View>
            )}










        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    modalText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    modalButton: {
        backgroundColor: '#DDB43F',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    modalButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default CarrotScreen;
