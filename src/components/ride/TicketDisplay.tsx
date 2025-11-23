import React from 'react';
import { View, Text, StyleSheet, Share, TouchableOpacity } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { colors, sizes } from '../../constants';
import { Ticket } from '../../types/api';
import { formatDate, formatTime } from '../../utils/formatter';

interface TicketDisplayProps {
  ticket: Ticket;
  routeName: string;
  pickupLocation: string;
  dropoffLocation: string;
}

export const TicketDisplay: React.FC<TicketDisplayProps> = ({
  ticket,
  routeName,
  pickupLocation,
  dropoffLocation,
}) => {
  const handleShare = async () => {
    try {
      await Share.share({
        message: `OpenRide Ticket\nTicket ID: ${ticket.id}\nRoute: ${routeName}\nValid until: ${formatDate(ticket.validUntil)}`,
      });
    } catch (error) {
      console.error('Error sharing ticket:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Ticket</Text>
        <Text style={styles.routeName}>{routeName}</Text>
      </View>

      <View style={styles.qrContainer}>
        <QRCode
          value={ticket.qrPayload}
          size={200}
          backgroundColor={colors.white}
          color={colors.black}
        />
      </View>

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Ticket ID:</Text>
          <Text style={styles.value}>{ticket.id}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>From:</Text>
          <Text style={styles.value}>{pickupLocation}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>To:</Text>
          <Text style={styles.value}>{dropoffLocation}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Valid Until:</Text>
          <Text style={styles.value}>
            {formatDate(ticket.validUntil)} {formatTime(ticket.validUntil)}
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
        <Text style={styles.shareButtonText}>Share Ticket</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Show this QR code to the driver when boarding
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: sizes.radiusLg,
    padding: sizes.lg,
    margin: sizes.md,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
    alignItems: 'center',
    marginBottom: sizes.lg,
  },
  title: {
    fontSize: sizes.fontXl,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: sizes.xs,
  },
  routeName: {
    fontSize: sizes.fontMd,
    color: colors.textSecondary,
  },
  qrContainer: {
    alignItems: 'center',
    padding: sizes.lg,
    backgroundColor: colors.white,
    marginBottom: sizes.lg,
  },
  details: {
    marginBottom: sizes.lg,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: sizes.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.light,
  },
  label: {
    fontSize: sizes.fontSm,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  value: {
    fontSize: sizes.fontSm,
    color: colors.text,
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  shareButton: {
    backgroundColor: colors.primary,
    borderRadius: sizes.radiusMd,
    padding: sizes.md,
    alignItems: 'center',
    marginBottom: sizes.md,
  },
  shareButtonText: {
    color: colors.white,
    fontSize: sizes.fontMd,
    fontWeight: '600',
  },
  footer: {
    paddingTop: sizes.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  footerText: {
    fontSize: sizes.fontSm,
    color: colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
