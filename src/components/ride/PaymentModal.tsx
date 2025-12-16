import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { Modal } from '../ui/Modal';
import { COLORS, SPACING, RADIUS } from '@/constants';

interface PaymentModalProps {
  visible: boolean;
  paymentUrl: string;
  onSuccess: () => void;
  onFailure: () => void;
  onClose: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  visible,
  paymentUrl,
  onSuccess,
  onFailure,
  onClose,
}) => {
  const [loading, setLoading] = useState(true);

  const handleNavigationStateChange = (navState: any) => {
    const { url } = navState;

    // Check for success/failure callback URLs based on backend config
    // Usually these are configured in the payment gateway settings
    if (url.includes('/payment/success') || url.includes('status=success')) {
      onSuccess();
    } else if (url.includes('/payment/failure') || url.includes('status=failed') || url.includes('/payment/cancel')) {
      onFailure();
    }
  };

  return (
    <Modal visible={visible} title="Complete Payment" onClose={onClose}>
      <View style={styles.container}>
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        )}
        <WebView
          source={{ uri: paymentUrl }}
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
          onNavigationStateChange={handleNavigationStateChange}
          style={styles.webview}
          javaScriptEnabled
          domStorageEnabled
          startInLoadingState={true}
          renderLoading={() => <View />} // Handled by custom loader
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 500, // Fixed height for the modal content
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.md,
    overflow: 'hidden',
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    zIndex: 1,
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});
