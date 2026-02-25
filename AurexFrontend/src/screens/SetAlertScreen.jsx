import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity,
         StyleSheet, ScrollView, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useMarketStore } from '../store/marketStore';

const TAB_BAR_HEIGHT = 60;

export default function SetAlertScreen() {
  const insets = useSafeAreaInsets();
  const { forex, gold,
          forexAlert, setForexAlert, clearForexAlert,
          goldAlert,  setGoldAlert,  clearGoldAlert } = useMarketStore();

  const [forexTarget,    setForexTarget]    = useState('');
  const [forexDirection, setForexDirection] = useState('above');
  const [goldTarget,     setGoldTarget]     = useState('');
  const [goldDirection,  setGoldDirection]  = useState('above');

  function saveForexAlert() {
    if (!forexTarget || isNaN(parseFloat(forexTarget))) {
      Alert.alert('Invalid', 'Please enter a valid target rate');
      return;
    }
    setForexAlert({ active: true, target: parseFloat(forexTarget), direction: forexDirection });
    Alert.alert('✅ Alert Set', `Notifying when USD/INR goes ${forexDirection} ₹${forexTarget}`);
    setForexTarget('');
  }

  function saveGoldAlert() {
    if (!goldTarget || isNaN(parseFloat(goldTarget))) {
      Alert.alert('Invalid', 'Please enter a valid target price');
      return;
    }
    setGoldAlert({ active: true, target: parseFloat(goldTarget), direction: goldDirection });
    Alert.alert('✅ Alert Set', `Notifying when Gold goes ${goldDirection} ₹${goldTarget}/g`);
    setGoldTarget('');
  }

  const bottomPadding = insets.bottom + TAB_BAR_HEIGHT + 24;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: bottomPadding }}
      keyboardShouldPersistTaps="handled"
    >

      <Text style={styles.section}>📈 USD / INR ALERT</Text>
      <Text style={styles.current}>
        Current: ₹{forex ? forex.toFixed(4) : '—'}
      </Text>

      <Text style={styles.label}>Notify me when rate goes:</Text>
      <View style={styles.dirRow}>
        {['above', 'below'].map(dir => (
          <TouchableOpacity key={dir}
            style={[styles.dirBtn, forexDirection === dir && styles.dirSelected]}
            onPress={() => setForexDirection(dir)}>
            <Text style={[styles.dirText, forexDirection === dir && styles.dirTextOn]}>
              {dir === 'above' ? '▲ ABOVE' : '▼ BELOW'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TextInput style={styles.input}
        placeholder="Target rate  e.g. 91.00"
        placeholderTextColor="#5a5a7a"
        keyboardType="numeric"
        value={forexTarget}
        onChangeText={setForexTarget} />

      {forexAlert.active && (
        <View style={styles.activeBadge}>
          <Text style={styles.activeText}>
            ✓ Active: {forexAlert.direction} ₹{forexAlert.target}
          </Text>
          <TouchableOpacity onPress={clearForexAlert}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity style={styles.btn} onPress={saveForexAlert}>
        <Text style={styles.btnText}>SET FOREX ALERT</Text>
      </TouchableOpacity>

      <View style={styles.divider} />

      <Text style={styles.section}>🥇 GOLD ALERT  (per gram)</Text>
      <Text style={styles.current}>
        Current: ₹{gold ? Math.round(gold).toLocaleString('en-IN') : '—'}/g
      </Text>

      <Text style={styles.label}>Notify me when price goes:</Text>
      <View style={styles.dirRow}>
        {['above', 'below'].map(dir => (
          <TouchableOpacity key={dir}
            style={[styles.dirBtn, goldDirection === dir && styles.dirSelected]}
            onPress={() => setGoldDirection(dir)}>
            <Text style={[styles.dirText, goldDirection === dir && styles.dirTextOn]}>
              {dir === 'above' ? '▲ ABOVE' : '▼ BELOW'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TextInput style={styles.input}
        placeholder="Target price  e.g. 15500"
        placeholderTextColor="#5a5a7a"
        keyboardType="numeric"
        value={goldTarget}
        onChangeText={setGoldTarget} />

      {goldAlert.active && (
        <View style={styles.activeBadge}>
          <Text style={styles.activeText}>
            ✓ Active: {goldAlert.direction} ₹{goldAlert.target}/g
          </Text>
          <TouchableOpacity onPress={clearGoldAlert}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity style={styles.btn} onPress={saveGoldAlert}>
        <Text style={styles.btnText}>SET GOLD ALERT</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:    { flex: 1, backgroundColor: '#0a0a0f', padding: 20 },
  section:      { color: '#d4a017', fontSize: 13, letterSpacing: 3,
                  fontWeight: 'bold', marginTop: 20, marginBottom: 6 },
  current:      { color: '#5a5a7a', fontSize: 12, marginBottom: 18, letterSpacing: 1 },
  label:        { color: '#e8e8f0', fontSize: 12, marginBottom: 10, letterSpacing: 1 },
  dirRow:       { flexDirection: 'row', gap: 10, marginBottom: 14 },
  dirBtn:       { flex: 1, padding: 14, borderRadius: 10, backgroundColor: '#111118',
                  borderWidth: 1, borderColor: '#1e1e2e', alignItems: 'center' },
  dirSelected:  { borderColor: '#d4a017', backgroundColor: 'rgba(212,160,23,0.1)' },
  dirText:      { color: '#5a5a7a', fontWeight: 'bold', letterSpacing: 2, fontSize: 12 },
  dirTextOn:    { color: '#d4a017' },
  input:        { backgroundColor: '#111118', color: '#e8e8f0', borderRadius: 10,
                  padding: 14, fontSize: 18, borderWidth: 1,
                  borderColor: '#1e1e2e', marginBottom: 12 },
  activeBadge:  { backgroundColor: 'rgba(0,230,118,0.08)', borderRadius: 8,
                  padding: 12, marginBottom: 12, borderWidth: 1,
                  borderColor: 'rgba(0,230,118,0.2)', flexDirection: 'row',
                  justifyContent: 'space-between', alignItems: 'center' },
  activeText:   { color: '#00e676', fontSize: 11, flex: 1 },
  cancelText:   { color: '#ff3d57', fontSize: 11, marginLeft: 8 },
  btn:          { backgroundColor: '#d4a017', borderRadius: 10,
                  padding: 16, alignItems: 'center', marginBottom: 8 },
  btnText:      { color: '#0a0a0f', fontWeight: 'bold', letterSpacing: 3, fontSize: 12 },
  divider:      { height: 1, backgroundColor: '#1e1e2e', marginVertical: 24 },
});