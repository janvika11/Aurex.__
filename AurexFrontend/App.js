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
import { registerForNotifications } from './src/utils/notifications';

const queryClient = new QueryClient();
const Tab = createBottomTabNavigator();

function HomeScreen() {
  const { isLoading, refetch, dataUpdatedAt } = useMarketData();

  useEffect(() => { registerForNotifications(); }, []);

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
      <Text style={styles.sub}>Pull down to refresh · Auto-updates every 60s</Text>
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
  container: { flex: 1, backgroundColor: '#0a0a0f', padding: 20 },
  header:    { color: '#d4a017', fontSize: 32, fontWeight: 'bold',
               letterSpacing: 6, marginTop: 20, marginBottom: 2 },
  tagline:   { color: '#d4a017', fontSize: 11, letterSpacing: 4,
               opacity: 0.7, marginBottom: 8 },
  updated:   { color: '#5a5a7a', fontSize: 11, letterSpacing: 1, marginBottom: 2 },
  sub:       { color: '#5a5a7a', fontSize: 10, letterSpacing: 1, marginBottom: 24 },
});