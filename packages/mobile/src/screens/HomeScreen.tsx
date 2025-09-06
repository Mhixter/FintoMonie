import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Card, Button, Avatar, FAB } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getWalletBalance } from '../store/slices/walletSlice';
import { getTransactions } from '../store/slices/transactionSlice';
import { RootState, AppDispatch } from '../store';
import { colors } from '../styles/theme';

export function HomeScreen() {
  const { user } = useSelector((state: RootState) => state.auth);
  const { balance } = useSelector((state: RootState) => state.wallet);
  const { transactions } = useSelector((state: RootState) => state.transactions);
  
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();

  useEffect(() => {
    dispatch(getWalletBalance());
    dispatch(getTransactions({ page: 1, limit: 5 }));
  }, [dispatch]);

  const quickActions = [
    { id: 1, title: 'Send Money', icon: 'send', screen: 'SendMoney', color: colors.primary },
    { id: 2, title: 'Pay Bills', icon: 'receipt', action: () => Alert.alert('Coming Soon', 'Bill payment feature coming soon!'), color: colors.success },
    { id: 3, title: 'Airtime', icon: 'phone', action: () => Alert.alert('Coming Soon', 'Airtime purchase coming soon!'), color: colors.accent },
    { id: 4, title: 'Loans', icon: 'account-balance', screen: 'Loans', color: colors.secondary },
  ];

  const handleQuickAction = (action: any) => {
    if (action.screen) {
      navigation.navigate(action.screen as never);
    } else if (action.action) {
      action.action();
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Avatar.Text size={50} label={user?.firstName?.charAt(0) || 'U'} />
          <View style={styles.greeting}>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={styles.userName}>{user?.firstName}</Text>
          </View>
        </View>
        <TouchableOpacity>
          <Icon name="notifications" size={24} color={colors.white} />
        </TouchableOpacity>
      </View>

      {/* Wallet Balance Card */}
      <Card style={styles.balanceCard}>
        <Card.Content>
          <View style={styles.balanceHeader}>
            <Text style={styles.balanceLabel}>Wallet Balance</Text>
            <TouchableOpacity>
              <Icon name="visibility" size={20} color={colors.gray} />
            </TouchableOpacity>
          </View>
          <Text style={styles.balanceAmount}>{formatCurrency(balance)}</Text>
          <View style={styles.balanceActions}>
            <Button
              mode="contained"
              onPress={() => Alert.alert('Coming Soon', 'Fund wallet feature coming soon!')}
              style={styles.fundButton}
              compact
            >
              Fund Wallet
            </Button>
            <Button
              mode="outlined"
              onPress={() => Alert.alert('Coming Soon', 'Withdraw feature coming soon!')}
              style={styles.withdrawButton}
              compact
            >
              Withdraw
            </Button>
          </View>
        </Card.Content>
      </Card>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={styles.quickActionItem}
              onPress={() => handleQuickAction(action)}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: `${action.color}15` }]}>
                <Icon name={action.icon} size={24} color={action.color} />
              </View>
              <Text style={styles.quickActionText}>{action.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Recent Transactions */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <Button
            mode="text"
            onPress={() => navigation.navigate('Transactions' as never)}
            compact
          >
            View All
          </Button>
        </View>
        
        {transactions.length > 0 ? (
          transactions.slice(0, 5).map((transaction) => (
            <Card key={transaction.id} style={styles.transactionCard}>
              <Card.Content style={styles.transactionContent}>
                <View style={styles.transactionLeft}>
                  <View style={[
                    styles.transactionIcon,
                    { backgroundColor: transaction.type === 'credit' ? colors.success + '15' : colors.error + '15' }
                  ]}>
                    <Icon
                      name={transaction.type === 'credit' ? 'arrow-downward' : 'arrow-upward'}
                      size={20}
                      color={transaction.type === 'credit' ? colors.success : colors.error}
                    />
                  </View>
                  <View>
                    <Text style={styles.transactionDescription}>{transaction.description}</Text>
                    <Text style={styles.transactionDate}>
                      {new Date(transaction.createdAt).toLocaleDateString()}
                    </Text>
                  </View>
                </View>
                <Text style={[
                  styles.transactionAmount,
                  { color: transaction.type === 'credit' ? colors.success : colors.error }
                ]}>
                  {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                </Text>
              </Card.Content>
            </Card>
          ))
        ) : (
          <Card style={styles.emptyCard}>
            <Card.Content style={styles.emptyContent}>
              <Icon name="receipt-long" size={48} color={colors.gray} />
              <Text style={styles.emptyText}>No transactions yet</Text>
              <Text style={styles.emptySubtext}>Start by funding your wallet or sending money</Text>
            </Card.Content>
          </Card>
        )}
      </View>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('SendMoney' as never)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 30,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greeting: {
    marginLeft: 15,
  },
  welcomeText: {
    color: colors.white,
    fontSize: 14,
    opacity: 0.9,
  },
  userName: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  balanceCard: {
    margin: 20,
    marginTop: 0,
    borderRadius: 16,
    elevation: 4,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  balanceLabel: {
    fontSize: 14,
    color: colors.gray,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.darkGray,
    marginBottom: 20,
  },
  balanceActions: {
    flexDirection: 'row',
    gap: 10,
  },
  fundButton: {
    flex: 1,
    borderRadius: 8,
  },
  withdrawButton: {
    flex: 1,
    borderRadius: 8,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.darkGray,
    marginBottom: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionItem: {
    width: '48%',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 15,
    elevation: 2,
  },
  quickActionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.darkGray,
  },
  transactionCard: {
    marginBottom: 10,
    borderRadius: 12,
    elevation: 1,
  },
  transactionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  transactionDescription: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.darkGray,
  },
  transactionDate: {
    fontSize: 12,
    color: colors.gray,
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyCard: {
    borderRadius: 12,
    elevation: 1,
  },
  emptyContent: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.darkGray,
    marginTop: 15,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.gray,
    marginTop: 5,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 80,
    backgroundColor: colors.primary,
  },
});