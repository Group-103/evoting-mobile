import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import api from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../contexts/ThemeContext';

export default function LoginScreen({ navigation }) {
    const { theme } = useTheme();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            const response = await api.post('/auth/login', { email, password });
            const { token, user } = response.data;

            console.log('Login response:', { token: token ? 'present' : 'missing', user });

            if (token) {
                await AsyncStorage.setItem('userToken', token);
                await AsyncStorage.setItem('userData', JSON.stringify(user));

                console.log('User role:', user.role);

                // Navigate BEFORE showing alert
                if (user.role === 'ADMIN' || user.role === 'OFFICER') {
                    console.log('Navigating to AdminDashboard');
                    navigation.replace('AdminDashboard');
                } else if (user.role === 'CANDIDATE') {
                    console.log('Navigating to CandidateDashboard');
                    navigation.replace('CandidateDashboard');
                } else {
                    console.log('Navigating to Main');
                    navigation.replace('Main');
                }
            }
        } catch (error) {
            console.error('Login error:', error);
            Alert.alert('Error', error.response?.data?.error || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background,
        },
        scrollContent: {
            flexGrow: 1,
            justifyContent: 'center',
            padding: 20,
        },
        title: {
            fontSize: 28,
            fontWeight: 'bold',
            marginBottom: 10,
            color: theme.colors.text,
            textAlign: 'center',
        },
        subtitle: {
            fontSize: 16,
            color: theme.colors.subtext,
            marginBottom: 40,
            textAlign: 'center',
        },
        inputContainer: {
            width: '100%',
            marginBottom: 20,
        },
        label: {
            fontSize: 14,
            color: theme.colors.text,
            marginBottom: 8,
            fontWeight: '600',
        },
        input: {
            width: '100%',
            height: 55,
            borderColor: theme.colors.border,
            borderWidth: 1,
            borderRadius: 12,
            paddingHorizontal: 15,
            fontSize: 16,
            color: theme.colors.text,
            backgroundColor: theme.colors.card,
        },
        button: {
            width: '100%',
            height: 55,
            backgroundColor: theme.colors.primary,
            borderRadius: 12,
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 10,
            shadowColor: theme.colors.primary,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 8,
            elevation: 4,
        },
        buttonDisabled: {
            opacity: 0.7,
        },
        buttonText: {
            color: '#fff',
            fontSize: 18,
            fontWeight: 'bold',
        },
    });

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.title}>Staff Login</Text>
                <Text style={styles.subtitle}>For Candidates and Officials</Text>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Email Address</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your email"
                        placeholderTextColor={theme.colors.subtext}
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                        editable={!loading}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Password</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your password"
                        placeholderTextColor={theme.colors.subtext}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        editable={!loading}
                    />
                </View>

                <TouchableOpacity
                    style={[styles.button, loading && styles.buttonDisabled]}
                    onPress={handleLogin}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Login</Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}



