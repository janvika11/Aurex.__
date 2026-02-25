import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ForexCard from './src/components/ForexCard';
import GoldCard from './src/components/GoldCard';
import SetAlertScreen from './src/screens/SetAlertScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import { useMarketData } from './src/hooks/useMarketData';
import { useMarketStore } from './src/store/marketStore';
import { registerForNotifications } from './src/utils/notifications';
import { API_BASE } from './src/config';

const queryClient = new QueryClient();
const Tab = createBottomTabNavigator();

function HomeScreen() {
  const { forex, gold } = useMarketStore();
  const { isLoading, isError, error, refetch, dataUpdatedAt } = useMarketData();

  useEffect(() => { registerForNotifications(); }, []);

  const lastUpdated = dataUpdatedAt
    ? new Date(dataUpdatedAt).toLocaleTimeString('en-IN')
    : (isError ? null : 'Fetching...');

  const errorMessage = isError && error ? (error.message || String(error)) : null;

  const ratesLine = (forex != null || gold != null)
    ? `USD/INR ₹${forex != null ? forex.toFixed(4) : '—'}  ·  Gold ₹${gold != null ? Math.round(gold).toLocaleString('en-IN') : '—'}/g`
    : null;

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
      {ratesLine != null && (
        <Text style={styles.rates}>{ratesLine}</Text>
      )}
      {lastUpdated !== null && (
        <Text style={styles.updated}>Last updated: {lastUpdated}</Text>
      )}
      {errorMessage ? (
        <>
          <Text style={styles.errorTitle}>Could not load prices</Text>
          <Text style={styles.errorText}>{errorMessage}</Text>
          <Text style={styles.errorHint}>
            Trying: {API_BASE.replace('/api', '')}. If using Render, first load can take up to 60s (server waking). Check phone Wi‑Fi or mobile data.
          </Text>
          <Text style={styles.retryHint}>Pull down to retry (we wait up to 60s)</Text>
        </>
      ) : (
        <Text style={styles.sub}>Pull down to refresh · Auto-updates every 60s</Text>
      )}
      <ForexCard />
      <GoldCard />
    </ScrollView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={{
              headerShown: false,
              tabBarStyle: {
                backgroundColor: '#0d0d14',
                borderTopColor: '#1e1e2e',
                paddingBottom: 8,
                paddingTop: 8,
                height: 60,
              },
              tabBarActiveTintColor: '#d4a017',
              tabBarInactiveTintColor: '#5a5a7a',
              tabBarLabelStyle: {
                fontSize: 10,
                letterSpacing: 1,
                fontWeight: 'bold',
              },
            }}
          >
            <Tab.Screen name="Home" component={HomeScreen}
              options={{ tabBarLabel: 'PRICES',
                tabBarIcon: ({ color }) => <Text style={{ fontSize: 18, color }}>📊</Text> }}
            />
            <Tab.Screen name="SetAlert" component={SetAlertScreen}
              options={{ tabBarLabel: 'SET ALERT',
                tabBarIcon: ({ color }) => <Text style={{ fontSize: 18, color }}>🔔</Text> }}
            />
            <Tab.Screen name="History" component={HistoryScreen}
              options={{ tabBarLabel: 'HISTORY',
                tabBarIcon: ({ color }) => <Text style={{ fontSize: 18, color }}>📋</Text> }}
            />
          </Tab.Navigator>
        </NavigationContainer>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container:   { flex: 1, backgroundColor: '#0a0a0f', padding: 20 },
  header:      { color: '#d4a017', fontSize: 32, fontWeight: 'bold',
                 letterSpacing: 6, marginTop: 20, marginBottom: 2 },
  tagline:     { color: '#d4a017', fontSize: 11, letterSpacing: 4,
                 opacity: 0.7, marginBottom: 8 },
  rates:       { color: '#d4a017', fontSize: 14, fontWeight: '600', letterSpacing: 1, marginBottom: 6 },
  updated:     { color: '#5a5a7a', fontSize: 11, letterSpacing: 1, marginBottom: 2 },
  sub:         { color: '#5a5a7a', fontSize: 10, letterSpacing: 1, marginBottom: 24 },
  errorTitle:  { color: '#ff6b6b', fontSize: 14, fontWeight: 'bold', marginBottom: 6 },
  errorText:   { color: '#5a5a7a', fontSize: 12, marginBottom: 8 },
  errorHint:   { color: '#5a5a7a', fontSize: 11, marginBottom: 6 },
  retryHint:   { color: '#d4a017', fontSize: 11, marginBottom: 24 },
});