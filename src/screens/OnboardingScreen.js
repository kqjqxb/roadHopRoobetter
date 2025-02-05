import React, { useEffect, useRef, useState } from 'react';
import { View, FlatList, Animated, Text, TouchableOpacity, ImageBackground, Dimensions, Image, Platform } from 'react-native';
import { styled } from 'nativewind';
import verdeOnboardingData from '../components/roobetOnboardingDataFile';
import { useNavigation } from '@react-navigation/native';

const StyledView = styled(View);

const fontOpenSansBold = 'OpenSans-Bold';
const fontOpenSansRegular = 'OpenSans-Regular';

const OnboardingScreen = () => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const navigation = useNavigation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef(null);

  useEffect(() => {
    const onChange = ({ window }) => {
      setDimensions(window);
    };

    const dimensionListener = Dimensions.addEventListener('change', onChange);

    return () => {
      dimensionListener.remove();
    };
  }, []);

  const scrollToTheNextOnboard = () => {
    if (currentIndex < verdeOnboardingData.length - 1) {
      slidesRef.current.scrollToIndex({ index: currentIndex + 1 });
    } else {
      navigation.navigate('Home');
    }
  };



  const viewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems && viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  

  const renderItem = ({ item }) => (
    <View style={{ width: dimensions.width, flex: 1, justifyContent: 'flex-start', alignItems: 'center' }} >
      <Image
        resizeMode="stretch"
        source={item.image}
        style={{
          marginBottom: 16,
          height: '55%',
          width: '100%',
        }}
      />
      <View style={{
        alignItems: 'center',
        position: 'absolute',
        bottom: 0,
        height: '45%',
        zIndex: 0,
        width: '100%',
        alignSelf: 'center',
        backgroundColor: '#090c1d',

      }}>
        <Text
          style={{
            fontFamily: fontOpenSansBold,
            paddingHorizontal: 21,
            marginTop: 21,
            maxWidth: '70%',
            textAlign: 'left',
            color: '#DDB43F',
            fontWeight: 'bold',
            fontSize: dimensions.width * 0.061,
            marginTop: dimensions.height * 0.05,
            alignSelf: 'flex-start',
          }}>
          {item.title}
        </Text>
        <Text
          style={{
            fontSize: dimensions.width < 400 ? dimensions.width * 0.04 : dimensions.width * 0.045,
            marginTop: 8,
            fontFamily: fontOpenSansRegular,
            paddingHorizontal: 21,
            textAlign: 'left',
            color: 'white',
          }}>
          {item.description}
        </Text>
      </View>
    </View>
  );

  return (
    <StyledView
      style={{ justifyContent: 'space-between', flex: 1, backgroundColor: '#212121', alignItems: 'center', }}
    >
      <StyledView style={{ display: 'flex' }}>
        <FlatList
          data={verdeOnboardingData}
          renderItem={renderItem}
          horizontal
          bounces={false}
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
            useNativeDriver: false,
          })}
          onViewableItemsChanged={viewableItemsChanged}
          viewabilityConfig={viewConfig}
          scrollEventThrottle={32}
          ref={slidesRef}
        />
      </StyledView>

      <TouchableOpacity
        onPress={() => {
          if (currentIndex === verdeOnboardingData.length - 1) {
            navigation.navigate('Home');
          } else scrollToTheNextOnboard();
        }}
        style={{
          bottom: '10%',
          backgroundColor: '#DDB43F',
          borderRadius: dimensions.width * 0.04,
          paddingVertical: dimensions.height * 0.016,
          marginBottom: 40,
          alignSelf: 'center',
          width: '88%',
        }}
      >
        <Text
          style={{ 
            fontFamily: fontOpenSansBold, 
            color: 'white', 
            fontSize: dimensions.width * 0.04, 
            textAlign: 'center', 
            fontWeight: 600 
          }}>
          {currentIndex === verdeOnboardingData.length - 1 ? 'Start' : 'Next'}
        </Text>
      </TouchableOpacity>

    </StyledView>
  );
};

export default OnboardingScreen;
