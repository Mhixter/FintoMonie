import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Button } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { setFirstLaunch } from '../store/slices/authSlice';
import { colors } from '../styles/theme';

const { width, height } = Dimensions.get('window');

const onboardingData = [
  {
    id: 1,
    title: 'Welcome to FintoMonie',
    description: 'Your trusted digital banking partner for all your financial needs.',
    image: '🏦',
  },
  {
    id: 2,
    title: 'Send & Receive Money',
    description: 'Transfer money instantly to friends, family, and businesses.',
    image: '💸',
  },
  {
    id: 3,
    title: 'Save & Invest',
    description: 'Grow your wealth with our savings goals and investment options.',
    image: '💰',
  },
  {
    id: 4,
    title: 'Pay Bills',
    description: 'Pay for airtime, data, electricity, and other bills seamlessly.',
    image: '📱',
  },
];

export function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const dispatch = useDispatch();

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      dispatch(setFirstLaunch(false));
    }
  };

  const handleSkip = () => {
    dispatch(setFirstLaunch(false));
  };

  const currentData = onboardingData[currentIndex];

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.emoji}>{currentData.image}</Text>
        <Text style={styles.title}>{currentData.title}</Text>
        <Text style={styles.description}>{currentData.description}</Text>
      </View>

      <View style={styles.pagination}>
        {onboardingData.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index === currentIndex ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        ))}
      </View>

      <View style={styles.buttonContainer}>
        <Button
          mode="outlined"
          onPress={handleSkip}
          style={styles.skipButton}
        >
          Skip
        </Button>
        <Button
          mode="contained"
          onPress={handleNext}
          style={styles.nextButton}
        >
          {currentIndex === onboardingData.length - 1 ? 'Get Started' : 'Next'}
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    paddingVertical: 50,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emoji: {
    fontSize: 80,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.darkGray,
    textAlign: 'center',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: colors.gray,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 30,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: colors.primary,
  },
  inactiveDot: {
    backgroundColor: colors.lightGray,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skipButton: {
    flex: 1,
    marginRight: 10,
  },
  nextButton: {
    flex: 1,
    marginLeft: 10,
  },
});