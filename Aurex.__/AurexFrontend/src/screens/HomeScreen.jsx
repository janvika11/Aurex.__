import { View, Text, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import ForexCard from '../components/ForexCard';
import GoldCard  from '../components/GoldCard';
import { useMarketData } from '../hooks/useMarketData';

export default function HomeScreen() {
  const { isLoading, refetch, dataUpdatedAt } = useMarketData();

  const lastUpdated = dataUpdatedAt
    ? new Date(dataUpdatedAt).toLocaleTimeString('en-IN')
    : 'Fetching...';

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={isLoading === true}
          onRefresh={refetch}
          tintColor="#d4a017"
          colors={["#d4a017"]}
        />
      }
    >
      <Text style={styles.header}>AUREX</Text>
      <Text style={styles.tagline}>Gold & Forex Alerts</Text>
      <Text style={styles.updated}>Last updated: {lastUpdated}</Text>
      <Text style={styles.sub}>Pull down to refresh</Text>
      <ForexCard />
      <GoldCard  />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0f', padding: 20 },
  header:    { color: '#d4a017', fontSize: 32, fontWeight: 'bold',
               letterSpacing: 6, marginTop: 20, marginBottom: 2 },
  tagline:   { color: '#d4a017', fontSize: 11, letterSpacing: 4,
               opacity: 0.7, marginBottom: 8 },
  updated:   { color: '#5a5a7a', fontSize: 11, letterSpacing: 1,
               marginBottom: 2 },
  sub:       { color: '#5a5a7a', fontSize: 10, letterSpacing: 1,
               marginBottom: 24 },
});
