import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card, Button } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getWalletBalance } from '../store/slices/walletSlice';
import { RootState, AppDispatch } from '../store';
import { colors } from '../styles/theme';

export function WalletScreen() {
  const { balance, isLoading } = useSelector((state: RootState) => state.wallet);
  const { user } = useSelector((state: RootState) => state.auth);
  
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(getWalletBalance());
  }, [dispatch]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const walletActions = [
    { id: 1, title: 'Fund Wallet', icon: 'add', color: colors.success },
    { id: 2, title: 'Withdraw', icon: 'remove', color: colors.error },
    { id: 3, title: 'Transfer', icon: 'send', color: colors.primary },
    { id: 4, title: 'Request', icon: 'request-page', color: colors.accent },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Wallet</Text>
      </View>

      {/* Balance Card */}
      <Card style={styles.balanceCard}>
        <Card.Content>
          <View style={styles.balanceSection}>
            <Text style={styles.balanceLabel}>Available Balance</Text>
            <Text style={styles.balanceAmount}>{formatCurrency(balance)}</Text>
            <Text style={styles.accountInfo}>
              Account: {user?.wallet?.accountNumber || 'N/A'}
            </Text>
          </View>
        </Card.Content>
      </Card>

      {/* Quick Actions */}
      <View style={styles.actionsSection}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          {walletActions.map((action) => (
            <Card key={action.id} style={styles.actionCard}>
              <Card.Content style={styles.actionContent}>
                <View style={[styles.actionIcon, { backgroundColor: `${action.color}15` }]}>
                  <Icon name={action.icon} size={24} color={action.color} />
                </View>
                <Text style={styles.actionTitle}>{action.title}</Text>
              </Card.Content>
            </Card>
          ))}
        </View>
      </View>

      {/* Wallet Stats */}
      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>Wallet Statistics</Text>
        
        <Card style={styles.statsCard}>
          <Card.Content>
            <View style={styles.statRow}>
              <View style={styles.statItem}>
                <Icon name="trending-up" size={20} color={colors.success} />
                <Text style={styles.statLabel}>Total Received</Text>
                <Text style={styles.statValue}>₦0.00</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Icon name="trending-down" size={20} color={colors.error} />
                <Text style={styles.statLabel}>Total Sent</Text>
                <Text style={styles.statValue}>₦0.00</Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      </View>

      {/* Security Notice */}
      <Card style={styles.securityCard}>
        <Card.Content>
          <View style={styles.securityContent}>
            <Icon name="security" size={24} color={colors.success} />
            <View style={styles.securityText}>
              <Text style={styles.securityTitle}>Your wallet is secure</Text>
              <Text style={styles.securitySubtitle}>
                All transactions are protected with bank-level security
              </Text>
            </View>
          </View>
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
  balanceCard: {
    margin: 20,
    marginTop: -10,
    borderRadius: 16,
    elevation: 4,
  },
  balanceSection: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  balanceLabel: {
    fontSize: 14,
    color: colors.gray,
    marginBottom: 10,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.darkGray,
    marginBottom: 10,
  },
  accountInfo: {
    fontSize: 14,
    color: colors.gray,
  },
  actionsSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.darkGray,
    marginBottom: 15,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '48%',
    marginBottom: 15,
    borderRadius: 12,
    elevation: 2,
  },
  actionContent: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  actionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.darkGray,
  },
  statsSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  statsCard: {
    borderRadius: 12,
    elevation: 2,
  },
  statRow: {
    flexDirection: 'row',
    paddingVertical: 10,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.lightGray,
    marginHorizontal: 20,
  },
  statLabel: {
    fontSize: 12,
    color: colors.gray,
    marginTop: 5,
    marginBottom: 5,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.darkGray,
  },
  securityCard: {
    margin: 20,
    borderRadius: 12,
    elevation: 2,
    backgroundColor: colors.success + '08',
    borderColor: colors.success + '30',
    borderWidth: 1,
  },
  securityContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  securityText: {
    marginLeft: 15,
    flex: 1,
  },
  securityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.darkGray,
    marginBottom: 5,
  },
  securitySubtitle: {
    fontSize: 14,
    color: colors.gray,
  },
});