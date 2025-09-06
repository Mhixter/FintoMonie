import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Card, Chip, SearchBar } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getTransactions } from '../store/slices/transactionSlice';
import { RootState, AppDispatch } from '../store';
import { colors } from '../styles/theme';
import { Transaction, TransactionType } from '@fintomonie/shared';

export function TransactionsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  const { transactions, isLoading } = useSelector((state: RootState) => state.transactions);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(getTransactions());
  }, [dispatch]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    dispatch(getTransactions()).finally(() => setRefreshing(false));
  }, [dispatch]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getTransactionIcon = (type: TransactionType) => {
    switch (type) {
      case TransactionType.CREDIT:
        return 'arrow-downward';
      case TransactionType.DEBIT:
        return 'arrow-upward';
      case TransactionType.TRANSFER:
        return 'swap-horiz';
      default:
        return 'receipt';
    }
  };

  const getTransactionColor = (type: TransactionType) => {
    switch (type) {
      case TransactionType.CREDIT:
        return colors.success;
      case TransactionType.DEBIT:
        return colors.error;
      case TransactionType.TRANSFER:
        return colors.primary;
      default:
        return colors.gray;
    }
  };

  const filters = [
    { key: 'all', label: 'All' },
    { key: 'credit', label: 'Credit' },
    { key: 'debit', label: 'Debit' },
    { key: 'transfer', label: 'Transfer' },
  ];

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         transaction.reference.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || transaction.type === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const groupTransactionsByDate = (transactions: Transaction[]) => {
    const groups: { [key: string]: Transaction[] } = {};
    
    transactions.forEach(transaction => {
      const date = new Date(transaction.createdAt).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(transaction);
    });
    
    return groups;
  };

  const groupedTransactions = groupTransactionsByDate(filteredTransactions);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Transactions</Text>
      </View>

      <View style={styles.searchSection}>
        <SearchBar
          placeholder="Search transactions..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersContainer}
        contentContainerStyle={styles.filtersContent}
      >
        {filters.map((filter) => (
          <Chip
            key={filter.key}
            selected={selectedFilter === filter.key}
            onPress={() => setSelectedFilter(filter.key)}
            style={[
              styles.filterChip,
              selectedFilter === filter.key && styles.selectedFilterChip
            ]}
            textStyle={[
              styles.filterChipText,
              selectedFilter === filter.key && styles.selectedFilterChipText
            ]}
          >
            {filter.label}
          </Chip>
        ))}
      </ScrollView>

      <ScrollView
        style={styles.transactionsList}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {Object.keys(groupedTransactions).length > 0 ? (
          Object.keys(groupedTransactions).map(date => (
            <View key={date} style={styles.dateGroup}>
              <Text style={styles.dateHeader}>
                {new Date(date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </Text>
              
              {groupedTransactions[date].map((transaction) => (
                <Card key={transaction.id} style={styles.transactionCard}>
                  <Card.Content style={styles.transactionContent}>
                    <View style={styles.transactionLeft}>
                      <View style={[
                        styles.transactionIcon,
                        { backgroundColor: getTransactionColor(transaction.type) + '15' }
                      ]}>
                        <Icon
                          name={getTransactionIcon(transaction.type)}
                          size={20}
                          color={getTransactionColor(transaction.type)}
                        />
                      </View>
                      <View style={styles.transactionDetails}>
                        <Text style={styles.transactionDescription}>
                          {transaction.description}
                        </Text>
                        <Text style={styles.transactionReference}>
                          {transaction.reference}
                        </Text>
                        <Text style={styles.transactionTime}>
                          {new Date(transaction.createdAt).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </Text>
                      </View>
                    </View>
                    
                    <View style={styles.transactionRight}>
                      <Text style={[
                        styles.transactionAmount,
                        { color: getTransactionColor(transaction.type) }
                      ]}>
                        {transaction.type === TransactionType.CREDIT ? '+' : '-'}
                        {formatCurrency(transaction.amount)}
                      </Text>
                      <View style={[
                        styles.statusBadge,
                        {
                          backgroundColor: transaction.status === 'success' 
                            ? colors.success + '15' 
                            : colors.warning + '15'
                        }
                      ]}>
                        <Text style={[
                          styles.statusText,
                          {
                            color: transaction.status === 'success' 
                              ? colors.success 
                              : colors.warning
                          }
                        ]}>
                          {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                        </Text>
                      </View>
                    </View>
                  </Card.Content>
                </Card>
              ))}
            </View>
          ))
        ) : (
          <Card style={styles.emptyCard}>
            <Card.Content style={styles.emptyContent}>
              <Icon name="receipt-long" size={48} color={colors.gray} />
              <Text style={styles.emptyText}>No transactions found</Text>
              <Text style={styles.emptySubtext}>
                {searchQuery || selectedFilter !== 'all'
                  ? 'Try adjusting your search or filter'
                  : 'Start by funding your wallet or sending money'
                }
              </Text>
            </Card.Content>
          </Card>
        )}
      </ScrollView>
    </View>
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
  searchSection: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: colors.white,
    elevation: 2,
  },
  searchBar: {
    elevation: 0,
    backgroundColor: colors.lightGray,
  },
  filtersContainer: {
    backgroundColor: colors.white,
    paddingBottom: 10,
  },
  filtersContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  filterChip: {
    marginRight: 10,
    backgroundColor: colors.lightGray,
  },
  selectedFilterChip: {
    backgroundColor: colors.primary,
  },
  filterChipText: {
    color: colors.darkGray,
  },
  selectedFilterChipText: {
    color: colors.white,
  },
  transactionsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  dateGroup: {
    marginVertical: 10,
  },
  dateHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.darkGray,
    marginBottom: 10,
    paddingHorizontal: 5,
  },
  transactionCard: {
    marginBottom: 8,
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
  transactionDetails: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.darkGray,
    marginBottom: 2,
  },
  transactionReference: {
    fontSize: 12,
    color: colors.gray,
    marginBottom: 2,
  },
  transactionTime: {
    fontSize: 12,
    color: colors.gray,
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '500',
  },
  emptyCard: {
    marginTop: 50,
    borderRadius: 12,
    elevation: 1,
  },
  emptyContent: {
    alignItems: 'center',
    paddingVertical: 40,
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
    paddingHorizontal: 20,
  },
});