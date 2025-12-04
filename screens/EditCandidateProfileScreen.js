import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    Image,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../contexts/ThemeContext';
import api from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function EditCandidateProfileScreen({ navigation, route }) {
    const { theme } = useTheme();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [candidateData, setCandidateData] = useState(null);
    const [selectedManifesto, setSelectedManifesto] = useState(null);
    const [selectedPhoto, setSelectedPhoto] = useState(null);

    useEffect(() => {
        loadCandidateData();
        requestPermissions();
    }, []);

    const requestPermissions = async () => {
        const { status: imageStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();

        if (imageStatus !== 'granted' || cameraStatus !== 'granted') {
            Alert.alert('Permission Required', 'Please grant camera and media library permissions to upload photos.');
        }
    };

    const loadCandidateData = async () => {
        try {
            const response = await api.get('/api/candidates/my');
            if (response.data && response.data.length > 0) {
                setCandidateData(response.data[0]);
            }
        } catch (error) {
            console.error('Failed to load candidate data:', error);
            Alert.alert('Error', 'Failed to load your profile data');
        } finally {
            setLoading(false);
        }
    };

    const pickManifesto = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: 'application/pdf',
                copyToCacheDirectory: true,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const file = result.assets[0];

                // Check file size (10MB limit)
                if (file.size && file.size > 10 * 1024 * 1024) {
                    Alert.alert('File Too Large', 'Manifesto must be less than 10MB');
                    return;
                }

                setSelectedManifesto(file);
                Alert.alert('Success', `Selected: ${file.name}`);
            }
        } catch (error) {
            console.error('Error picking manifesto:', error);
            Alert.alert('Error', 'Failed to select manifesto file');
        }
    };

    const pickPhoto = async () => {
        Alert.alert(
            'Select Photo',
            'Choose photo source',
            [
                {
                    text: 'Camera',
                    onPress: async () => {
                        const result = await ImagePicker.launchCameraAsync({
                            mediaTypes: ImagePicker.MediaTypeOptions.Images,
                            allowsEditing: true,
                            aspect: [1, 1],
                            quality: 0.8,
                        });
                        handlePhotoResult(result);
                    },
                },
                {
                    text: 'Gallery',
                    onPress: async () => {
                        const result = await ImagePicker.launchImageLibraryAsync({
                            mediaTypes: ImagePicker.MediaTypeOptions.Images,
                            allowsEditing: true,
                            aspect: [1, 1],
                            quality: 0.8,
                        });
                        handlePhotoResult(result);
                    },
                },
                { text: 'Cancel', style: 'cancel' },
            ]
        );
    };

    const handlePhotoResult = (result) => {
        if (!result.canceled && result.assets && result.assets.length > 0) {
            setSelectedPhoto(result.assets[0]);
            Alert.alert('Success', 'Photo selected successfully');
        }
    };

    const handleSave = async () => {
        if (!candidateData) {
            Alert.alert('Error', 'No candidate data found');
            return;
        }

        if (!selectedManifesto && !selectedPhoto) {
            Alert.alert('No Changes', 'Please select at least one file to update');
            return;
        }

        setSaving(true);

        try {
            const formData = new FormData();

            // Add manifesto if selected
            if (selectedManifesto) {
                formData.append('manifesto', {
                    uri: selectedManifesto.uri,
                    type: 'application/pdf',
                    name: selectedManifesto.name || 'manifesto.pdf',
                });
            }

            // Add photo if selected
            if (selectedPhoto) {
                const photoUri = selectedPhoto.uri;
                const photoName = photoUri.split('/').pop() || 'photo.jpg';
                const photoType = `image/${photoName.split('.').pop()}`;

                formData.append('photo', {
                    uri: photoUri,
                    type: photoType,
                    name: photoName,
                });
            }

            // Make the API call
            const response = await api.put(`/api/candidates/${candidateData.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            Alert.alert(
                'Success',
                'Your profile has been updated successfully!',
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            navigation.goBack();
                        },
                    },
                ]
            );
        } catch (error) {
            console.error('Save error:', error);
            const errorMsg = error.response?.data?.error || 'Failed to update profile';
            Alert.alert('Error', errorMsg);
        } finally {
            setSaving(false);
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
        section: {
            marginBottom: 25,
        },
        sectionTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: theme.colors.text,
            marginBottom: 12,
        },
        infoCard: {
            backgroundColor: theme.colors.card,
            borderRadius: 12,
            padding: 15,
            marginBottom: 15,
        },
        infoLabel: {
            fontSize: 12,
            color: theme.colors.subtext,
            marginBottom: 4,
        },
        infoValue: {
            fontSize: 16,
            color: theme.colors.text,
            fontWeight: '500',
        },
        fileCard: {
            backgroundColor: theme.colors.card,
            borderRadius: 12,
            padding: 20,
            marginBottom: 15,
            alignItems: 'center',
        },
        fileIcon: {
            fontSize: 48,
            marginBottom: 10,
        },
        fileName: {
            fontSize: 14,
            color: theme.colors.text,
            marginBottom: 15,
            textAlign: 'center',
        },
        pickButton: {
            backgroundColor: theme.colors.primary,
            paddingHorizontal: 20,
            paddingVertical: 12,
            borderRadius: 8,
        },
        pickButtonText: {
            color: '#fff',
            fontWeight: 'bold',
            fontSize: 14,
        },
        selectedBadge: {
            backgroundColor: '#10b981',
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 12,
            marginTop: 10,
        },
        selectedText: {
            color: '#fff',
            fontSize: 12,
            fontWeight: 'bold',
        },
        photoPreview: {
            width: 120,
            height: 120,
            borderRadius: 60,
            marginBottom: 15,
        },
        saveButton: {
            backgroundColor: theme.colors.primary,
            padding: 16,
            borderRadius: 12,
            alignItems: 'center',
            marginTop: 10,
            marginBottom: 40,
        },
        saveButtonDisabled: {
            backgroundColor: theme.colors.border,
        },
        saveButtonText: {
            color: '#fff',
            fontWeight: 'bold',
            fontSize: 16,
        },
        loadingContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: theme.colors.background,
        },
        noteCard: {
            backgroundColor: theme.colors.primary + '20',
            borderLeftWidth: 4,
            borderLeftColor: theme.colors.primary,
            padding: 15,
            borderRadius: 8,
            marginBottom: 20,
        },
        noteText: {
            fontSize: 13,
            color: theme.colors.text,
            lineHeight: 20,
        },
    });

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text style={{ color: theme.colors.text, marginTop: 10 }}>Loading...</Text>
            </View>
        );
    }

    if (!candidateData) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={{ color: theme.colors.text, fontSize: 16 }}>
                    No candidate profile found
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.noteCard}>
                    <Text style={styles.noteText}>
                        📝 Note: Your name and program are synced from your user account. You can update your manifesto PDF and profile photo here.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Current Information</Text>
                    <View style={styles.infoCard}>
                        <Text style={styles.infoLabel}>Name</Text>
                        <Text style={styles.infoValue}>{candidateData.name}</Text>
                    </View>
                    <View style={styles.infoCard}>
                        <Text style={styles.infoLabel}>Program</Text>
                        <Text style={styles.infoValue}>{candidateData.program}</Text>
                    </View>
                    <View style={styles.infoCard}>
                        <Text style={styles.infoLabel}>Position</Text>
                        <Text style={styles.infoValue}>{candidateData.position?.name || 'N/A'}</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Update Profile Photo</Text>
                    <View style={styles.fileCard}>
                        {selectedPhoto ? (
                            <Image source={{ uri: selectedPhoto.uri }} style={styles.photoPreview} />
                        ) : candidateData.photoUrl ? (
                            <Text style={styles.fileName}>Current photo uploaded</Text>
                        ) : (
                            <Text style={styles.fileIcon}>📷</Text>
                        )}
                        <TouchableOpacity style={styles.pickButton} onPress={pickPhoto}>
                            <Text style={styles.pickButtonText}>
                                {selectedPhoto ? 'Change Photo' : 'Select Photo'}
                            </Text>
                        </TouchableOpacity>
                        {selectedPhoto && (
                            <View style={styles.selectedBadge}>
                                <Text style={styles.selectedText}>✓ New photo selected</Text>
                            </View>
                        )}
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Update Manifesto</Text>
                    <View style={styles.fileCard}>
                        <Text style={styles.fileIcon}>📄</Text>
                        {selectedManifesto ? (
                            <Text style={styles.fileName}>{selectedManifesto.name}</Text>
                        ) : candidateData.manifestoUrl ? (
                            <Text style={styles.fileName}>Current manifesto on file</Text>
                        ) : (
                            <Text style={styles.fileName}>No manifesto uploaded</Text>
                        )}
                        <TouchableOpacity style={styles.pickButton} onPress={pickManifesto}>
                            <Text style={styles.pickButtonText}>
                                {selectedManifesto ? 'Change PDF' : 'Select PDF'}
                            </Text>
                        </TouchableOpacity>
                        {selectedManifesto && (
                            <View style={styles.selectedBadge}>
                                <Text style={styles.selectedText}>✓ New PDF selected</Text>
                            </View>
                        )}
                    </View>
                </View>

                <TouchableOpacity
                    style={[styles.saveButton, (saving || (!selectedManifesto && !selectedPhoto)) && styles.saveButtonDisabled]}
                    onPress={handleSave}
                    disabled={saving || (!selectedManifesto && !selectedPhoto)}
                >
                    {saving ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.saveButtonText}>Save Changes</Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}
