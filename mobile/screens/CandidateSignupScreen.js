import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Alert,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import api from '../services/api';

export default function CandidateSignupScreen({ navigation }) {
    const { theme } = useTheme();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        regNo: '',
        program: '',
        password: '',
        confirmPassword: '',
    });

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const validateForm = () => {
        if (!formData.name.trim()) {
            Alert.alert('Error', 'Please enter your full name');
            return false;
        }
        if (!formData.email.trim()) {
            Alert.alert('Error', 'Please enter your email');
            return false;
        }
        if (!formData.email.includes('@')) {
            Alert.alert('Error', 'Please enter a valid email address');
            return false;
        }
        if (!formData.regNo.trim()) {
            Alert.alert('Error', 'Please enter your registration number');
            return false;
        }
        if (!formData.program.trim()) {
            Alert.alert('Error', 'Please enter your program/course');
            return false;
        }
        if (!formData.password) {
            Alert.alert('Error', 'Please enter a password');
            return false;
        }
        if (formData.password.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters');
            return false;
        }
        if (formData.password !== formData.confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return false;
        }
        return true;
    };

    const handleSignup = async () => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            await api.post('/auth/register', {
                name: formData.name.trim(),
                email: formData.email.trim().toLowerCase(),
                regNo: formData.regNo.trim().toUpperCase(),
                program: formData.program.trim(),
                password: formData.password,
            });

            Alert.alert(
                'Registration Successful!',
                'Your candidate account has been created. You can now login and submit your nomination.',
                [
                    {
                        text: 'Login Now',
                        onPress: () => navigation.replace('Login'),
                    },
                ]
            );
        } catch (error) {
            console.error('Signup error:', error);
            Alert.alert(
                'Registration Failed',
                error.response?.data?.error || 'Failed to create account. Please try again.'
            );
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
            padding: 20,
            paddingTop: 60,
        },
        header: {
            marginBottom: 30,
        },
        title: {
            fontSize: 32,
            fontWeight: 'bold',
            color: theme.colors.text,
            marginBottom: 10,
        },
        subtitle: {
            fontSize: 16,
            color: theme.colors.subtext,
            lineHeight: 24,
        },
        form: {
            gap: 20,
        },
        inputGroup: {
            gap: 8,
        },
        label: {
            fontSize: 14,
            fontWeight: '600',
            color: theme.colors.text,
        },
        input: {
            backgroundColor: theme.colors.card,
            borderWidth: 1,
            borderColor: theme.colors.border,
            borderRadius: 12,
            padding: 15,
            fontSize: 16,
            color: theme.colors.text,
        },
        row: {
            flexDirection: 'row',
            gap: 15,
        },
        halfInput: {
            flex: 1,
        },
        signupButton: {
            backgroundColor: theme.colors.primary,
            padding: 18,
            borderRadius: 12,
            alignItems: 'center',
            marginTop: 10,
        },
        signupButtonDisabled: {
            opacity: 0.7,
        },
        signupButtonText: {
            color: '#fff',
            fontSize: 18,
            fontWeight: 'bold',
        },
        footer: {
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 30,
            marginBottom: 40,
        },
        footerText: {
            color: theme.colors.subtext,
            fontSize: 16,
        },
        loginLink: {
            color: theme.colors.primary,
            fontSize: 16,
            fontWeight: 'bold',
        },
        infoBox: {
            backgroundColor: theme.colors.primary + '15',
            padding: 15,
            borderRadius: 12,
            marginBottom: 20,
        },
        infoText: {
            color: theme.colors.text,
            fontSize: 14,
            lineHeight: 20,
        },
    });

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.header}>
                    <Text style={styles.title}>Candidate Signup</Text>
                    <Text style={styles.subtitle}>
                        Create an account to run for a position in the university election
                    </Text>
                </View>

                <View style={styles.infoBox}>
                    <Text style={styles.infoText}>
                        📋 After registration, you can login to submit your nomination with your manifesto and campaign details.
                    </Text>
                </View>

                <View style={styles.form}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Full Name *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your full name"
                            placeholderTextColor={theme.colors.subtext}
                            value={formData.name}
                            onChangeText={(value) => handleChange('name', value)}
                            autoCapitalize="words"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Email Address *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="your.email@university.edu"
                            placeholderTextColor={theme.colors.subtext}
                            value={formData.email}
                            onChangeText={(value) => handleChange('email', value)}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>

                    <View style={styles.row}>
                        <View style={[styles.inputGroup, styles.halfInput]}>
                            <Text style={styles.label}>Reg Number *</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="e.g. DIT/001/2024"
                                placeholderTextColor={theme.colors.subtext}
                                value={formData.regNo}
                                onChangeText={(value) => handleChange('regNo', value)}
                                autoCapitalize="characters"
                            />
                        </View>

                        <View style={[styles.inputGroup, styles.halfInput]}>
                            <Text style={styles.label}>Program *</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="e.g. Computer Science"
                                placeholderTextColor={theme.colors.subtext}
                                value={formData.program}
                                onChangeText={(value) => handleChange('program', value)}
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Password *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Create a password (min. 6 characters)"
                            placeholderTextColor={theme.colors.subtext}
                            value={formData.password}
                            onChangeText={(value) => handleChange('password', value)}
                            secureTextEntry
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Confirm Password *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Confirm your password"
                            placeholderTextColor={theme.colors.subtext}
                            value={formData.confirmPassword}
                            onChangeText={(value) => handleChange('confirmPassword', value)}
                            secureTextEntry
                        />
                    </View>

                    <TouchableOpacity
                        style={[styles.signupButton, loading && styles.signupButtonDisabled]}
                        onPress={handleSignup}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.signupButtonText}>Create Account</Text>
                        )}
                    </TouchableOpacity>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>Already have an account? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                        <Text style={styles.loginLink}>Login</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
