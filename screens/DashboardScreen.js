import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import api from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../contexts/ThemeContext';

export default function DashboardScreen({ navigation }) {
    const { theme } = useTheme();
    const [loading, setLoading] = useState(true);
    const [positions, setPositions] = useState([]);
    const [candidates, setCandidates] = useState([]);
    const [selections, setSelections] = useState({}); // { positionId: candidateId }
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchBallot();
    }, []);

    const fetchBallot = async () => {
        try {
            const token = await AsyncStorage.getItem('ballotToken');
            if (!token) {
                Alert.alert('Error', 'No ballot token found. Please login again.');
                navigation.replace('Login');
                return;
            }

            const response = await api.get('/api/vote/ballot', {
                params: { token },
            });

            const { positions: fetchedPositions, candidates: fetchedCandidates } = response.data;
            setPositions(fetchedPositions || []);
            setCandidates(fetchedCandidates || []);

        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to load ballot. ' + (error.response?.data?.error || ''));
            if (error.response?.status === 401 || error.response?.status === 404) {
                navigation.replace('Login');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSelect = (positionId, candidateId) => {
        setSelections(prev => ({
            ...prev,
            [positionId]: candidateId
        }));
    };

    const handleSubmitVote = async () => {
        const votes = Object.entries(selections).map(([positionId, candidateId]) => ({
            positionId,
            candidateId
        }));

        if (votes.length === 0) {
            Alert.alert('Error', 'Please select at least one candidate.');
            return;
        }

        Alert.alert(
            'Confirm Vote',
            'Are you sure you want to cast your vote? This cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Vote',
                    onPress: async () => {
                        setSubmitting(true);
                        try {
                            const token = await AsyncStorage.getItem('ballotToken');
                            await api.post('/api/vote', {
                                token,
                                votes
                            });

                            Alert.alert('Success', 'Your vote has been cast successfully!', [
                                { text: 'OK', onPress: () => navigation.replace('Login') }
                            ]);
                            await AsyncStorage.removeItem('ballotToken');
                        } catch (error) {
                            console.error(error);
                            Alert.alert('Error', error.response?.data?.error || 'Failed to cast vote');
                        } finally {
                            setSubmitting(false);
                        }
                    }
                }
            ]
        );
    };

    const renderCandidate = (candidate, positionId) => {
        const isSelected = selections[positionId] === candidate.id;
        return (
            <View key={candidate.id} style={styles.candidateRow}>
                <TouchableOpacity
                    style={[styles.candidateCard, isSelected && styles.selectedCard]}
                    onPress={() => handleSelect(positionId, candidate.id)}
                >
                    <Text style={[styles.candidateName, isSelected && styles.selectedText]}>{candidate.name}</Text>
                    <Text style={[styles.candidateProgram, { color: theme.colors.subtext }]}>{candidate.program}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.infoButton}
                    onPress={() => navigation.navigate('CandidateProfile', { candidate })}
                >
                    <Text style={styles.infoText}>i</Text>
                </TouchableOpacity>
            </View>
        );
    };

    const renderPosition = ({ item: position }) => {
        const positionCandidates = candidates.filter(c => c.positionId === position.id);

        return (
            <View style={[styles.positionContainer, { backgroundColor: theme.colors.card }]}>
                <Text style={[styles.positionTitle, { color: theme.colors.text }]}>{position.name}</Text>
                {positionCandidates.length > 0 ? (
                    positionCandidates.map(c => renderCandidate(c, position.id))
                ) : (
                    <Text style={styles.noCandidates}>No candidates for this position</Text>
                )}
            </View>
        );
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background,
        },
        center: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: theme.colors.background,
        },
        listContent: {
            padding: 15,
            paddingBottom: 30,
        },
        positionContainer: {
            borderRadius: 10,
            padding: 15,
            marginBottom: 20,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
        },
        positionTitle: {
            fontSize: 20,
            fontWeight: 'bold',
            marginBottom: 15,
        },
        candidateRow: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 10,
        },
        candidateCard: {
            flex: 1,
            padding: 15,
            borderWidth: 1,
            borderColor: theme.colors.border,
            borderRadius: 8,
            backgroundColor: theme.colors.card,
            marginRight: 10,
        },
        selectedCard: {
            borderColor: theme.colors.primary,
            backgroundColor: theme.dark ? '#0a84ff20' : '#e6f2ff',
        },
        candidateName: {
            fontSize: 16,
            color: theme.colors.text,
            fontWeight: 'bold',
        },
        candidateProgram: {
            fontSize: 14,
            marginTop: 2,
        },
        selectedText: {
            color: theme.colors.primary,
        },
        noCandidates: {
            fontStyle: 'italic',
            color: theme.colors.subtext,
        },
        submitButton: {
            backgroundColor: theme.colors.primary,
            padding: 15,
            borderRadius: 8,
            alignItems: 'center',
            marginTop: 10,
        },
        buttonDisabled: {
            opacity: 0.7,
        },
        submitButtonText: {
            color: '#fff',
            fontSize: 18,
            fontWeight: 'bold',
        },
        infoButton: {
            width: 30,
            height: 30,
            borderRadius: 15,
            borderWidth: 1,
            borderColor: theme.colors.primary,
            alignItems: 'center',
            justifyContent: 'center',
        },
        infoText: {
            color: theme.colors.primary,
            fontWeight: 'bold',
            fontStyle: 'italic',
        },
        header: {
            backgroundColor: theme.colors.card,
            padding: 20,
            paddingTop: 50,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.border,
        },
        headerTitle: {
            fontSize: 28,
            fontWeight: 'bold',
            color: theme.colors.text,
            marginBottom: 5,
        },
        headerSubtitle: {
            fontSize: 14,
            color: theme.colors.subtext,
            marginBottom: 15,
        },
        progressContainer: {
            marginTop: 10,
        },
        progressText: {
            fontSize: 12,
            color: theme.colors.text,
            marginBottom: 5,
            fontWeight: '500',
        },
        progressBar: {
            height: 8,
            backgroundColor: theme.colors.border,
            borderRadius: 4,
            overflow: 'hidden',
        },
        progressFill: {
            height: '100%',
            borderRadius: 4,
        },
        emptyState: {
            alignItems: 'center',
            justifyContent: 'center',
            padding: 40,
            marginTop: 50,
        },
        emptyIcon: {
            fontSize: 80,
            marginBottom: 20,
        },
        emptyTitle: {
            fontSize: 20,
            fontWeight: 'bold',
            color: theme.colors.text,
            marginBottom: 10,
        },
        emptyMessage: {
            fontSize: 14,
            color: theme.colors.subtext,
            textAlign: 'center',
            lineHeight: 22,
        },
        footer: {
            backgroundColor: theme.colors.primary + '15',
            padding: 15,
            borderRadius: 8,
            marginBottom: 15,
        },
        footerText: {
            fontSize: 14,
            color: theme.colors.text,
            textAlign: 'center',
            fontWeight: '500',
        },
    });

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text style={{ color: theme.colors.text, marginTop: 20 }}>Loading ballot...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header Section */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Your Ballot</Text>
                <Text style={styles.headerSubtitle}>
                    {positions.length > 0
                        ? `Select candidates for ${positions.length} position${positions.length !== 1 ? 's' : ''}`
                        : 'No positions available for voting'}
                </Text>
                {positions.length > 0 && (
                    <View style={styles.progressContainer}>
                        <Text style={styles.progressText}>
                            Progress: {Object.keys(selections).length} of {positions.length} selected
                        </Text>
                        <View style={styles.progressBar}>
                            <View style={[
                                styles.progressFill,
                                {
                                    width: `${(Object.keys(selections).length / positions.length) * 100}%`,
                                    backgroundColor: theme.colors.primary
                                }
                            ]} />
                        </View>
                    </View>
                )}
            </View>

            <FlatList
                data={positions}
                renderItem={renderPosition}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyIcon}>🗳️</Text>
                        <Text style={styles.emptyTitle}>No Positions Available</Text>
                        <Text style={styles.emptyMessage}>
                            There are currently no active voting positions. Please check back later or contact an administrator.
                        </Text>
                    </View>
                }
                ListFooterComponent={
                    positions.length > 0 ? (
                        <View>
                            <View style={styles.footer}>
                                <Text style={styles.footerText}>
                                    ℹ️ You have selected {Object.keys(selections).length} of {positions.length} positions
                                </Text>
                            </View>
                            <TouchableOpacity
                                style={[styles.submitButton, submitting && styles.buttonDisabled]}
                                onPress={handleSubmitVote}
                                disabled={submitting}
                            >
                                {submitting ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <Text style={styles.submitButtonText}>Submit Vote</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    ) : null
                }
            />
        </View>
    );
}
