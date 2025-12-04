import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TouchableOpacity, Text, View } from 'react-native';

import WelcomeScreen from './screens/WelcomeScreen';
import VoterLoginScreen from './screens/VoterLoginScreen';
import LoginScreen from './screens/LoginScreen';
import DashboardScreen from './screens/DashboardScreen';
import ResultsScreen from './screens/ResultsScreen';
import CandidateProfileScreen from './screens/CandidateProfileScreen';
import AdminDashboardScreen from './screens/AdminDashboardScreen';
import AdminCandidatesScreen from './screens/AdminCandidatesScreen';
import AdminVotersScreen from './screens/AdminVotersScreen';
import AdminPositionsScreen from './screens/AdminPositionsScreen';
import AdminCreatePositionScreen from './screens/AdminCreatePositionScreen';
import AdminEditPositionScreen from './screens/AdminEditPositionScreen';
import AdminCreateOfficerScreen from './screens/AdminCreateOfficerScreen';
import AdminCreateCandidateScreen from './screens/AdminCreateCandidateScreen';
import CandidateDashboardScreen from './screens/CandidateDashboardScreen';
import EditCandidateProfileScreen from './screens/EditCandidateProfileScreen';
import ManifestoViewerScreen from './screens/ManifestoViewerScreen';
import AuditLogScreen from './screens/AuditLogScreen';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: theme.colors.card,
          borderTopColor: theme.colors.border,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.subtext,
        headerStyle: {
          backgroundColor: theme.colors.card,
          shadowColor: 'transparent',
        },
        headerTintColor: theme.colors.text,
        headerRight: () => (
          <TouchableOpacity onPress={toggleTheme} style={{ marginRight: 15 }}>
            <Text style={{ fontSize: 24 }}>{isDark ? '☀️' : '🌙'}</Text>
          </TouchableOpacity>
        ),
      }}
    >
      <Tab.Screen
        name="Vote"
        component={DashboardScreen}
        options={{
          title: 'Vote',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>🗳️</Text>
        }}
      />
      <Tab.Screen
        name="Results"
        component={ResultsScreen}
        options={{
          title: 'Live Results',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>📊</Text>
        }}
      />
    </Tab.Navigator>
  );
}

function AppContent() {
  const { theme, isDark } = useTheme();

  const navigationTheme = isDark ? {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      primary: theme.colors.primary,
      background: theme.colors.background,
      card: theme.colors.card,
      text: theme.colors.text,
      border: theme.colors.border,
      notification: theme.colors.error,
    }
  } : {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: theme.colors.primary,
      background: theme.colors.background,
      card: theme.colors.card,
      text: theme.colors.text,
      border: theme.colors.border,
      notification: theme.colors.error,
    }
  };

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="VoterLogin"
          component={VoterLoginScreen}
          options={{
            title: 'Voter Login',
            headerStyle: { backgroundColor: theme.colors.card },
            headerTintColor: theme.colors.text,
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name="StaffLogin"
          component={LoginScreen}
          options={{
            title: 'Staff Login',
            headerStyle: { backgroundColor: theme.colors.card },
            headerTintColor: theme.colors.text,
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name="Main"
          component={MainTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CandidateProfile"
          component={CandidateProfileScreen}
          options={{
            title: 'Candidate Profile',
            headerStyle: { backgroundColor: theme.colors.card },
            headerTintColor: theme.colors.text,
          }}
        />
        <Stack.Screen
          name="AdminDashboard"
          component={AdminDashboardScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CandidateDashboard"
          component={CandidateDashboardScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AdminCandidates"
          component={AdminCandidatesScreen}
          options={{
            title: 'Manage Candidates',
            headerStyle: { backgroundColor: theme.colors.card },
            headerTintColor: theme.colors.text,
          }}
        />
        <Stack.Screen
          name="AdminVoters"
          component={AdminVotersScreen}
          options={{
            title: 'Manage Voters',
            headerStyle: { backgroundColor: theme.colors.card },
            headerTintColor: theme.colors.text,
          }}
        />
        <Stack.Screen
          name="AdminPositions"
          component={AdminPositionsScreen}
          options={{
            title: 'Manage Positions',
            headerStyle: { backgroundColor: theme.colors.card },
            headerTintColor: theme.colors.text,
          }}
        />
        <Stack.Screen
          name="AdminCreatePosition"
          component={AdminCreatePositionScreen}
          options={{
            title: 'Create Position',
            headerStyle: { backgroundColor: theme.colors.card },
            headerTintColor: theme.colors.text,
          }}
        />
        <Stack.Screen
          name="AdminEditPosition"
          component={AdminEditPositionScreen}
          options={{
            title: 'Edit Position',
            headerStyle: { backgroundColor: theme.colors.card },
            headerTintColor: theme.colors.text,
          }}
        />
        <Stack.Screen
          name="AdminCreateOfficer"
          component={AdminCreateOfficerScreen}
          options={{
            title: 'Create Officer',
            headerStyle: { backgroundColor: theme.colors.card },
            headerTintColor: theme.colors.text,
          }}
        />
        <Stack.Screen
          name="AdminCreateCandidate"
          component={AdminCreateCandidateScreen}
          options={{
            title: 'Create Candidate',
            headerStyle: { backgroundColor: theme.colors.card },
            headerTintColor: theme.colors.text,
          }}
        />
        <Stack.Screen
          name="Results"
          component={ResultsScreen}
          options={{
            title: 'Live Results',
            headerStyle: { backgroundColor: theme.colors.card },
            headerTintColor: theme.colors.text,
          }}
        />
        <Stack.Screen
          name="EditCandidateProfile"
          component={EditCandidateProfileScreen}
          options={{
            title: 'Edit Profile',
            headerStyle: { backgroundColor: theme.colors.card },
            headerTintColor: theme.colors.text,
          }}
        />
        <Stack.Screen
          name="ManifestoViewer"
          component={ManifestoViewerScreen}
          options={{
            title: 'View Manifesto',
            headerStyle: { backgroundColor: theme.colors.card },
            headerTintColor: theme.colors.text,
          }}
        />
        <Stack.Screen
          name="AuditLog"
          component={AuditLogScreen}
          options={{
            title: 'Audit Log',
            headerStyle: { backgroundColor: theme.colors.card },
            headerTintColor: theme.colors.text,
          }}
        />
      </Stack.Navigator>
      <StatusBar style={isDark ? "light" : "dark"} />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
