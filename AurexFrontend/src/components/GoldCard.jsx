import { View, Text, StyleSheet } from 'react-native';
import { useMarketStore } from '../store/marketStore';

export default function GoldCard() {
  const { gold, goldAlert } = useMarketStore();

  return (
    <View style={styles.card}>
      <Text style={styles.label}>🥇 GOLD / gram</Text>
      <Text style={styles.price}>
        {gold ? `₹${Math.round(gold).toLocaleString('en-IN')}` : '—'}
      </Text>
      {goldAlert.active && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            🔔 Alert: {goldAlert.direction} ₹{goldAlert.target}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card:      { backgroundColor: '#111118', borderRadius: 16,
               padding: 24, marginBottom: 16, borderWidth: 1,
               borderColor: 'rgba(212,160,23,0.4)' },
  label:     { color: '#d4a017', fontSize: 12,
               letterSpacing: 3, marginBottom: 10 },
  price:     { color: '#f0c040', fontSize: 44,
               fontWeight: 'bold', marginBottom: 8 },
  badge:     { backgroundColor: 'rgba(212,160,23,0.1)', borderRadius: 8,
               padding: 8, borderWidth: 1,
               borderColor: 'rgba(212,160,23,0.3)' },
  badgeText: { color: '#d4a017', fontSize: 11, letterSpacing: 1 },
});