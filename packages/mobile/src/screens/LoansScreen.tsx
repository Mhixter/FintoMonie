import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Card, Button, TextInput, RadioButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../styles/theme';

export function LoansScreen() {
  const [loanAmount, setLoanAmount] = useState('');
  const [loanPurpose, setLoanPurpose] = useState('');
  const [loanDuration, setLoanDuration] = useState('6');
  
  const navigation = useNavigation();

  const calculateLoanDetails = (amount: number, duration: number) => {
    const interestRate = 0.15; // 15% per annum
    const monthlyRate = interestRate / 12;
    const monthlyPayment = (amount * monthlyRate * Math.pow(1 + monthlyRate, duration)) / 
                          (Math.pow(1 + monthlyRate, duration) - 1);
    const totalPayment = monthlyPayment * duration;
    
    return {
      monthlyPayment: Math.round(monthlyPayment),
      totalPayment: Math.round(totalPayment),
      totalInterest: Math.round(totalPayment - amount)
    };
  };

  const handleApplyLoan = () => {
    if (!loanAmount || !loanPurpose) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const amount = parseFloat(loanAmount);
    if (amount < 50000 || amount > 5000000) {
      Alert.alert('Error', 'Loan amount must be between ₦50,000 and ₦5,000,000');
      return;
    }

    Alert.alert(
      'Apply for Loan',
      'Are you sure you want to apply for this loan? Your application will be reviewed within 24 hours.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Apply', onPress: () => {
          Alert.alert('Application Submitted', 'Your loan application has been submitted successfully!');
          navigation.goBack();
        }}
      ]
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const loanDetails = loanAmount ? 
    calculateLoanDetails(parseFloat(loanAmount) || 0, parseInt(loanDuration)) : 
    null;

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
        <Text style={styles.title}>Apply for Loan</Text>
        <View style={{ width: 80 }} />
      </View>

      {/* Loan Requirements */}
      <Card style={styles.requirementsCard}>
        <Card.Content>
          <View style={styles.requirementsHeader}>
            <Icon name="info" size={20} color={colors.primary} />
            <Text style={styles.requirementsTitle}>Loan Requirements</Text>
          </View>
          <View style={styles.requirement}>
            <Icon name="check-circle" size={16} color={colors.success} />
            <Text style={styles.requirementText}>Minimum loan amount: ₦50,000</Text>
          </View>
          <View style={styles.requirement}>
            <Icon name="check-circle" size={16} color={colors.success} />
            <Text style={styles.requirementText}>Maximum loan amount: ₦5,000,000</Text>
          </View>
          <View style={styles.requirement}>
            <Icon name="check-circle" size={16} color={colors.success} />
            <Text style={styles.requirementText}>Interest rate: 15% per annum</Text>
          </View>
          <View style={styles.requirement}>
            <Icon name="check-circle" size={16} color={colors.success} />
            <Text style={styles.requirementText}>Repayment period: 3-24 months</Text>
          </View>
        </Card.Content>
      </Card>

      {/* Loan Application Form */}
      <Card style={styles.formCard}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Loan Application</Text>
          
          <TextInput
            label="Loan Amount"
            value={loanAmount}
            onChangeText={setLoanAmount}
            mode="outlined"
            keyboardType="numeric"
            left={<TextInput.Icon icon="currency-ngn" />}
            style={styles.input}
            placeholder="e.g., 100000"
          />

          <TextInput
            label="Purpose of Loan"
            value={loanPurpose}
            onChangeText={setLoanPurpose}
            mode="outlined"
            multiline
            numberOfLines={3}
            style={styles.input}
            placeholder="e.g., Business expansion, Medical expenses"
          />

          <Text style={styles.durationLabel}>Repayment Duration</Text>
          <RadioButton.Group
            onValueChange={newValue => setLoanDuration(newValue)}
            value={loanDuration}
          >
            <View style={styles.durationOptions}>
              {['3', '6', '12', '18', '24'].map((months) => (
                <View key={months} style={styles.durationOption}>
                  <RadioButton value={months} color={colors.primary} />
                  <Text style={styles.durationText}>{months} months</Text>
                </View>
              ))}
            </View>
          </RadioButton.Group>
        </Card.Content>
      </Card>

      {/* Loan Calculation */}
      {loanDetails && (
        <Card style={styles.calculationCard}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Loan Summary</Text>
            
            <View style={styles.calculationRow}>
              <Text style={styles.calculationLabel}>Loan Amount:</Text>
              <Text style={styles.calculationValue}>{formatCurrency(parseFloat(loanAmount))}</Text>
            </View>
            
            <View style={styles.calculationRow}>
              <Text style={styles.calculationLabel}>Duration:</Text>
              <Text style={styles.calculationValue}>{loanDuration} months</Text>
            </View>
            
            <View style={styles.calculationRow}>
              <Text style={styles.calculationLabel}>Monthly Payment:</Text>
              <Text style={[styles.calculationValue, styles.highlightValue]}>
                {formatCurrency(loanDetails.monthlyPayment)}
              </Text>
            </View>
            
            <View style={styles.calculationRow}>
              <Text style={styles.calculationLabel}>Total Interest:</Text>
              <Text style={styles.calculationValue}>{formatCurrency(loanDetails.totalInterest)}</Text>
            </View>
            
            <View style={[styles.calculationRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total Repayment:</Text>
              <Text style={styles.totalValue}>{formatCurrency(loanDetails.totalPayment)}</Text>
            </View>
          </Card.Content>
        </Card>
      )}

      {/* Apply Button */}
      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={handleApplyLoan}
          style={styles.applyButton}
          contentStyle={styles.buttonContent}
          icon="send"
        >
          Apply for Loan
        </Button>
      </View>

      {/* Terms Notice */}
      <Card style={styles.termsCard}>
        <Card.Content>
          <View style={styles.termsContent}>
            <Icon name="gavel" size={20} color={colors.warning} />
            <Text style={styles.termsText}>
              By applying for this loan, you agree to our terms and conditions. 
              Loan approval is subject to credit assessment and verification.
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
  requirementsCard: {
    marginHorizontal: 20,
    marginTop: -10,
    marginBottom: 20,
    borderRadius: 12,
    elevation: 2,
    backgroundColor: colors.primary + '08',
    borderColor: colors.primary + '30',
    borderWidth: 1,
  },
  requirementsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  requirementsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.darkGray,
    marginLeft: 10,
  },
  requirement: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  requirementText: {
    fontSize: 14,
    color: colors.darkGray,
    marginLeft: 10,
  },
  formCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.darkGray,
    marginBottom: 15,
  },
  input: {
    marginBottom: 16,
  },
  durationLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.darkGray,
    marginBottom: 10,
  },
  durationOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  durationOption: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    marginBottom: 10,
  },
  durationText: {
    fontSize: 14,
    color: colors.darkGray,
    marginLeft: 5,
  },
  calculationCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    elevation: 2,
    backgroundColor: colors.success + '08',
    borderColor: colors.success + '30',
    borderWidth: 1,
  },
  calculationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  calculationLabel: {
    fontSize: 14,
    color: colors.darkGray,
  },
  calculationValue: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.darkGray,
  },
  highlightValue: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
    paddingTop: 10,
    marginTop: 5,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.darkGray,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.success,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  applyButton: {
    borderRadius: 8,
  },
  buttonContent: {
    height: 50,
  },
  termsCard: {
    marginHorizontal: 20,
    marginBottom: 40,
    borderRadius: 12,
    elevation: 2,
    backgroundColor: colors.warning + '08',
    borderColor: colors.warning + '30',
    borderWidth: 1,
  },
  termsContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  termsText: {
    marginLeft: 10,
    fontSize: 12,
    color: colors.darkGray,
    flex: 1,
    lineHeight: 18,
  },
});