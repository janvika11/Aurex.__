import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useMarketStore } from '../store/marketStore';

const TAB_BAR_HEIGHT = 60;

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();
  const { alertHistory } = useMarketStore();
  const bottomPadding = insets.bottom + TAB_BAR_HEIGHT + 24;

  if (alertHistory.length === 0) {
    return (
      <View style={[styles.empty, { paddingBottom: bottomPadding }]}>
        <Text style={styles.emptyIcon}>🔔</Text>
        <Text style={styles.emptyText}>No alerts fired yet</Text>
        <Text style={styles.emptySub}>Set a target price and we'll log it here</Text>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={{ paddingBottom: bottomPadding }}
      data={alertHistory}
      keyExtractor={(_, i) => String(i)}
      renderItem={({ item }) => (
        <View style={styles.item}>
          <Text style={styles.icon}>{item.type === 'forex' ? '📈' : '🥇'}</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.body}>{item.body}</Text>
            <Text style={styles.time}>
              {new Date(item.time).toLocaleString('en-IN')}
            </Text>
          </View>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0f', padding: 16 },
  empty:     { flex: 1, backgroundColor: '#0a0a0f',
               justifyContent: 'center', alignItems: 'center' },
  emptyIcon: { fontSize: 48, marginBottom: 16 },
  emptyText: { color: '#e8e8f0', fontSize: 16,
               fontWeight: 'bold', marginBottom: 8 },
  emptySub:  { color: '#5a5a7a', fontSize: 12,
               textAlign: 'center', letterSpacing: 1 },
  item:      { backgroundColor: '#111118', borderRadius: 12, padding: 16,
               marginBottom: 10, flexDirection: 'row', alignItems: 'flex-start',
               borderWidth: 1, borderColor: '#1e1e2e', gap: 12 },
  icon:      { fontSize: 24 },
  title:     { color: '#e8e8f0', fontWeight: 'bold', fontSize: 13, marginBottom: 4 },
  body:      { color: '#5a5a7a', fontSize: 11, marginBottom: 6, letterSpacing: 0.5 },
  time:      { color: '#d4a017', fontSize: 10, letterSpacing: 1 },
});