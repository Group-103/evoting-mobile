import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';
import { useNavigation } from '@react-navigation/native';

export default function VoterLoginScreen() {
    const navigation = useNavigation();
    const [step, setStep] = useState(1); // 1: RegNo, 2: OTP
    const [regNo, setRegNo] = useState('');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRequestOTP = async () => {
        if (!regNo.trim()) {
            Alert.alert('Error', 'Please enter your Registration Number');
            return;
        }

        setLoading(true);
        try {
            // Request OTP
            const response = await api.post('/verify/request-otp', {
                reg_no: regNo.trim()
            });

            Alert.alert('Success', response.data.message || 'OTP sent to your email');
            setStep(2);
        } catch (error) {
            console.error('OTP Request error:', error);
            const errorMessage = error.response?.data?.error || 'Failed to request OTP. Please check your registration number.';
            Alert.alert('Error', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async () => {
        if (!otp.trim()) {
            Alert.alert('Error', 'Please enter the OTP sent to your email');
            return;
        }

        setLoading(true);
        try {
            // Verify OTP
            const response = await api.post('/verify/confirm', {
                reg_no: regNo.trim(),
                otp: otp.trim()
            });

            const { ballotToken, message } = response.data;

            if (ballotToken) {
                await AsyncStorage.setItem('ballotToken', ballotToken);
                await AsyncStorage.setItem('userRole', 'VOTER');
                await AsyncStorage.setItem('regNo', regNo.trim());

                Alert.alert('Success', message || 'Verification successful!', [
                    { text: 'OK', onPress: () => navigation.replace('Dashboard') }
                ]);
            } else {
                Alert.alert('Error', 'Failed to retrieve ballot token');
            }
        } catch (error) {
            console.error('Verification error:', error);
            const errorMessage = error.response?.data?.error || 'Invalid OTP. Please try again.';
            Alert.alert('Error', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        setStep(1);
        setOtp('');
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Text style={styles.title}>Voter Login</Text>
                    <Text style={styles.subtitle}>
                        {step === 1
                            ? 'Enter your Registration Number to vote'
                            : `Enter the OTP sent to your email for ${regNo}`}
                    </Text>
                </View>

                <View style={styles.form}>
                    {step === 1 ? (
                        <>
                            <Text style={styles.label}>Registration Number</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="e.g., REG/001/2025"
                                value={regNo}
                                onChangeText={setRegNo}
                                autoCapitalize="characters"
                                autoCorrect={false}
                                editable={!loading}
                            />
                            <TouchableOpacity
                                style={styles.button}
                                onPress={handleRequestOTP}
                                disabled={loading}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <Text style={styles.buttonText}>Request OTP</Text>
                                )}
                            </TouchableOpacity>
                        </>
                    ) : (
                        <>
                            <Text style={styles.label}>Verification Code (OTP)</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter 6-digit OTP"
                                value={otp}
                                onChangeText={setOtp}
                                keyboardType="number-pad"
                                maxLength={6}
                                editable={!loading}
                            />
                            <TouchableOpacity
                                style={styles.button}
                                onPress={handleVerifyOTP}
                                disabled={loading}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <Text style={styles.buttonText}>Verify & Vote</Text>
                                )}
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.backButton}
                                onPress={handleBack}
                                disabled={loading}
                            >
                                <Text style={styles.backButtonText}>Change Registration Number</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 20,
    },
    header: {
        marginBottom: 40,
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        paddingHorizontal: 20,
    },
    form: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        marginBottom: 20,
        backgroundColor: '#fafafa',
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    backButton: {
        marginTop: 15,
        alignItems: 'center',
        padding: 10,
    },
    backButtonText: {
        color: '#666',
        fontSize: 14,
    }
});

