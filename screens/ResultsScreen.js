import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, ScrollView, RefreshControl, ActivityIndicator, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import api from '../services/api';
import { useTheme } from '../contexts/ThemeContext';
import { useFocusEffect } from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;

export default function ResultsScreen() {
    const { theme } = useTheme();
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [results, setResults] = useState([]);
    const [summary, setSummary] = useState(null);

    const fetchResults = async () => {
        try {
            const response = await api.get('/results');
            setResults(response.data.positions || []);
            setSummary(response.data.summary || {});
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchResults();
        }, [])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchResults();
    };

    const renderChart = (position) => {
        if (!position.candidates || position.candidates.length === 0) return null;

        const labels = position.candidates.map(c => c.name.split(' ')[0]); // First name only for space
        const data = position.candidates.map(c => c.votes);

        return (
            <View key={position.positionId} style={[styles.card, { backgroundColor: theme.colors.card }]}>
                <Text style={[styles.positionTitle, { color: theme.colors.text }]}>{position.positionName}</Text>
                <Text style={[styles.subtitle, { color: theme.colors.subtext }]}>
                    Total Votes: {position.totalVotes}
                </Text>

                <BarChart
                    data={{
                        labels: labels,
                        datasets: [{ data: data }]
                    }}
                    width={screenWidth - 60}
                    height={220}
                    yAxisLabel=""
                    chartConfig={{
                        backgroundColor: theme.colors.card,
                        backgroundGradientFrom: theme.colors.card,
                        backgroundGradientTo: theme.colors.card,
                        decimalPlaces: 0,
                        color: (opacity = 1) => theme.colors.primary, // Using primary color
                        labelColor: (opacity = 1) => theme.colors.text,
                        style: {
                            borderRadius: 16
                        },
                        barPercentage: 0.7,
                    }}
                    style={{
                        marginVertical: 8,
                        borderRadius: 16
                    }}
                    fromZero
                />

                {position.candidates.map((candidate, index) => (
                    <View key={candidate.candidateId} style={styles.candidateRow}>
                        <Text style={[styles.rank, { color: theme.colors.text }]}>{index + 1}.</Text>
                        <Text style={[styles.name, { color: theme.colors.text }]}>{candidate.name}</Text>
                        <Text style={[styles.votes, { color: theme.colors.primary }]}>{candidate.votes} votes</Text>
                        <Text style={[styles.percent, { color: theme.colors.subtext }]}>{candidate.votePercentage}%</Text>
                    </View>
                ))}
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
        content: {
            padding: 15,
        },
        header: {
            marginBottom: 20,
        },
        headerTitle: {
            fontSize: 28,
            fontWeight: 'bold',
            color: theme.colors.text,
        },
        headerSubtitle: {
            fontSize: 16,
            color: theme.colors.subtext,
            marginTop: 5,
        },
        card: {
            borderRadius: 15,
            padding: 15,
            marginBottom: 20,
            elevation: 2,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
        },
        positionTitle: {
            fontSize: 20,
            fontWeight: 'bold',
            marginBottom: 5,
        },
        subtitle: {
            fontSize: 14,
            marginBottom: 15,
        },
        candidateRow: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 8,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.border,
        },
        rank: {
            width: 30,
            fontWeight: 'bold',
        },
        name: {
            flex: 1,
            fontSize: 16,
        },
        votes: {
            fontWeight: 'bold',
            marginRight: 10,
        },
        percent: {
            width: 50,
            textAlign: 'right',
        },
    });

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.content}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />
                }
            >
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Live Results</Text>
                    <Text style={styles.headerSubtitle}>
                        Total Votes Cast: {summary?.totalVotesCast || 0}
                    </Text>
                </View>

                {results.map(renderChart)}
            </ScrollView>
        </View>
    );
}

