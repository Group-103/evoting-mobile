import React, { useState, useEffect, useCallback } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    RefreshControl,
    ActivityIndicator,
    TouchableOpacity,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import api from '../services/api';
import { useFocusEffect } from '@react-navigation/native';

export default function AuditLogScreen() {
    const { theme } = useTheme();
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [auditLogs, setAuditLogs] = useState([]);
    const [filter, setFilter] = useState('ALL'); // ALL, ADMIN, OFFICER, CANDIDATE, VOTER

    const fetchAuditLogs = async () => {
        try {
            const response = await api.get('/api/reports/audit');
            // Backend returns { logs: [...], pagination: {...} }
            const logs = Array.isArray(response.data?.logs)
                ? response.data.logs
                : Array.isArray(response.data)
                    ? response.data
                    : [];
            setAuditLogs(logs);
        } catch (error) {
            console.error('Failed to fetch audit logs:', error);
            setAuditLogs([]); // Set empty array on error
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchAuditLogs();
        }, [])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchAuditLogs();
    };

    // Ensure filteredLogs is always an array
    const filteredLogs = React.useMemo(() => {
        if (!Array.isArray(auditLogs)) return [];

        if (filter === 'ALL') {
            return auditLogs;
        }

        return auditLogs.filter(log =>
            log.actorType?.toUpperCase() === filter
        );
    }, [auditLogs, filter]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now - date;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;

        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getActionColor = (action) => {
        if (action?.includes('DELETE')) return '#ef4444';
        if (action?.includes('CREATE') || action?.includes('SUBMIT')) return '#10b981';
        if (action?.includes('APPROVE')) return '#3b82f6';
        if (action?.includes('REJECT')) return '#f59e0b';
        if (action?.includes('UPDATE')) return '#8b5cf6';
        return theme.colors.text;
    };

    const getActorIcon = (actorType) => {
        switch (actorType?.toLowerCase()) {
            case 'admin': return '👨‍💼';
            case 'officer': return '👮';
            case 'candidate': return '👤';
            case 'voter': return '🗳️';
            case 'system': return '⚙️';
            default: return '📝';
        }
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background,
        },
        loadingContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: theme.colors.background,
        },
        filterBar: {
            flexDirection: 'row',
            padding: 10,
            backgroundColor: theme.colors.card,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.border,
        },
        filterButton: {
            flex: 1,
            paddingVertical: 8,
            paddingHorizontal: 12,
            marginHorizontal: 4,
            borderRadius: 8,
            backgroundColor: theme.colors.background,
            borderWidth: 1,
            borderColor: theme.colors.border,
            alignItems: 'center',
        },
        filterButtonActive: {
            backgroundColor: theme.colors.primary,
            borderColor: theme.colors.primary,
        },
        filterButtonText: {
            fontSize: 12,
            fontWeight: '600',
            color: theme.colors.text,
        },
        filterButtonTextActive: {
            color: '#fff',
        },
        content: {
            padding: 15,
        },
        logCard: {
            backgroundColor: theme.colors.card,
            borderRadius: 12,
            padding: 15,
            marginBottom: 12,
            borderLeftWidth: 4,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 2,
        },
        logHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 8,
        },
        logAction: {
            fontSize: 16,
            fontWeight: 'bold',
            flex: 1,
        },
        logTime: {
            fontSize: 12,
            color: theme.colors.subtext,
        },
        logActor: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 6,
        },
        actorIcon: {
            fontSize: 16,
            marginRight: 6,
        },
        actorText: {
            fontSize: 14,
            color: theme.colors.subtext,
        },
        logDetails: {
            marginTop: 8,
            paddingTop: 8,
            borderTopWidth: 1,
            borderTopColor: theme.colors.border,
        },
        logDetailRow: {
            flexDirection: 'row',
            marginBottom: 4,
        },
        logDetailLabel: {
            fontSize: 13,
            color: theme.colors.subtext,
            fontWeight: '600',
            width: 80,
        },
        logDetailValue: {
            fontSize: 13,
            color: theme.colors.text,
            flex: 1,
        },
        emptyState: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 60,
        },
        emptyIcon: {
            fontSize: 64,
            marginBottom: 16,
        },
        emptyText: {
            fontSize: 16,
            color: theme.colors.subtext,
            textAlign: 'center',
        },
        statsBar: {
            backgroundColor: theme.colors.card,
            padding: 15,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.border,
        },
        statsText: {
            fontSize: 14,
            color: theme.colors.text,
            textAlign: 'center',
        },
    });

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text style={{ color: theme.colors.text, marginTop: 10 }}>Loading audit logs...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.filterBar}>
                {['ALL', 'ADMIN', 'OFFICER', 'CANDIDATE', 'VOTER'].map((filterType) => (
                    <TouchableOpacity
                        key={filterType}
                        style={[
                            styles.filterButton,
                            filter === filterType && styles.filterButtonActive
                        ]}
                        onPress={() => setFilter(filterType)}
                    >
                        <Text style={[
                            styles.filterButtonText,
                            filter === filterType && styles.filterButtonTextActive
                        ]}>
                            {filterType}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <View style={styles.statsBar}>
                <Text style={styles.statsText}>
                    Showing {filteredLogs.length} of {auditLogs.length} audit entries
                </Text>
            </View>

            <ScrollView
                contentContainerStyle={styles.content}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={theme.colors.primary}
                    />
                }
            >
                {filteredLogs.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyIcon}>📊</Text>
                        <Text style={styles.emptyText}>
                            {filter === 'ALL'
                                ? 'No audit logs yet'
                                : `No ${filter.toLowerCase()} activities found`}
                        </Text>
                    </View>
                ) : (
                    filteredLogs.map((log, index) => (
                        <View
                            key={log.id || index}
                            style={[
                                styles.logCard,
                                { borderLeftColor: getActionColor(log.action) }
                            ]}
                        >
                            <View style={styles.logHeader}>
                                <Text style={[styles.logAction, { color: getActionColor(log.action) }]}>
                                    {log.action?.replace(/_/g, ' ')}
                                </Text>
                                <Text style={styles.logTime}>
                                    {formatDate(log.createdAt)}
                                </Text>
                            </View>

                            <View style={styles.logActor}>
                                <Text style={styles.actorIcon}>
                                    {getActorIcon(log.actorType)}
                                </Text>
                                <Text style={styles.actorText}>
                                    {log.actorType?.toUpperCase() || 'SYSTEM'}
                                    {log.actorId && ` (ID: ${log.actorId.slice(0, 8)}...)`}
                                </Text>
                            </View>

                            {(log.entity || log.entityId || log.payload) && (
                                <View style={styles.logDetails}>
                                    {log.entity && (
                                        <View style={styles.logDetailRow}>
                                            <Text style={styles.logDetailLabel}>Entity:</Text>
                                            <Text style={styles.logDetailValue}>
                                                {log.entity.toUpperCase()}
                                            </Text>
                                        </View>
                                    )}
                                    {log.entityId && (
                                        <View style={styles.logDetailRow}>
                                            <Text style={styles.logDetailLabel}>ID:</Text>
                                            <Text style={styles.logDetailValue}>
                                                {log.entityId.slice(0, 12)}...
                                            </Text>
                                        </View>
                                    )}
                                    {log.payload && typeof log.payload === 'object' && (
                                        <>
                                            {log.payload.positionName && (
                                                <View style={styles.logDetailRow}>
                                                    <Text style={styles.logDetailLabel}>Position:</Text>
                                                    <Text style={styles.logDetailValue}>
                                                        {log.payload.positionName}
                                                    </Text>
                                                </View>
                                            )}
                                            {log.payload.candidateName && (
                                                <View style={styles.logDetailRow}>
                                                    <Text style={styles.logDetailLabel}>Candidate:</Text>
                                                    <Text style={styles.logDetailValue}>
                                                        {log.payload.candidateName}
                                                    </Text>
                                                </View>
                                            )}
                                            {log.payload.reason && (
                                                <View style={styles.logDetailRow}>
                                                    <Text style={styles.logDetailLabel}>Reason:</Text>
                                                    <Text style={styles.logDetailValue}>
                                                        {log.payload.reason}
                                                    </Text>
                                                </View>
                                            )}
                                        </>
                                    )}
                                </View>
                            )}
                        </View>
                    ))
                )}
            </ScrollView>
        </View>
    );
}
