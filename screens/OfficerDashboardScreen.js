import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, ScrollView, Modal, TextInput, Alert, FlatList } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

export default function OfficerDashboardScreen({ navigation }) {
    const { theme, toggleTheme, isDark } = useTheme();
    const [user, setUser] = useState(null);
    const [currentScreen, setCurrentScreen] = useState('pending');
    const [nominations, setNominations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [rejectionReason, setRejectionReason] = useState('');

    useEffect(() => {
        const checkRole = async () => {
            try {
                const userData = await AsyncStorage.getItem('userData');
                if (userData) {
                    const u = JSON.parse(userData);
                    if (u.role === 'ADMIN' || u.role === 'OFFICER') {
                        setUser(u);
                    } else {
                        navigation.replace('StaffLogin');
                    }
                } else {
                    navigation.replace('StaffLogin');
                }
            } catch (error) {
                console.error('Error checking role:', error);
                navigation.replace('StaffLogin');
            }
        };
        checkRole();
    }, [navigation]);

    useEffect(() => {
        if (user && currentScreen === 'pending') {
            fetchNominations();
        }
    }, [user, currentScreen]);

    const handleLogout = async () => {
        await AsyncStorage.removeItem('userToken');
        await AsyncStorage.removeItem('userData');
        navigation.replace('Welcome');
    };

    const fetchNominations = async () => {
        setLoading(true);
        try {
            const response = await api.get('/api/candidates?status=SUBMITTED');
            setNominations(response.data);
        } catch (error) {
            console.error('Failed to fetch nominations:', error);
            Alert.alert('Error', 'Failed to load pending nominations');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (candidateId) => {
        try {
            await api.patch(`/api/candidates/${candidateId}/approve`);
            Alert.alert('Success', 'Candidate approved successfully');
            setModalVisible(false);
            setSelectedCandidate(null);
            fetchNominations(); // Refresh the list
        } catch (error) {
            console.error('Failed to approve candidate:', error);
            Alert.alert('Error', 'Failed to approve candidate');
        }
    };

    const handleReject = async (candidateId) => {
        if (!rejectionReason.trim()) {
            Alert.alert('Error', 'Please provide a reason for rejection');
            return;
        }
        try {
            await api.patch(`/api/candidates/${candidateId}/reject`, { reason: rejectionReason });
            Alert.alert('Success', 'Candidate rejected successfully');
            setModalVisible(false);
            setSelectedCandidate(null);
            setRejectionReason('');
            fetchNominations(); // Refresh the list
        } catch (error) {
            console.error('Failed to reject candidate:', error);
            Alert.alert('Error', 'Failed to reject candidate');
        }
    };

    const openReviewModal = (candidate) => {
        setSelectedCandidate(candidate);
        setModalVisible(true);
    };

    if (!user) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text style={{ color: theme.colors.text, marginTop: 10 }}>Loading...</Text>
            </View>
        );
    }

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background,
        },
        header: {
            padding: 20,
            backgroundColor: theme.colors.card,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.border,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: 50, // For status bar
        },
        headerTitle: {
            fontSize: 20,
            fontWeight: 'bold',
            color: theme.colors.text,
        },
        body: {
            flex: 1,
            flexDirection: 'row',
        },
        sidebar: {
            width: 200,
            backgroundColor: theme.colors.card,
            borderRightWidth: 1,
            borderRightColor: theme.colors.border,
            padding: 20,
        },
        navItem: {
            paddingVertical: 15,
            paddingHorizontal: 10,
            marginBottom: 10,
            borderRadius: 8,
            backgroundColor: currentScreen === 'pending' && theme.colors.primary || currentScreen === 'audit' && theme.colors.primary || theme.colors.background,
        },
        navItemText: {
            fontSize: 16,
            color: currentScreen === 'pending' && '#fff' || currentScreen === 'audit' && '#fff' || theme.colors.text,
            fontWeight: '600',
        },
        content: {
            flex: 1,
            padding: 20,
        },
        contentTitle: {
            fontSize: 24,
            fontWeight: 'bold',
            color: theme.colors.text,
            marginBottom: 20,
        },
        placeholderText: {
            fontSize: 16,
            color: theme.colors.subtext,
        },
        logoutButton: {
            marginTop: 20,
            padding: 15,
            backgroundColor: theme.colors.error || '#ff4444',
            borderRadius: 12,
            alignItems: 'center',
        },
        logoutText: {
            color: '#fff',
            fontWeight: 'bold',
            fontSize: 16,
        },
        tableHeader: {
            flexDirection: 'row',
            backgroundColor: theme.colors.card,
            padding: 15,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.border,
        },
        tableHeaderText: {
            fontSize: 14,
            fontWeight: 'bold',
            color: theme.colors.text,
            flex: 1,
            textAlign: 'center',
        },
        tableRow: {
            flexDirection: 'row',
            backgroundColor: theme.colors.background,
            padding: 15,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.border,
        },
        tableCell: {
            fontSize: 14,
            color: theme.colors.text,
            flex: 1,
            textAlign: 'center',
        },
        reviewButton: {
            backgroundColor: theme.colors.primary,
            paddingHorizontal: 15,
            paddingVertical: 8,
            borderRadius: 6,
        },
        reviewButtonText: {
            color: '#fff',
            fontSize: 12,
            fontWeight: 'bold',
        },
        modalContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
        modalContent: {
            backgroundColor: theme.colors.card,
            borderRadius: 12,
            padding: 20,
            width: '90%',
            maxWidth: 400,
        },
        modalTitle: {
            fontSize: 20,
            fontWeight: 'bold',
            color: theme.colors.text,
            marginBottom: 20,
            textAlign: 'center',
        },
        candidateInfo: {
            marginBottom: 20,
        },
        infoLabel: {
            fontSize: 14,
            fontWeight: 'bold',
            color: theme.colors.text,
            marginBottom: 5,
        },
        infoValue: {
            fontSize: 14,
            color: theme.colors.subtext,
            marginBottom: 10,
        },
        reasonInput: {
            borderWidth: 1,
            borderColor: theme.colors.border,
            borderRadius: 8,
            padding: 10,
            fontSize: 14,
            color: theme.colors.text,
            backgroundColor: theme.colors.background,
            marginBottom: 20,
            minHeight: 80,
            textAlignVertical: 'top',
        },
        modalButtons: {
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
        modalButton: {
            flex: 1,
            padding: 15,
            borderRadius: 8,
            alignItems: 'center',
            marginHorizontal: 5,
        },
        approveButton: {
            backgroundColor: '#10b981',
        },
        rejectButton: {
            backgroundColor: '#ef4444',
        },
        cancelButton: {
            backgroundColor: theme.colors.subtext,
        },
        modalButtonText: {
            color: '#fff',
            fontSize: 16,
            fontWeight: 'bold',
        },
        emptyText: {
            textAlign: 'center',
            marginTop: 50,
            color: theme.colors.subtext,
            fontSize: 16,
        },
    });

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Officer Dashboard</Text>
                <TouchableOpacity onPress={toggleTheme}>
                    <Text style={{ fontSize: 24 }}>{isDark ? '☀️' : '🌙'}</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.body}>
                <View style={styles.sidebar}>
                    <TouchableOpacity
                        style={styles.navItem}
                        onPress={() => setCurrentScreen('pending')}
                    >
                        <Text style={styles.navItemText}>Pending Nominations</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.navItem}
                        onPress={() => setCurrentScreen('audit')}
                    >
                        <Text style={styles.navItemText}>Audit Log</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                        <Text style={styles.logoutText}>Logout</Text>
                    </TouchableOpacity>
                </View>
                <ScrollView style={styles.content}>
                    {currentScreen === 'pending' && (
                        <View>
                            <Text style={styles.contentTitle}>Pending Nominations</Text>
                            {loading ? (
                                <ActivityIndicator size="large" color={theme.colors.primary} />
                            ) : (
                                <View>
                                    <View style={styles.tableHeader}>
                                        <Text style={styles.tableHeaderText}>Name</Text>
                                        <Text style={styles.tableHeaderText}>Position</Text>
                                        <Text style={styles.tableHeaderText}>Date Submitted</Text>
                                        <Text style={styles.tableHeaderText}>Status</Text>
                                        <Text style={styles.tableHeaderText}>Action</Text>
                                    </View>
                                    {nominations.length === 0 ? (
                                        <Text style={styles.emptyText}>No pending nominations found</Text>
                                    ) : (
                                        nominations.map((candidate) => (
                                            <View key={candidate.id} style={styles.tableRow}>
                                                <Text style={styles.tableCell}>{candidate.name}</Text>
                                                <Text style={styles.tableCell}>{candidate.position?.name || 'Unknown'}</Text>
                                                <Text style={styles.tableCell}>
                                                    {new Date(candidate.createdAt).toLocaleDateString()}
                                                </Text>
                                                <Text style={styles.tableCell}>{candidate.status}</Text>
                                                <TouchableOpacity
                                                    style={styles.reviewButton}
                                                    onPress={() => openReviewModal(candidate)}
                                                >
                                                    <Text style={styles.reviewButtonText}>Review</Text>
                                                </TouchableOpacity>
                                            </View>
                                        ))
                                    )}
                                </View>
                            )}
                        </View>
                    )}
                    {currentScreen === 'audit' && (
                        <View>
                            <Text style={styles.contentTitle}>Audit Log</Text>
                            <Text style={styles.placeholderText}>
                                Audit log functionality to be integrated here.
                            </Text>
                        </View>
                    )}
                </ScrollView>
            </View>
        </View>
    );
}
