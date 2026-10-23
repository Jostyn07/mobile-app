import { Tabs } from 'expo-router';
import { Home, Activity, Droplets, FileText, User } from 'lucide-react-native';
import { BrandColors } from '../../constants/theme';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: BrandColors.verdeYTC,
        tabBarInactiveTintColor: '#94A3B8',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopColor: '#E2E8F0',
          height: 64,
          paddingBottom: 8,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tabs.Screen name="index"     options={{ title: 'Inicio',     tabBarIcon: ({ color, size }) => <Home      size={size} color={color} strokeWidth={2} /> }} />
      <Tabs.Screen name="tracking"  options={{ title: 'Glucosa',    tabBarIcon: ({ color, size }) => <Activity  size={size} color={color} strokeWidth={2} /> }} />
      <Tabs.Screen name="water"     options={{ title: 'Agua',       tabBarIcon: ({ color, size }) => <Droplets  size={size} color={color} strokeWidth={2} /> }} />
      <Tabs.Screen name="insurance" options={{ title: 'Mi seguro',  tabBarIcon: ({ color, size }) => <FileText  size={size} color={color} strokeWidth={2} /> }} />
      <Tabs.Screen name="profile"   options={{ title: 'Perfil',     tabBarIcon: ({ color, size }) => <User      size={size} color={color} strokeWidth={2} /> }} />
    </Tabs>
  );
}