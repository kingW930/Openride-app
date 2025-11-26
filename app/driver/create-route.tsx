// app/driver/create-route.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDriverStore } from '@/store/driverStore';
import { COLORS, SPACING, FONT_SIZE, FONT_WEIGHT, RADIUS } from '@/constants';

export default function CreateRoute() {
  const [name, setName] = useState('');
  const [stops, setStops] = useState('');

  function handleSave() {
    if (!name.trim()) return Alert.alert('Please enter a route name');
    // For now store in local store or push to backend API later
    // Example: useDriverStore.getState().saveRoute({ name, stops: stops.split(',') })
    Alert.alert('Saved', `Route "${name}" saved (mock)`);
  }

  return (
    <SafeAreaView style={{ flex: 1, padding: SPACING.lg, backgroundColor: COLORS.background }}>
      <Text style={{ fontSize: FONT_SIZE.lg, fontWeight: FONT_WEIGHT.bold }}>Create Route</Text>

      <View style={{ marginTop: SPACING.md }}>
        <Text style={{ marginBottom: 6 }}>Route name</Text>
        <TextInput value={name} onChangeText={setName} placeholder="Morning commute" style={styles.input} />
      </View>

      <View style={{ marginTop: SPACING.md }}>
        <Text style={{ marginBottom: 6 }}>Stops (comma separated addresses)</Text>
        <TextInput value={stops} onChangeText={setStops} placeholder="Stop 1, Stop 2" style={[styles.input, { height: 100 }]} multiline />
      </View>

      <Pressable style={styles.save} onPress={handleSave}>
        <Text style={{ color: '#fff', textAlign: 'center' }}>Save Route</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  input: { backgroundColor: '#fff', padding: 12, borderRadius: RADIUS.md, borderWidth: 1, borderColor: '#e6e6e6' },
  save: { marginTop: SPACING.lg, backgroundColor: COLORS.primary, padding: SPACING.md, borderRadius: RADIUS.md },
});
