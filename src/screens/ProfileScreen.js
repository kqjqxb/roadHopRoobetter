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
    TextInput,
    Modal,
    TouchableWithoutFeedback,
    SafeAreaView,
    Linking,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ChevronLeftIcon, CheckIcon, PlusIcon } from 'react-native-heroicons/solid';
import * as ImagePicker from 'react-native-image-picker';
import { add, set } from 'date-fns';
import MapView, { Marker } from 'react-native-maps';
import { is } from 'date-fns/locale';

const fontRobotoBold = 'Roboto-Bold';
const fontOpenSansBold = 'OpenSans-Bold';

const ProfileScreen = ({ setThisSelectedScreen, routes, thisSelectedScreen }) => {
    const [dimensions, setDimensions] = useState(Dimensions.get('window'));
    const [isTextClosed, setIsTextClosed] = useState(true);

    const [image, setImage] = useState(null);
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [email, setEmail] = useState('');
    const [isProfileEditingNow, setIsProfileEditingNow] = useState(false);


    const [storageName, setStorageName] = useState('');
    const [storageSurname, setStorageSurname] = useState('');
    const [storageImage, setStorageImage] = useState(null);
    const [storageDateOfBirth, setStorageDateOfBirth] = useState('');
    const [storageEmail, setStorageEmail] = useState('');


    useEffect(() => {
        const loadUserProfile = async () => {
            try {
                const userProfile = await AsyncStorage.getItem('UserProfile');
                if (userProfile !== null) {
                    const { name, surname, dateOfBirth, email, image } = JSON.parse(userProfile);
                    setStorageName(name);
                    setStorageSurname(surname);
                    setStorageDateOfBirth(dateOfBirth);
                    setStorageEmail(email);
                    setStorageImage(image);
                }
            } catch (error) {
                console.error('Error loading user profile:', error);
            }
        };

        loadUserProfile();
    }, [isProfileEditingNow, thisSelectedScreen]);


    // useEffect(() => {
    //     const clearAsyncStorage = async () => {
    //         try {
    //             await AsyncStorage.clear();
    //             console.log('AsyncStorage cleared');
    //         } catch (error) {
    //             console.error('Error clearing AsyncStorage:', error);
    //         }
    //     };

    //     // Виклик функції для очищення AsyncStorage
    //     clearAsyncStorage();
    // }, [])


    const handleImagePicker = () => {
        ImagePicker.launchImageLibrary({ mediaType: 'photo' }, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else {
                setImage(response.assets[0].uri); // Set the selected image
            }
        });
    };





    const handleDateChange = (text) => {
        // Remove any non-digit characters
        const cleaned = text.replace(/[^0-9]/g, '');

        // Format the cleaned input as dd.mm.yyyy
        let formatted = cleaned;
        if (cleaned.length > 2) {
            formatted = `${cleaned.slice(0, 2)}.${cleaned.slice(2)}`;
        }
        if (cleaned.length > 4) {
            formatted = `${cleaned.slice(0, 2)}.${cleaned.slice(2, 4)}.${cleaned.slice(4, 8)}`;
        }

        // Validate the year
        if (cleaned.length >= 8) {
            const year = parseInt(cleaned.slice(4, 8), 10);
            if (year < 1950 || year > 2024) {
                formatted = `${cleaned.slice(0, 2)}.${cleaned.slice(2, 4)}.`;
            }
        }

        setDateOfBirth(formatted);
    };

    const handleSave = async () => {
        if (email && !email.includes('@')) {
            Alert.alert('Invalid email', 'Email must contain @ symbol');
            return;
        }
    
        try {
            const existingProfile = await AsyncStorage.getItem('UserProfile');
            const userProfile = existingProfile ? JSON.parse(existingProfile) : {};
    
            if (name) userProfile.name = name;
            if (surname) userProfile.surname = surname;
            if (dateOfBirth) userProfile.dateOfBirth = dateOfBirth;
            if (email) userProfile.email = email;
            if (image) userProfile.image = image;
    
            await AsyncStorage.setItem('UserProfile', JSON.stringify(userProfile));
            setIsProfileEditingNow(false);
        } catch (error) {
            console.error('Error saving user profile:', error);
        }
    };




    const handleDeleteImage = () => {
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
                        setImage(null); // Clear the selected image
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
                width: '95%',
                padding: dimensions.width * 0.02,
                backgroundColor: 'rgba(255, 255, 255, 0.09)',
                borderRadius: dimensions.width * 0.05,
                paddingHorizontal: dimensions.width * 0.05,

            }}>
                <TouchableOpacity
                    onPress={() => {
                        if (isProfileEditingNow) {
                            setIsProfileEditingNow(false);
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
                    Edit profile
                </Text>
            </View>


            {!isProfileEditingNow ? (
                <>
                    <Image
                        source={storageImage
                            ? { uri: storageImage }
                            : require('../assets/images/onboardingImage1.png')}
                        style={{
                            width: dimensions.height * 0.19,
                            height: dimensions.height * 0.19,
                            textAlign: 'center',
                            alignSelf: 'center',
                            borderRadius: dimensions.width * 0.5,
                            marginTop: dimensions.height * 0.04,
                        }}
                        resizeMode="stretch"
                    />
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        alignSelf: 'center',
                        width: '100%',
                    }}>
                        <Text
                            style={{
                                fontSize: dimensions.width * 0.061,
                                fontFamily: fontOpenSansBold,
                                color: '#F3F3F3',
                                textAlign: 'center',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 'bold',
                                fontWeight: 800,

                                paddingHorizontal: dimensions.width * 0.005,
                            }}>
                            {storageName ? storageName : 'Name'}
                        </Text>
                        <Text
                            style={{
                                fontSize: dimensions.width * 0.061,
                                fontFamily: fontOpenSansBold,
                                color: '#F3F3F3',
                                textAlign: 'center',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 'bold',
                                fontWeight: 800,

                                paddingHorizontal: dimensions.width * 0.005,
                            }}>
                            {storageSurname ? storageSurname : 'Surname'}
                        </Text>

                    </View>
                    <Text
                        style={{
                            fontSize: dimensions.width * 0.037,
                            fontFamily: fontOpenSansBold,
                            color: '#F3F3F3',
                            textAlign: 'center',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold',
                            fontWeight: 800,
                            opacity: 0.5,

                            paddingHorizontal: 21,
                        }}>
                        {storageEmail ? storageEmail : 'example@gmail.com'}
                    </Text>
                    <Text
                        style={{
                            fontSize: dimensions.width * 0.037,
                            fontFamily: fontOpenSansBold,
                            color: '#F3F3F3',
                            textAlign: 'center',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold',
                            fontWeight: 800,
                            opacity: 0.5,

                            paddingHorizontal: 21,
                        }}>
                        {storageDateOfBirth ? storageDateOfBirth : 'dd.mm.yyyy'}
                    </Text>

                    <TouchableOpacity
                        onPress={() => {
                            setIsProfileEditingNow(true);
                        }}
                        style={{
                            backgroundColor: '#DDB43F',
                            borderRadius: dimensions.width * 0.025,
                            paddingVertical: dimensions.height * 0.019,
                            marginTop: dimensions.height * 0.03,
                            alignSelf: 'center',
                            width: '95%',
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                            paddingHorizontal: dimensions.width * 0.05,
                        }}
                    >
                        <Image
                            source={require('../assets/icons/settingsIcons/editIcon.png')}
                            style={{
                                width: dimensions.width * 0.05,
                                height: dimensions.width * 0.05,
                                marginRight: dimensions.width * 0.03,
                                textAlign: 'center'
                            }}
                            resizeMode="contain"
                        />
                        <Text
                            style={{ fontFamily: fontOpenSansBold, color: 'white', fontSize: dimensions.width * 0.04, textAlign: 'center', fontWeight: 400 }}>
                            Edit profile
                        </Text>

                    </TouchableOpacity>
                    {/* <TouchableOpacity
                        onPress={() => {
                            Linking.openURL('https://www.google.com/');
                        }}
                        style={{
                            backgroundColor: '#DDB43F',
                            borderRadius: dimensions.width * 0.025,
                            paddingVertical: dimensions.height * 0.019,
                            marginTop: dimensions.height * 0.008,
                            alignSelf: 'center',
                            width: '95%',
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                            paddingHorizontal: dimensions.width * 0.05,
                        }}
                    >
                        <Image
                            source={require('../assets/icons/settingsIcons/developerIcon.png')}
                            style={{
                                width: dimensions.width * 0.05,
                                height: dimensions.width * 0.05,
                                marginRight: dimensions.width * 0.03,
                                textAlign: 'center'
                            }}
                            resizeMode="contain"
                        />
                        <Text
                            style={{ fontFamily: fontOpenSansBold, color: 'white', fontSize: dimensions.width * 0.04, textAlign: 'center', fontWeight: 400 }}>
                            Developer Website
                        </Text>
                    </TouchableOpacity> */}
                    <TouchableOpacity
                        onPress={() => {
                            Linking.openURL('https://www.google.com/');
                        }}
                        style={{
                            backgroundColor: '#DDB43F',
                            borderRadius: dimensions.width * 0.025,
                            paddingVertical: dimensions.height * 0.019,
                            marginTop: dimensions.height * 0.008,
                            alignSelf: 'center',
                            width: '95%',
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                            paddingHorizontal: dimensions.width * 0.05,
                        }}
                    >
                        <Image
                            source={require('../assets/icons/settingsIcons/privacyIcon.png')}
                            style={{
                                width: dimensions.width * 0.05,
                                height: dimensions.width * 0.05,
                                marginRight: dimensions.width * 0.03,
                                textAlign: 'center'
                            }}
                            resizeMode="contain"
                        />
                        <Text
                            style={{ fontFamily: fontOpenSansBold, color: 'white', fontSize: dimensions.width * 0.04, textAlign: 'center', fontWeight: 400 }}>
                            Privacy Policy
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            Linking.openURL('https://www.google.com/');
                        }}
                        style={{
                            backgroundColor: '#DDB43F',
                            borderRadius: dimensions.width * 0.025,
                            paddingVertical: dimensions.height * 0.019,
                            marginTop: dimensions.height * 0.008,
                            alignSelf: 'center',
                            width: '95%',
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                            paddingHorizontal: dimensions.width * 0.05,
                        }}
                    >
                        <Image
                            source={require('../assets/icons/settingsIcons/termsIcon.png')}
                            style={{
                                width: dimensions.width * 0.05,
                                height: dimensions.width * 0.05,
                                marginRight: dimensions.width * 0.03,
                                textAlign: 'center'
                            }}
                            resizeMode="contain"
                        />
                        <Text
                            style={{ fontFamily: fontOpenSansBold, color: 'white', fontSize: dimensions.width * 0.04, textAlign: 'center', fontWeight: 400 }}>
                            Terms of Use
                        </Text>
                    </TouchableOpacity>
                </>
            ) : (
                <View style={{
                    width: '100%',
                    alignSelf: 'center',
                    alignItems: 'center',
                }}>
                    {!image ? (

                        <TouchableOpacity
                            onPress={handleImagePicker}
                            style={{
                                alignItems: 'center',
                                marginBottom: dimensions.height * 0.01,
                                alignSelf: 'center',
                                backgroundColor: '#DDB43F',
                                borderRadius: dimensions.width * 0.5,
                                padding: dimensions.height * 0.05,
                                marginTop: dimensions.height * 0.01,

                            }}>
                            <Image
                                source={require('../assets/images/emptyImage.png')}
                                style={{
                                    width: dimensions.height * 0.064,
                                    height: dimensions.height * 0.064,
                                    textAlign: 'center',
                                    alignSelf: 'center',

                                }}
                                resizeMode="stretch"
                            />
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            onPress={handleDeleteImage}
                            style={{
                                marginTop: dimensions.height * 0.001,
                            }}>

                            <Image
                                source={{ uri: image }}
                                style={{
                                    width: dimensions.height * 0.165,
                                    height: dimensions.height * 0.165,
                                    textAlign: 'center',
                                    alignSelf: 'center',
                                    borderRadius: dimensions.width * 0.5,
                                    marginTop: dimensions.height * 0.005,
                                }}
                                resizeMode="stretch"
                            />
                        </TouchableOpacity>

                    )}




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
                        Your Name
                    </Text>
                    <TextInput
                        placeholder="Enter your name"
                        value={name}
                        onChangeText={setName}
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
                        Your surname
                    </Text>
                    <TextInput
                        placeholder="Enter your surname"
                        value={surname}
                        onChangeText={setSurname}
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
                        Date of birth
                    </Text>
                    <TextInput
                        placeholder="Enter your name"
                        value={dateOfBirth}
                        onChangeText={handleDateChange}
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
                        Email
                    </Text>
                    <TextInput
                        placeholder="Enter name"
                        value={email}
                        onChangeText={setEmail}
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


                    <TouchableOpacity
                        onPress={() => {
                            handleSave();
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
                            Save
                        </Text>
                    </TouchableOpacity>
                </View>
            )}



        </SafeAreaView>
    );
};

export default ProfileScreen;
