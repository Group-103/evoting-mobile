import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, RefreshControl, TouchableOpacity, Alert, Linking } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useFocusEffect } from '@react-navigation/native';
import api from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AdminCandidatesScreen({ navigation }) {
    const { theme } = useTheme();
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [userRole, setUserRole] = useState('');
    const [processingId, setProcessingId] = useState(null);

    React.useLayoutEffect(() => {
        // Only show create button for admin
        if (userRole === 'ADMIN') {
            navigation.setOptions({
                headerRight: () => (
                    <TouchableOpacity
                        onPress={() => navigation.navigate('AdminCreateCandidate')}
                        style={{ marginRight: 15 }}
                    >
                        <Text style={{ fontSize: 24 }}>➕</Text>
                    </TouchableOpacity>
                ),
            });
        } else {
            navigation.setOptions({
                headerRight: null,
            });
        }
    }, [navigation, userRole]);

    const fetchCandidates = async () => {
        try {
            // Get user role
            const userData = await AsyncStorage.getItem('userData');
            if (userData) {
                const user = JSON.parse(userData);
                setUserRole(user.role);
            }

            const response = await api.get('/candidates');
            setCandidates(response.data);
        } catch (error) {
            console.error('Failed to fetch candidates:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // Refresh data when screen comes into focus
    useFocusEffect(
        useCallback(() => {
            fetchCandidates();
        }, [])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchCandidates();
    };

    const handleApprove = (candidate) => {
        Alert.alert(
            'Approve Nomination',
            `Are you sure you want to approve ${candidate.name}'s nomination for ${candidate.position?.name}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Approve',
                    onPress: async () => {
                        setProcessingId(candidate.id);
                        try {
                            await api.patch(`/candidates/${candidate.id}/approve`);
                            Alert.alert('Success', 'Nomination approved successfully!');
                            fetchCandidates();
                        } catch (error) {
                            console.error('Approve error:', error);
                            Alert.alert('Error', error.response?.data?.error || 'Failed to approve nomination');
                        } finally {
                            setProcessingId(null);
                        }
                    }
                }
            ]
        );
    };

    const handleReject = (candidate) => {
        Alert.alert(
            'Reject Nomination',
            `Are you sure you want to reject ${candidate.name}'s nomination for ${candidate.position?.name}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Reject',
                    style: 'destructive',
                    onPress: async () => {
                        setProcessingId(candidate.id);
                        try {
                            await api.patch(`/candidates/${candidate.id}/reject`);
                            Alert.alert('Done', 'Nomination rejected.');
                            fetchCandidates();
                        } catch (error) {
                            console.error('Reject error:', error);
                            Alert.alert('Error', error.response?.data?.error || 'Failed to reject nomination');
                        } finally {
                            setProcessingId(null);
                        }
                    }
                }
            ]
        );
    };

    const handleViewManifesto = async (candidate) => {
        if (!candidate.manifestoUrl) {
            Alert.alert('No Manifesto', 'This candidate has not uploaded a manifesto.');
            return;
        }

        try {
            // Construct the full URL for the manifesto
            const baseUrl = api.defaults.baseURL.replace('/api', '');
            const manifestoUrl = `${baseUrl}${candidate.manifestoUrl}`;

            const supported = await Linking.canOpenURL(manifestoUrl);
            if (supported) {
                await Linking.openURL(manifestoUrl);
            } else {
                Alert.alert('Error', 'Cannot open manifesto file');
            }
        } catch (error) {
            console.error('Open manifesto error:', error);
            Alert.alert('Error', 'Failed to open manifesto');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'APPROVED': return '#10b981';
            case 'REJECTED': return '#ef4444';
            case 'PENDING': return '#f59e0b';
            case 'SUBMITTED': return '#f59e0b';
            default: return theme.colors.subtext;
        }
    };

    const renderItem = ({ item }) => {
        const isPending = item.status === 'PENDING' || item.status === 'SUBMITTED';
        const isProcessing = processingId === item.id;

        return (
            <View style={[styles.card, isPending && styles.pendingCard]}>
                {/* Header Row */}
                <View style={styles.row}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>{item.name.charAt(0).toUpperCase()}</Text>
                    </View>
                    <View style={styles.info}>
                        <Text style={styles.name}>{item.name}</Text>
                        <Text style={styles.position}>{item.position?.name || 'Unknown Position'}</Text>
                        <Text style={styles.email}>{item.user?.email || item.program}</Text>
                        {item.slogan && (
                            <Text style={styles.slogan} numberOfLines={2}>💬 "{item.slogan}"</Text>
                        )}
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
                        <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                            {item.status}
                        </Text>
                    </View>
                </View>

                {/* View Manifesto Button - Always visible */}
                <TouchableOpacity
                    style={styles.manifestoButton}
                    onPress={() => handleViewManifesto(item)}
                >
                    <Text style={styles.manifestoButtonText}>
                        📄 {item.manifestoUrl ? 'View Manifesto' : 'No Manifesto'}
                    </Text>
                </TouchableOpacity>

                {/* Action buttons for pending nominations */}
                {isPending && (
                    <View style={styles.actionRow}>
                        {isProcessing ? (
                            <ActivityIndicator color={theme.colors.primary} style={{ padding: 10 }} />
                        ) : (
                            <>
                                <TouchableOpacity
                                    style={[styles.actionButton, styles.approveButton]}
                                    onPress={() => handleApprove(item)}
                                >
                                    <Text style={styles.actionButtonText}>✓ Approve</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.actionButton, styles.rejectButton]}
                                    onPress={() => handleReject(item)}
                                >
                                    <Text style={styles.actionButtonText}>✗ Reject</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                )}
            </View>
        );
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background,
        },
        listContent: {
            padding: 20,
        },
        card: {
            backgroundColor: theme.colors.card,
            borderRadius: 12,
            padding: 15,
            marginBottom: 15,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 2,
        },
        pendingCard: {
            borderWidth: 2,
            borderColor: '#f59e0b',
        },
        row: {
            flexDirection: 'row',
            alignItems: 'flex-start',
        },
        avatar: {
            width: 50,
            height: 50,
            borderRadius: 25,
            backgroundColor: theme.colors.primary,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 15,
        },
        avatarText: {
            color: '#fff',
            fontSize: 20,
            fontWeight: 'bold',
        },
        info: {
            flex: 1,
        },
        name: {
            fontSize: 16,
            fontWeight: 'bold',
            color: theme.colors.text,
        },
        position: {
            fontSize: 14,
            color: theme.colors.primary,
            marginTop: 2,
        },
        email: {
            fontSize: 12,
            color: theme.colors.subtext,
            marginTop: 2,
        },
        slogan: {
            fontSize: 12,
            color: theme.colors.text,
            marginTop: 6,
            fontStyle: 'italic',
            lineHeight: 18,
        },
        statusBadge: {
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 8,
        },
        statusText: {
            fontSize: 11,
            fontWeight: 'bold',
        },
        manifestoButton: {
            marginTop: 12,
            paddingVertical: 10,
            paddingHorizontal: 15,
            backgroundColor: theme.colors.primary + '15',
            borderRadius: 8,
            alignItems: 'center',
        },
        manifestoButtonText: {
            color: theme.colors.primary,
            fontWeight: '600',
            fontSize: 14,
        },
        actionRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 15,
            paddingTop: 15,
            borderTopWidth: 1,
            borderTopColor: theme.colors.border,
            gap: 10,
        },
        actionButton: {
            flex: 1,
            paddingVertical: 12,
            borderRadius: 8,
            alignItems: 'center',
        },
        approveButton: {
            backgroundColor: '#10b981',
        },
        rejectButton: {
            backgroundColor: '#ef4444',
        },
        actionButtonText: {
            color: '#fff',
            fontWeight: 'bold',
            fontSize: 15,
        },
        emptyText: {
            textAlign: 'center',
            marginTop: 50,
            color: theme.colors.subtext,
            fontSize: 16,
        },
    });

    if (loading && !refreshing) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={candidates}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContent}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                ListEmptyComponent={<Text style={styles.emptyText}>No candidates found</Text>}
            />
        </View>
    );
}
