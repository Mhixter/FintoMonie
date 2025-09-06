import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Card, Button, FAB, Modal, Portal, TextInput } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getSavingsGoals, createSavingsGoal } from '../store/slices/savingsSlice';
import { RootState, AppDispatch } from '../store';
import { colors } from '../styles/theme';

export function SavingsScreen() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    targetAmount: '',
    deadline: '',
  });

  const { goals, isLoading } = useSelector((state: RootState) => state.savings);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(getSavingsGoals());
  }, [dispatch]);

  const handleCreateGoal = async () => {
    if (!newGoal.title || !newGoal.targetAmount || !newGoal.deadline) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      await dispatch(createSavingsGoal({
        title: newGoal.title,
        targetAmount: parseFloat(newGoal.targetAmount),
        deadline: newGoal.deadline,
      })).unwrap();

      setShowCreateModal(false);
      setNewGoal({ title: '', targetAmount: '', deadline: '' });
      Alert.alert('Success', 'Savings goal created successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to create savings goal');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const calculateProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Savings Goals</Text>
      </View>

      {/* Summary Card */}
      <Card style={styles.summaryCard}>
        <Card.Content>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Icon name="savings" size={24} color={colors.primary} />
              <Text style={styles.summaryLabel}>Total Saved</Text>
              <Text style={styles.summaryValue}>
                {formatCurrency(goals.reduce((sum, goal) => sum + goal.currentAmount, 0))}
              </Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Icon name="flag" size={24} color={colors.success} />
              <Text style={styles.summaryLabel}>Active Goals</Text>
              <Text style={styles.summaryValue}>{goals.length}</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <ScrollView style={styles.goalsList}>
        {goals.length > 0 ? (
          goals.map((goal) => {
            const progress = calculateProgress(goal.currentAmount, goal.targetAmount);
            const daysLeft = Math.ceil(
              (new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
            );

            return (
              <Card key={goal.id} style={styles.goalCard}>
                <Card.Content>
                  <View style={styles.goalHeader}>
                    <Text style={styles.goalTitle}>{goal.title}</Text>
                    <Text style={styles.goalProgress}>{progress.toFixed(1)}%</Text>
                  </View>

                  <View style={styles.goalAmounts}>
                    <Text style={styles.goalCurrent}>
                      {formatCurrency(goal.currentAmount)}
                    </Text>
                    <Text style={styles.goalTarget}>
                      of {formatCurrency(goal.targetAmount)}
                    </Text>
                  </View>

                  {/* Progress Bar */}
                  <View style={styles.progressBarContainer}>
                    <View style={styles.progressBar}>
                      <View style={[styles.progressFill, { width: `${progress}%` }]} />
                    </View>
                  </View>

                  <View style={styles.goalFooter}>
                    <Text style={styles.goalDeadline}>
                      {daysLeft > 0 ? `${daysLeft} days left` : 'Goal deadline reached'}
                    </Text>
                    <Button
                      mode="contained"
                      onPress={() => Alert.alert('Coming Soon', 'Fund goal feature coming soon!')}
                      compact
                      style={styles.fundButton}
                    >
                      Fund Goal
                    </Button>
                  </View>
                </Card.Content>
              </Card>
            );
          })
        ) : (
          <Card style={styles.emptyCard}>
            <Card.Content style={styles.emptyContent}>
              <Icon name="savings" size={48} color={colors.gray} />
              <Text style={styles.emptyText}>No savings goals yet</Text>
              <Text style={styles.emptySubtext}>
                Create your first savings goal and start building your future
              </Text>
              <Button
                mode="contained"
                onPress={() => setShowCreateModal(true)}
                style={styles.createFirstButton}
              >
                Create Your First Goal
              </Button>
            </Card.Content>
          </Card>
        )}
      </ScrollView>

      {goals.length > 0 && (
        <FAB
          icon="plus"
          style={styles.fab}
          onPress={() => setShowCreateModal(true)}
        />
      )}

      {/* Create Goal Modal */}
      <Portal>
        <Modal
          visible={showCreateModal}
          onDismiss={() => setShowCreateModal(false)}
          contentContainerStyle={styles.modal}
        >
          <Text style={styles.modalTitle}>Create Savings Goal</Text>
          
          <TextInput
            label="Goal Title"
            value={newGoal.title}
            onChangeText={(text) => setNewGoal({ ...newGoal, title: text })}
            mode="outlined"
            style={styles.modalInput}
            placeholder="e.g., Emergency Fund, New Car"
          />

          <TextInput
            label="Target Amount"
            value={newGoal.targetAmount}
            onChangeText={(text) => setNewGoal({ ...newGoal, targetAmount: text })}
            mode="outlined"
            keyboardType="numeric"
            left={<TextInput.Icon icon="currency-ngn" />}
            style={styles.modalInput}
          />

          <TextInput
            label="Deadline"
            value={newGoal.deadline}
            onChangeText={(text) => setNewGoal({ ...newGoal, deadline: text })}
            mode="outlined"
            style={styles.modalInput}
            placeholder="YYYY-MM-DD"
          />

          <View style={styles.modalButtons}>
            <Button
              mode="outlined"
              onPress={() => setShowCreateModal(false)}
              style={styles.modalButton}
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={handleCreateGoal}
              loading={isLoading}
              style={styles.modalButton}
            >
              Create Goal
            </Button>
          </View>
        </Modal>
      </Portal>
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
  summaryCard: {
    margin: 20,
    marginTop: -10,
    borderRadius: 16,
    elevation: 4,
  },
  summaryRow: {
    flexDirection: 'row',
    paddingVertical: 10,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryDivider: {
    width: 1,
    backgroundColor: colors.lightGray,
    marginHorizontal: 20,
  },
  summaryLabel: {
    fontSize: 12,
    color: colors.gray,
    marginTop: 5,
    marginBottom: 5,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.darkGray,
  },
  goalsList: {
    paddingHorizontal: 20,
  },
  goalCard: {
    marginBottom: 15,
    borderRadius: 12,
    elevation: 2,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.darkGray,
    flex: 1,
  },
  goalProgress: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
  },
  goalAmounts: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 15,
  },
  goalCurrent: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.darkGray,
    marginRight: 8,
  },
  goalTarget: {
    fontSize: 14,
    color: colors.gray,
  },
  progressBarContainer: {
    marginBottom: 15,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.lightGray,
    borderRadius: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  goalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  goalDeadline: {
    fontSize: 12,
    color: colors.gray,
  },
  fundButton: {
    borderRadius: 8,
  },
  emptyCard: {
    marginTop: 50,
    borderRadius: 12,
    elevation: 2,
  },
  emptyContent: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.darkGray,
    marginTop: 15,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.gray,
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  createFirstButton: {
    borderRadius: 8,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: colors.primary,
  },
  modal: {
    backgroundColor: colors.white,
    padding: 20,
    margin: 20,
    borderRadius: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.darkGray,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalInput: {
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 5,
  },
});