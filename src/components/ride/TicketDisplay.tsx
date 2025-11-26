import React from 'react';
import { View, Text, StyleSheet, Share, TouchableOpacity } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { COLORS, SPACING, FONT_SIZE, RADIUS } from '../../constants';
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
        message: `OpenRide Ticket\nTicket ID: ${ticket.id}\nRoute: ${routeName}\nBooking: ${ticket.bookingId}`,
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
          value={ticket.id}
          size={200}
          backgroundColor={COLORS.white}
          color={COLORS.black}
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
          <Text style={styles.label}>Booking ID:</Text>
          <Text style={styles.value}>
            {ticket.bookingId}
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
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    margin: SPACING.md,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: FONT_SIZE.xl,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  routeName: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
  },
  qrContainer: {
    alignItems: 'center',
    padding: SPACING.lg,
    backgroundColor: COLORS.white,
    marginBottom: SPACING.lg,
  },
  details: {
    marginBottom: SPACING.lg,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  label: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  value: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text,
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  shareButton: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  shareButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
  },
  footer: {
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  footerText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
