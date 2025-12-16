import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, FONT_SIZE, RADIUS, SHADOW } from '@/constants';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { getWalletBalance, getPayoutRequests, requestPayout, addBankAccount } from '@/api/payouts';
import { PayoutRequest, BankAccount } from '@/types/api';
import { formatCurrency } from '@/utils/formatter';
import { Ionicons } from '@expo/vector-icons';

export default function PayoutsScreen() {
  const [balance, setBalance] = useState(0);
  const [payouts, setPayouts] = useState<PayoutRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Modal States
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showBankModal, setShowBankModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [bankDetails, setBankDetails] = useState({ bankName: '', accountNumber: '', accountName: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      const [balanceData, payoutsData] = await Promise.all([
        getWalletBalance(),
        getPayoutRequests()
      ]);
      setBalance(balanceData.data.available);
      setPayouts(payoutsData.data.payouts);
    } catch (error) {
      console.error('Error fetching payout data:', error);
      Alert.alert('Error', 'Failed to load earnings data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || isNaN(Number(withdrawAmount))) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }
    
    const amount = parseFloat(withdrawAmount);
    if (amount > balance) {
      Alert.alert('Error', 'Insufficient funds');
      return;
    }

    try {
      setSubmitting(true);
      // In a real app, we'd select a bank account ID here. 
      // For now, we'll assume a default or pass a placeholder if the API requires it.
      // For this MVP, we'll assume the backend uses the default bank account.
      
      await requestPayout(amount);
      Alert.alert('Success', 'Payout request submitted');
      setShowWithdrawModal(false);
      setWithdrawAmount('');
      fetchData();
    } catch (error) {
      Alert.alert('Error', 'Failed to request payout');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddBank = async () => {
    if (!bankDetails.accountNumber || !bankDetails.bankName) {
      Alert.alert('Error', 'Please fill in bank details');
      return;
    }

    try {
      setSubmitting(true);
      await addBankAccount(bankDetails.bankName, bankDetails.accountNumber, bankDetails.accountName);
      Alert.alert('Success', 'Bank account added');
      setShowBankModal(false);
      setBankDetails({ bankName: '', accountNumber: '', accountName: '' });
    } catch (error) {
      Alert.alert('Error', 'Failed to add bank account');
    } finally {
      setSubmitting(false);
    }
  };

  const renderPayoutItem = ({ item }: { item: PayoutRequest }) => (
    <View style={styles.payoutItem}>
      <View>
        <Text style={styles.payoutId}>Ref: {item.id.slice(0, 8)}</Text>
        <Text style={styles.payoutDate}>{new Date(item.requestedAt).toLocaleDateString()}</Text>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <Text style={styles.payoutAmount}>{formatCurrency(item.amount)}</Text>
        <Text style={[
          styles.payoutStatus, 
          { color: item.status === 'completed' ? COLORS.success : item.status === 'pending' ? COLORS.warning : COLORS.error }
        ]}>
          {item.status}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Earnings & Payouts</Text>
      </View>

      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Available Balance</Text>
        <Text style={styles.balanceAmount}>{formatCurrency(balance)}</Text>
        <View style={styles.actionButtons}>
          <Button 
            title="Withdraw" 
            onPress={() => setShowWithdrawModal(true)} 
            style={styles.actionButton}
            size="sm"
          />
          <Button 
            title="Add Bank" 
            variant="outline"
            onPress={() => setShowBankModal(true)} 
            style={styles.actionButton}
            size="sm"
          />
        </View>
      </View>

      <View style={styles.listContainer}>
        <Text style={styles.sectionTitle}>Recent Payouts</Text>
        <FlatList
          data={payouts}
          renderItem={renderPayoutItem}
          keyExtractor={item => item.id}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No payout history yet</Text>
            </View>
          }
        />
      </View>

      {/* Withdraw Modal */}
      <Modal 
        visible={showWithdrawModal} 
        title="Request Payout" 
        onClose={() => setShowWithdrawModal(false)}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>Available: {formatCurrency(balance)}</Text>
          <Input
            label="Amount"
            placeholder="0.00"
            keyboardType="numeric"
            value={withdrawAmount}
            onChangeText={(t: string) => setWithdrawAmount(t)}
          />
          <Button 
            title="Submit Request" 
            onPress={handleWithdraw} 
            loading={submitting}
            style={{ marginTop: SPACING.md }}
          />
        </View>
      </Modal>

      {/* Add Bank Modal */}
      <Modal 
        visible={showBankModal} 
        title="Add Bank Account" 
        onClose={() => setShowBankModal(false)}
      >
        <View style={styles.modalContent}>
          <Input
            label="Bank Name"
            placeholder="e.g. GTBank"
            value={bankDetails.bankName}
            onChangeText={(t: string) => setBankDetails(prev => ({ ...prev, bankName: t }))}
          />
          <Input
            label="Account Number"
            placeholder="0123456789"
            keyboardType="numeric"
            value={bankDetails.accountNumber}
            onChangeText={(t: string) => setBankDetails(prev => ({ ...prev, accountNumber: t }))}
          />
          <Input
            label="Account Name"
            placeholder="John Doe"
            value={bankDetails.accountName}
            onChangeText={(t: string) => setBankDetails(prev => ({ ...prev, accountName: t }))}
          />
          <Button 
            title="Save Account" 
            onPress={handleAddBank} 
            loading={submitting}
            style={{ marginTop: SPACING.md }}
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: SPACING.lg,
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: FONT_SIZE.xl,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  balanceCard: {
    margin: SPACING.lg,
    padding: SPACING.lg,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    ...SHADOW.md,
  },
  balanceLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: FONT_SIZE.sm,
    marginBottom: SPACING.xs,
  },
  balanceAmount: {
    color: '#FFF',
    fontSize: FONT_SIZE.xxl,
    fontWeight: 'bold',
    marginBottom: SPACING.lg,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  actionButton: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 0,
  },
  listContainer: {
    flex: 1,
    backgroundColor: COLORS.backgroundSecondary,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    padding: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: 'bold',
    marginBottom: SPACING.md,
    color: COLORS.text,
  },
  payoutItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: SPACING.md,
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.sm,
    ...SHADOW.sm,
  },
  payoutId: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: COLORS.text,
  },
  payoutDate: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textTertiary,
    marginTop: 2,
  },
  payoutAmount: {
    fontSize: FONT_SIZE.md,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  payoutStatus: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
    marginTop: 2,
  },
  emptyState: {
    padding: SPACING.xl,
    alignItems: 'center',
  },
  emptyText: {
    color: COLORS.textTertiary,
  },
  modalContent: {
    padding: SPACING.md,
  },
  modalText: {
    fontSize: FONT_SIZE.md,
    marginBottom: SPACING.md,
    color: COLORS.text,
  },
});
