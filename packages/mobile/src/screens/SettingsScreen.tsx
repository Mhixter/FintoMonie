import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Card, List, Switch, Avatar } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { RootState } from '../store';
import { colors } from '../styles/theme';

export function SettingsScreen() {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  
  const [biometricEnabled, setBiometricEnabled] = React.useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = React.useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: () => dispatch(logout()) }
      ]
    );
  };

  const showComingSoon = (feature: string) => {
    Alert.alert('Coming Soon', `${feature} feature will be available in a future update.`);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      {/* Profile Section */}
      <Card style={styles.profileCard}>
        <Card.Content>
          <View style={styles.profileContent}>
            <Avatar.Text 
              size={60} 
              label={user?.firstName?.charAt(0) || 'U'} 
              style={styles.avatar}
            />
            <View style={styles.profileInfo}>
              <Text style={styles.userName}>
                {user?.firstName} {user?.lastName}
              </Text>
              <Text style={styles.userEmail}>{user?.email}</Text>
              <Text style={styles.kycStatus}>
                KYC Status: {user?.kycStatus?.toUpperCase()}
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Account Settings */}
      <Card style={styles.settingsCard}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <List.Item
            title="Personal Information"
            description="Update your profile details"
            left={props => <List.Icon {...props} icon="account-edit" color={colors.primary} />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => showComingSoon('Profile editing')}
          />
          
          <List.Item
            title="KYC Verification"
            description="Complete your identity verification"
            left={props => <List.Icon {...props} icon="shield-check" color={colors.success} />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => showComingSoon('KYC verification')}
          />
          
          <List.Item
            title="Change Password"
            description="Update your account password"
            left={props => <List.Icon {...props} icon="lock" color={colors.accent} />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => showComingSoon('Password change')}
          />
        </Card.Content>
      </Card>

      {/* Security Settings */}
      <Card style={styles.settingsCard}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Security</Text>
          
          <List.Item
            title="Biometric Login"
            description="Use fingerprint or face ID to login"
            left={props => <List.Icon {...props} icon="fingerprint" color={colors.primary} />}
            right={() => (
              <Switch
                value={biometricEnabled}
                onValueChange={setBiometricEnabled}
                color={colors.primary}
              />
            )}
          />
          
          <List.Item
            title="Two-Factor Authentication"
            description="Add an extra layer of security"
            left={props => <List.Icon {...props} icon="two-factor-authentication" color={colors.success} />}
            right={() => (
              <Switch
                value={twoFactorEnabled}
                onValueChange={setTwoFactorEnabled}
                color={colors.primary}
              />
            )}
          />
        </Card.Content>
      </Card>

      {/* Notifications */}
      <Card style={styles.settingsCard}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Notifications</Text>
          
          <List.Item
            title="Push Notifications"
            description="Receive app notifications"
            left={props => <List.Icon {...props} icon="bell" color={colors.accent} />}
            right={() => (
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                color={colors.primary}
              />
            )}
          />
          
          <List.Item
            title="SMS Notifications"
            description="Receive SMS alerts for transactions"
            left={props => <List.Icon {...props} icon="message" color={colors.secondary} />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => showComingSoon('SMS settings')}
          />
          
          <List.Item
            title="Email Notifications"
            description="Receive email updates"
            left={props => <List.Icon {...props} icon="email" color={colors.primary} />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => showComingSoon('Email settings')}
          />
        </Card.Content>
      </Card>

      {/* Support & Legal */}
      <Card style={styles.settingsCard}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Support & Legal</Text>
          
          <List.Item
            title="Help & Support"
            description="Get help or contact support"
            left={props => <List.Icon {...props} icon="help-circle" color={colors.primary} />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => showComingSoon('Help center')}
          />
          
          <List.Item
            title="Terms & Conditions"
            description="Read our terms and conditions"
            left={props => <List.Icon {...props} icon="file-document" color={colors.gray} />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => showComingSoon('Terms and conditions')}
          />
          
          <List.Item
            title="Privacy Policy"
            description="Learn about our privacy practices"
            left={props => <List.Icon {...props} icon="shield-account" color={colors.gray} />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => showComingSoon('Privacy policy')}
          />
        </Card.Content>
      </Card>

      {/* App Info */}
      <Card style={styles.settingsCard}>
        <Card.Content>
          <Text style={styles.sectionTitle}>App Information</Text>
          
          <List.Item
            title="App Version"
            description="1.0.0"
            left={props => <List.Icon {...props} icon="information" color={colors.gray} />}
          />
          
          <List.Item
            title="About FintoMonie"
            description="Learn more about our platform"
            left={props => <List.Icon {...props} icon="information-outline" color={colors.primary} />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => showComingSoon('About page')}
          />
        </Card.Content>
      </Card>

      {/* Logout */}
      <Card style={[styles.settingsCard, styles.logoutCard]}>
        <Card.Content>
          <List.Item
            title="Logout"
            titleStyle={styles.logoutText}
            left={props => <List.Icon {...props} icon="logout" color={colors.error} />}
            onPress={handleLogout}
          />
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lightGray,
  },
  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.white,
  },
  profileCard: {
    margin: 20,
    marginTop: -10,
    borderRadius: 16,
    elevation: 4,
  },
  profileContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    marginRight: 20,
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.darkGray,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: colors.gray,
    marginBottom: 4,
  },
  kycStatus: {
    fontSize: 12,
    color: colors.accent,
    fontWeight: '500',
  },
  settingsCard: {
    marginHorizontal: 20,
    marginBottom: 15,
    borderRadius: 12,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.darkGray,
    marginBottom: 10,
    paddingHorizontal: 16,
  },
  logoutCard: {
    marginBottom: 40,
    borderColor: colors.error + '30',
    borderWidth: 1,
  },
  logoutText: {
    color: colors.error,
    fontWeight: '600',
  },
});