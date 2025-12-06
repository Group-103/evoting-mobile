import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Platform } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import api from '../services/api';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function AdminCreatePositionScreen({ navigation }) {
    const { theme } = useTheme();
    const [loading, setLoading] = useState(false);
    const [queue, setQueue] = useState([]);
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

    const addToQueue = () => {
        if (!formData.name || !formData.seats) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        setQueue([...queue, { ...formData, id: Date.now() }]);

        // Reset form but keep dates for convenience
        setFormData({
            ...formData,
            name: '',
            seats: '1',
        });
    };

    const removeFromQueue = (id) => {
        setQueue(queue.filter(item => item.id !== id));
    };

    const handleSubmitAll = async () => {
        if (queue.length === 0) {
            Alert.alert('Error', 'Queue is empty. Add at least one position.');
            return;
        }

        setLoading(true);
        try {
            const payload = {
                positions: queue.map(p => ({
                    ...p,
                    seats: parseInt(p.seats) || 1,
                }))
            };

            // COMPREHENSIVE LOGGING FOR DEBUGGING
            console.log('=== BULK CREATE DEBUG ===');
            console.log('API Base URL:', api.defaults.baseURL);
            console.log('Full URL:', `${api.defaults.baseURL}/positions/bulk`);
            console.log('Payload:', JSON.stringify(payload, null, 2));
            console.log('Queue length:', queue.length);
            console.log('========================');

            const response = await api.post('/positions/bulk', payload);

            console.log('Success response:', response.data);
            Alert.alert('Success', `Created ${queue.length} positions successfully`, [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } catch (error) {
            console.error('=== BULK CREATE ERROR ===');
            console.error('Error type:', error.constructor.name);
            console.error('Error message:', error.message);
            console.error('Response status:', error.response?.status);
            console.error('Response data:', error.response?.data);
            console.error('Request URL:', error.config?.url);
            console.error('Request baseURL:', error.config?.baseURL);
            console.error('Full constructed URL:', error.config?.baseURL + error.config?.url);
            console.error('========================');

            const errorMessage = error.response?.data?.error || error.message || 'Failed to create positions';
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
            paddingBottom: 100,
        },
        sectionTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: theme.colors.text,
            marginTop: 20,
            marginBottom: 10,
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
        addButton: {
            backgroundColor: theme.colors.primary,
            padding: 16,
            borderRadius: 12,
            alignItems: 'center',
            marginTop: 30,
        },
        submitButton: {
            backgroundColor: '#10b981', // Green
            padding: 16,
            borderRadius: 12,
            alignItems: 'center',
            marginTop: 20,
            marginBottom: 50,
        },
        buttonText: {
            color: '#fff',
            fontSize: 18,
            fontWeight: 'bold',
        },
        queueItem: {
            backgroundColor: theme.colors.card,
            padding: 15,
            borderRadius: 8,
            marginBottom: 10,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderLeftWidth: 4,
            borderLeftColor: theme.colors.primary,
        },
        queueText: {
            color: theme.colors.text,
            fontSize: 16,
            fontWeight: 'bold',
        },
        queueSubtext: {
            color: theme.colors.subtext,
            fontSize: 12,
        },
        removeButton: {
            padding: 5,
        },
        removeText: {
            color: theme.colors.error || '#ff4444',
            fontSize: 20,
        },
    });

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.sectionTitle}>Add New Position</Text>

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

                <TouchableOpacity style={styles.addButton} onPress={addToQueue}>
                    <Text style={styles.buttonText}>Add to Queue ⬇️</Text>
                </TouchableOpacity>

                {queue.length > 0 && (
                    <>
                        <Text style={styles.sectionTitle}>Positions Queue ({queue.length})</Text>
                        {queue.map((item) => (
                            <View key={item.id} style={styles.queueItem}>
                                <View>
                                    <Text style={styles.queueText}>{item.name}</Text>
                                    <Text style={styles.queueSubtext}>{item.seats} Seat(s)</Text>
                                </View>
                                <TouchableOpacity onPress={() => removeFromQueue(item.id)} style={styles.removeButton}>
                                    <Text style={styles.removeText}>❌</Text>
                                </TouchableOpacity>
                            </View>
                        ))}

                        <TouchableOpacity
                            style={styles.submitButton}
                            onPress={handleSubmitAll}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.buttonText}>Submit All Positions ✅</Text>
                            )}
                        </TouchableOpacity>
                    </>
                )}

                {showPicker.field && (
                    <DateTimePicker
                        value={formData[showPicker.field]}
                        mode={showPicker.mode}
                        is24Hour={true}
                        display="default"
                        onChange={handleDateChange}
                    />
                )}
            </ScrollView>
        </View>
    );
}

