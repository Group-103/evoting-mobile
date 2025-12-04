import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import api from '../services/api';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function AdminEditPositionScreen({ navigation, route }) {
    const { theme } = useTheme();
    const { position } = route.params;
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: position.name,
        seats: position.seats.toString(),
        nominationOpens: new Date(position.nominationOpens),
        nominationCloses: new Date(position.nominationCloses),
        votingOpens: new Date(position.votingOpens),
        votingCloses: new Date(position.votingCloses),
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
                name: formData.name,
                seats: parseInt(formData.seats) || 1,
                nominationOpens: formData.nominationOpens.toISOString(),
                nominationCloses: formData.nominationCloses.toISOString(),
                votingOpens: formData.votingOpens.toISOString(),
                votingCloses: formData.votingCloses.toISOString(),
            };

            console.log('Updating position:', payload);

            await api.put(`/api/positions/${position.id}`, payload);

            Alert.alert('Success', 'Position updated successfully', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } catch (error) {
            console.error('Update Position Error:', error);
            const errorMessage = error.response?.data?.error || error.message || 'Failed to update position';
            const errorDetails = error.response?.data?.details ? `\n\nDetails: ${error.response.data.details}` : '';
            Alert.alert('Error', errorMessage + errorDetails);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = () => {
        Alert.alert(
            'Delete Position',
            `Are you sure you want to delete "${position.name}"? This action cannot be undone.`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            setLoading(true);
                            await api.delete(`/api/positions/${position.id}`);
                            Alert.alert('Success', 'Position deleted successfully', [
                                { text: 'OK', onPress: () => navigation.goBack() }
                            ]);
                        } catch (error) {
                            console.error('Delete Position Error:', error);
                            Alert.alert('Error', error.response?.data?.error || 'Failed to delete position');
                        } finally {
                            setLoading(false);
                        }
                    }
                }
            ]
        );
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
        },
        buttonText: {
            color: '#fff',
            fontSize: 18,
            fontWeight: 'bold',
        },
        deleteButton: {
            backgroundColor: theme.colors.error || '#ff4444',
            padding: 16,
            borderRadius: 12,
            alignItems: 'center',
            marginTop: 15,
            marginBottom: 50,
        },
        deleteButtonText: {
            color: '#fff',
            fontSize: 18,
            fontWeight: 'bold',
        },
        infoBox: {
            backgroundColor: theme.colors.primary + '20',
            padding: 15,
            borderRadius: 8,
            marginBottom: 20,
        },
        infoText: {
            color: theme.colors.text,
            fontSize: 14,
            lineHeight: 20,
        },
    });

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.infoBox}>
                    <Text style={styles.infoText}>
                        💡 You can edit the position details and extend deadlines by changing the date and time values below.
                    </Text>
                </View>

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
                        <Text style={styles.buttonText}>Update Position</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={handleDelete}
                    disabled={loading}
                >
                    <Text style={styles.deleteButtonText}>Delete Position</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}
