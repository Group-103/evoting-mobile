import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import api from '../services/api';

export default function AdminCreateCandidateScreen({ navigation }) {
    const { theme } = useTheme();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        regNo: '',
        program: '',
    });

    const handleSubmit = async () => {
        if (!formData.name || !formData.email || !formData.password) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        setLoading(true);
        try {
            await api.post('/api/users', {
                ...formData,
                role: 'CANDIDATE',
            });
            Alert.alert('Success', 'Candidate account created successfully', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } catch (error) {
            console.error(error);
            Alert.alert('Error', error.response?.data?.error || 'Failed to create candidate');
        } finally {
            setLoading(false);
        }
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background,
        },
        content: {
            padding: 20,
        },
        label: {
            fontSize: 14,
            fontWeight: '600',
            color: theme.colors.text,
            marginBottom: 8,
            marginTop: 15,
        },
        input: {
            backgroundColor: theme.colors.card,
            borderWidth: 1,
            borderColor: theme.colors.border,
            borderRadius: 8,
            padding: 12,
            fontSize: 16,
            color: theme.colors.text,
        },
        button: {
            backgroundColor: theme.colors.primary,
            padding: 16,
            borderRadius: 12,
            alignItems: 'center',
            marginTop: 30,
        },
        buttonText: {
            color: '#fff',
            fontSize: 18,
            fontWeight: 'bold',
        },
    });

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.label}>Full Name *</Text>
                <TextInput
                    style={styles.input}
                    value={formData.name}
                    onChangeText={(text) => setFormData({ ...formData, name: text })}
                    placeholder="Jane Doe"
                    placeholderTextColor={theme.colors.subtext}
                />

                <Text style={styles.label}>Email Address *</Text>
                <TextInput
                    style={styles.input}
                    value={formData.email}
                    onChangeText={(text) => setFormData({ ...formData, email: text })}
                    placeholder="candidate@university.edu"
                    placeholderTextColor={theme.colors.subtext}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                <Text style={styles.label}>Password *</Text>
                <TextInput
                    style={styles.input}
                    value={formData.password}
                    onChangeText={(text) => setFormData({ ...formData, password: text })}
                    placeholder="Enter password"
                    placeholderTextColor={theme.colors.subtext}
                    secureTextEntry
                />

                <Text style={styles.label}>Registration Number (Optional)</Text>
                <TextInput
                    style={styles.input}
                    value={formData.regNo}
                    onChangeText={(text) => setFormData({ ...formData, regNo: text })}
                    placeholder="REG/2023/001"
                    placeholderTextColor={theme.colors.subtext}
                />

                <Text style={styles.label}>Program (Optional)</Text>
                <TextInput
                    style={styles.input}
                    value={formData.program}
                    onChangeText={(text) => setFormData({ ...formData, program: text })}
                    placeholder="BSc. Computer Science"
                    placeholderTextColor={theme.colors.subtext}
                />

                <TouchableOpacity
                    style={styles.button}
                    onPress={handleSubmit}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Create Candidate Account</Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}
