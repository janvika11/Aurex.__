import { View, Text, StyleSheet } from 'react-native';
import { useMarketStore } from '../store/marketStore';

export default function ForexCard() {
  const { forex, forexAlert } = useMarketStore();

  return (
    <View style={styles.card}>
      <Text style={styles.label}>💱 USD / INR</Text>
      <Text style={styles.price}>
        {forex ? `₹${forex.toFixed(4)}` : '—'}
      </Text>
      {forexAlert.active && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            🔔 Alert: {forexAlert.direction} ₹{forexAlert.target}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card:      { backgroundColor: '#111118', borderRadius: 16,
               padding: 24, marginBottom: 16, borderWidth: 1,
               borderColor: 'rgba(79,195,247,0.3)' },
  label:     { color: '#4fc3f7', fontSize: 12,
               letterSpacing: 3, marginBottom: 10 },
  price:     { color: '#4fc3f7', fontSize: 44,
               fontWeight: 'bold', marginBottom: 8 },
  badge:     { backgroundColor: 'rgba(212,160,23,0.1)', borderRadius: 8,
               padding: 8, borderWidth: 1,
               borderColor: 'rgba(212,160,23,0.3)' },
  badgeText: { color: '#d4a017', fontSize: 11, letterSpacing: 1 },
});