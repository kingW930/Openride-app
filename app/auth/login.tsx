// app/auth/login.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { useRouter } from 'expo-router';
import { COLORS, SPACING, FONT_SIZE, FONT_WEIGHT } from '@/constants';
import Icon from 'react-native-vector-icons/Feather';

const LoginForm = ({ role, onSubmit }: { role: 'rider'|'driver'; onSubmit: () => void }) => (
  <View style={{paddingHorizontal: SPACING.lg, paddingTop: SPACING.md}}>
    <Text style={{fontSize: FONT_SIZE.md, fontWeight: '600', marginBottom: SPACING.sm}}>Sign in as {role}</Text>
    <TextInput placeholder="Phone number" keyboardType="phone-pad" style={styles.input}/>
    <TextInput placeholder="Password (optional for testing)" secureTextEntry style={styles.input}/>
    <TouchableOpacity style={[styles.btnPrimary]} onPress={onSubmit}>
      <Text style={{color:COLORS.textOnPrimary}}>Continue</Text>
    </TouchableOpacity>
  </View>
);

export default function AuthScreen() {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const routes = [{key:'rider',title:'Rider'}, {key:'driver', title:'Driver'}];

  const renderScene = SceneMap({
    rider: () => <LoginForm role="rider" onSubmit={() => router.replace('/rider/home')} />,
    driver: () => <LoginForm role="driver" onSubmit={() => router.replace('/driver/home')} />
  });

  return (
    <SafeAreaView style={{flex:1, backgroundColor:COLORS.background}}>
      <KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS==='ios' ? 'padding' : undefined}>
        <View style={styles.header}>
          <Icon name="chevron-left" size={24} color={COLORS.textPrimary} />
          <Text style={styles.headerTitle}>Welcome back</Text>
        </View>

        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{width: 360}}
          renderTabBar={props => (
            <TabBar
              {...props}
              indicatorStyle={{ backgroundColor: COLORS.primary }}
              style={{ backgroundColor: 'transparent', elevation: 0 }}
              activeColor={COLORS.primary}
              inactiveColor={COLORS.textSecondary}
            />
          )}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header:{flexDirection:'row', alignItems:'center', padding: SPACING.lg, gap: 8},
  headerTitle:{fontSize: FONT_SIZE.lg, fontWeight: FONT_WEIGHT.bold},
  input:{borderWidth:1, borderColor:COLORS.border, padding: SPACING.sm, borderRadius: 10, marginBottom: SPACING.md},
  btnPrimary:{backgroundColor: COLORS.primary, padding: SPACING.md, alignItems: 'center', borderRadius: 10, marginTop: SPACING.md}
});
