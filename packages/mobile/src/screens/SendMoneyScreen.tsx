import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, Card, RadioButton } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { transfer } from '../store/slices/walletSlice';
import { RootState, AppDispatch } from '../store';
import { colors } from '../styles/theme';

export function SendMoneyScreen() {
  const [transferType, setTransferType] = useState('wallet');
  const [amount, setAmount] = useState('');
  const [recipientAccount, setRecipientAccount] = useState('');
  const [description, setDescription] = useState('');
  const [pin, setPin] = useState('');

  const { balance, isLoading } = useSelector((state: RootState) => state.wallet);
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();

  const handleSendMoney = async () => {
    if (!amount || !recipientAccount || !description) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const transferAmount = parseFloat(amount);
    if (transferAmount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    if (transferAmount > balance) {
      Alert.alert('Error', 'Insufficient balance');
      return;
    }

    try {
      await dispatch(transfer({
        amount: transferAmount,
        recipientAccountNumber: recipientAccount,
        description,
      })).unwrap();

      Alert.alert(
        'Transfer Successful',
        `₦${transferAmount.toLocaleString()} has been sent successfully`,
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Transfer Failed', 'Please try again');
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
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Button
          mode="text"
          onPress={() => navigation.goBack()}
          textColor={colors.white}
          icon="arrow-left"
        >
          Back
        </Button>
        <Text style={styles.title}>Send Money</Text>
        <View style={{ width: 80 }} />
      </View>

      {/* Balance Card */}
      <Card style={styles.balanceCard}>
        <Card.Content>
          <View style={styles.balanceInfo}>
            <Text style={styles.balanceLabel}>Available Balance</Text>
            <Text style={styles.balanceAmount}>{formatCurrency(balance)}</Text>
          </View>
        </Card.Content>
      </Card>

      {/* Transfer Type Selection */}
      <Card style={styles.formCard}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Transfer To</Text>
          <RadioButton.Group
            onValueChange={newValue => setTransferType(newValue)}
            value={transferType}
          >
            <View style={styles.radioOption}>
              <RadioButton value="wallet" color={colors.primary} />
              <View style={styles.radioContent}>
                <Icon name="account-balance-wallet" size={20} color={colors.primary} />
                <Text style={styles.radioLabel}>FintoMonie Wallet</Text>
              </View>
            </View>
            <View style={styles.radioOption}>
              <RadioButton value="bank" color={colors.primary} />
              <View style={styles.radioContent}>
                <Icon name="account-balance" size={20} color={colors.primary} />
                <Text style={styles.radioLabel}>Bank Account</Text>
              </View>
            </View>
          </RadioButton.Group>
        </Card.Content>
      </Card>

      {/* Transfer Form */}
      <Card style={styles.formCard}>
        <Card.Content>
          <TextInput
            label={transferType === 'wallet' ? 'Recipient Account Number' : 'Account Number'}
            value={recipientAccount}
            onChangeText={setRecipientAccount}
            mode="outlined"
            keyboardType="numeric"
            style={styles.input}
          />

          <TextInput
            label="Amount"
            value={amount}
            onChangeText={setAmount}
            mode="outlined"
            keyboardType="numeric"
            left={<TextInput.Icon icon="currency-ngn" />}
            style={styles.input}
          />

          <TextInput
            label="Description (Optional)"
            value={description}
            onChangeText={setDescription}
            mode="outlined"
            multiline
            numberOfLines={3}
            style={styles.input}
          />

          {/* Amount Quick Select */}
          <View style={styles.quickAmountSection}>
            <Text style={styles.quickAmountLabel}>Quick Amount</Text>
            <View style={styles.quickAmountButtons}>
              {[1000, 2000, 5000, 10000].map((quickAmount) => (
                <Button
                  key={quickAmount}
                  mode="outlined"
                  onPress={() => setAmount(quickAmount.toString())}
                  style={styles.quickAmountButton}
                  compact
                >
                  ₦{quickAmount.toLocaleString()}
                </Button>
              ))}
            </View>
          </View>

          <Button
            mode="contained"
            onPress={handleSendMoney}
            loading={isLoading}
            disabled={isLoading}
            style={styles.sendButton}
            contentStyle={styles.buttonContent}
            icon="send"
          >
            Send Money
          </Button>
        </Card.Content>
      </Card>

      {/* Security Notice */}
      <Card style={styles.securityCard}>
        <Card.Content>
          <View style={styles.securityContent}>
            <Icon name="security" size={20} color={colors.warning} />
            <Text style={styles.securityText}>
              Please verify recipient details before sending money. 
              Transactions cannot be reversed.
            </Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.white,
  },
  balanceCard: {
    margin: 20,
    marginTop: -10,
    borderRadius: 12,
    elevation: 2,
  },
  balanceInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 14,
    color: colors.gray,
  },
  balanceAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.darkGray,
  },
  formCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.darkGray,
    marginBottom: 15,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  radioContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  radioLabel: {
    fontSize: 14,
    marginLeft: 10,
    color: colors.darkGray,
  },
  input: {
    marginBottom: 16,
  },
  quickAmountSection: {
    marginBottom: 20,
  },
  quickAmountLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.darkGray,
    marginBottom: 10,
  },
  quickAmountButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  quickAmountButton: {
    minWidth: 80,
  },
  sendButton: {
    borderRadius: 8,
  },
  buttonContent: {
    height: 50,
  },
  securityCard: {
    marginHorizontal: 20,
    marginBottom: 40,
    borderRadius: 12,
    elevation: 2,
    backgroundColor: colors.warning + '08',
    borderColor: colors.warning + '30',
    borderWidth: 1,
  },
  securityContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  securityText: {
    marginLeft: 10,
    fontSize: 12,
    color: colors.darkGray,
    flex: 1,
    lineHeight: 18,
  },
});