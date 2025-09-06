import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, Card } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { register } from '../store/slices/authSlice';
import { RootState, AppDispatch } from '../store';
import { colors } from '../styles/theme';

export function RegisterScreen() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const { isLoading } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();

  const handleRegister = async () => {
    const { firstName, lastName, email, phoneNumber, password, confirmPassword } = formData;

    if (!firstName || !lastName || !email || !phoneNumber || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters long');
      return;
    }

    try {
      await dispatch(register({
        firstName,
        lastName,
        email,
        phoneNumber,
        password,
      })).unwrap();
    } catch (err) {
      Alert.alert('Registration Failed', 'Please try again');
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.logo}>FintoMonie</Text>
        <Text style={styles.subtitle}>Create your account</Text>
      </View>

      <Card style={styles.formCard}>
        <Card.Content>
          <View style={styles.nameContainer}>
            <TextInput
              label="First Name"
              value={formData.firstName}
              onChangeText={(text) => updateFormData('firstName', text)}
              mode="outlined"
              style={[styles.input, styles.halfInput, { marginRight: 8 }]}
            />
            <TextInput
              label="Last Name"
              value={formData.lastName}
              onChangeText={(text) => updateFormData('lastName', text)}
              mode="outlined"
              style={[styles.input, styles.halfInput, { marginLeft: 8 }]}
            />
          </View>

          <TextInput
            label="Email"
            value={formData.email}
            onChangeText={(text) => updateFormData('email', text)}
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />

          <TextInput
            label="Phone Number"
            value={formData.phoneNumber}
            onChangeText={(text) => updateFormData('phoneNumber', text)}
            mode="outlined"
            keyboardType="phone-pad"
            style={styles.input}
          />

          <TextInput
            label="Password"
            value={formData.password}
            onChangeText={(text) => updateFormData('password', text)}
            mode="outlined"
            secureTextEntry={!showPassword}
            right={
              <TextInput.Icon
                icon={showPassword ? 'eye-off' : 'eye'}
                onPress={() => setShowPassword(!showPassword)}
              />
            }
            style={styles.input}
          />

          <TextInput
            label="Confirm Password"
            value={formData.confirmPassword}
            onChangeText={(text) => updateFormData('confirmPassword', text)}
            mode="outlined"
            secureTextEntry={!showPassword}
            style={styles.input}
          />

          <Button
            mode="contained"
            onPress={handleRegister}
            loading={isLoading}
            disabled={isLoading}
            style={styles.registerButton}
            contentStyle={styles.buttonContent}
          >
            Create Account
          </Button>

          <View style={styles.linkContainer}>
            <Button
              mode="text"
              onPress={() => navigation.navigate('Login' as never)}
            >
              Already have an account? Login
            </Button>
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: colors.white,
    opacity: 0.9,
  },
  formCard: {
    borderRadius: 16,
    elevation: 4,
  },
  nameContainer: {
    flexDirection: 'row',
    marginBottom: 0,
  },
  input: {
    marginBottom: 16,
  },
  halfInput: {
    flex: 1,
  },
  registerButton: {
    marginTop: 20,
    borderRadius: 8,
  },
  buttonContent: {
    height: 50,
  },
  linkContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
});