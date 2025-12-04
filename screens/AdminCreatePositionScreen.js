import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Platform } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import api from '../services/api';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function AdminCreatePositionScreen({ navigation }) {
    const { theme } = useTheme();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        seats: '1',
        nominationOpens: new Date(),
        nominationCloses: new Date(Date.now() + 86400000), // +1 day
        votingOpens: new Date(Date.now() + 172800000), // +2 days
        votingCloses: new Date(Date.now() + 259200000), // +3 days
    });

    const [showPicker, setShowPicker] = useState({
        field: null,
        mode: 'date', // 'date' or 'time'
    });

    const handleDateChange = (event, selectedDate) => {
        const currentField = showPicker.field;
        setShowPicker({ ...showPicker, field: null }); // Hide picker

        if (selectedDate && currentField) {
            setFormData(prev => ({
                ...prev,
                [currentField]: selectedDate
            }));
        }
    };

    const showDatepicker = (field, mode) => {
        setShowPicker({ field, mode });
    };

    const handleSubmit = async () => {
        if (!formData.name || !formData.seats) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        setLoading(true);
        try {
            const payload = {
                ...formData,
                seats: parseInt(formData.seats) || 1, // Default to 1 if parsing fails
            };

            console.log('Sending position payload:', payload);

            await api.post('/api/positions', payload);

            Alert.alert('Success', 'Position created successfully', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } catch (error) {
            console.error('Create Position Error:', error);
            const errorMessage = error.response?.data?.error || error.message || 'Failed to create position';
            const errorDetails = error.response?.data?.details ? `\n\nDetails: ${error.response.data.details}` : '';
            Alert.alert('Error', errorMessage + errorDetails);
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
        dateButton: {
            backgroundColor: theme.colors.card,
            borderWidth: 1,
            borderColor: theme.colors.border,
            borderRadius: 8,
            padding: 12,
        },
        dateTimeRow: {
            flexDirection: 'row',
            gap: 10,
        },
        dateButtonHalf: {
            flex: 1,
        },
        dateText: {
            fontSize: 16,
            color: theme.colors.text,
        },
        button: {
            backgroundColor: theme.colors.primary,
            padding: 16,
            borderRadius: 12,
            alignItems: 'center',
            marginTop: 30,
            marginBottom: 50,
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
                <Text style={styles.label}>Position Name</Text>
                <TextInput
                    style={styles.input}
                    value={formData.name}
                    onChangeText={(text) => setFormData({ ...formData, name: text })}
                    placeholder="e.g. President"
                    placeholderTextColor={theme.colors.subtext}
                />

                <Text style={styles.label}>Number of Seats</Text>
                <TextInput
                    style={styles.input}
                    value={formData.seats}
                    onChangeText={(text) => setFormData({ ...formData, seats: text })}
                    keyboardType="numeric"
                    placeholder="1"
                    placeholderTextColor={theme.colors.subtext}
                />

                <Text style={styles.label}>Nomination Opens</Text>
                <View style={styles.dateTimeRow}>
                    <TouchableOpacity onPress={() => showDatepicker('nominationOpens', 'date')} style={[styles.dateButton, styles.dateButtonHalf]}>
                        <Text style={styles.dateText}>📅 {formData.nominationOpens.toLocaleDateString()}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => showDatepicker('nominationOpens', 'time')} style={[styles.dateButton, styles.dateButtonHalf]}>
                        <Text style={styles.dateText}>🕐 {formData.nominationOpens.toLocaleTimeString()}</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.label}>Nomination Closes</Text>
                <View style={styles.dateTimeRow}>
                    <TouchableOpacity onPress={() => showDatepicker('nominationCloses', 'date')} style={[styles.dateButton, styles.dateButtonHalf]}>
                        <Text style={styles.dateText}>📅 {formData.nominationCloses.toLocaleDateString()}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => showDatepicker('nominationCloses', 'time')} style={[styles.dateButton, styles.dateButtonHalf]}>
                        <Text style={styles.dateText}>🕐 {formData.nominationCloses.toLocaleTimeString()}</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.label}>Voting Opens</Text>
                <View style={styles.dateTimeRow}>
                    <TouchableOpacity onPress={() => showDatepicker('votingOpens', 'date')} style={[styles.dateButton, styles.dateButtonHalf]}>
                        <Text style={styles.dateText}>📅 {formData.votingOpens.toLocaleDateString()}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => showDatepicker('votingOpens', 'time')} style={[styles.dateButton, styles.dateButtonHalf]}>
                        <Text style={styles.dateText}>🕐 {formData.votingOpens.toLocaleTimeString()}</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.label}>Voting Closes</Text>
                <View style={styles.dateTimeRow}>
                    <TouchableOpacity onPress={() => showDatepicker('votingCloses', 'date')} style={[styles.dateButton, styles.dateButtonHalf]}>
                        <Text style={styles.dateText}>📅 {formData.votingCloses.toLocaleDateString()}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => showDatepicker('votingCloses', 'time')} style={[styles.dateButton, styles.dateButtonHalf]}>
                        <Text style={styles.dateText}>🕐 {formData.votingCloses.toLocaleTimeString()}</Text>
                    </TouchableOpacity>
                </View>

                {showPicker.field && (
                    <DateTimePicker
                        value={formData[showPicker.field]}
                        mode={showPicker.mode}
                        is24Hour={true}
                        display="default"
                        onChange={handleDateChange}
                    />
                )}

                <TouchableOpacity
                    style={styles.button}
                    onPress={handleSubmit}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Create Position</Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}
