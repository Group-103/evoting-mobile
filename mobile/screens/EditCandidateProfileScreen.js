import React, { useState, useEffect, useCallback } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Alert,
    ActivityIndicator,
    Image,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../contexts/ThemeContext';
import { useFocusEffect } from '@react-navigation/native';
import api from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';

export default function EditCandidateProfileScreen({ navigation, route }) {
    const { theme } = useTheme();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [candidateData, setCandidateData] = useState(null);
    const [positions, setPositions] = useState([]);
    const [selectedPositionId, setSelectedPositionId] = useState('');
    const [slogan, setSlogan] = useState('');
    const [selectedManifesto, setSelectedManifesto] = useState(null);
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [isNewNomination, setIsNewNomination] = useState(false);

    useFocusEffect(
        useCallback(() => {
            loadData();
            requestPermissions();
        }, [])
    );

    const requestPermissions = async () => {
        const { status: imageStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();

        if (imageStatus !== 'granted' || cameraStatus !== 'granted') {
            Alert.alert('Permission Required', 'Please grant camera and media library permissions to upload photos.');
        }
    };

    const loadData = async () => {
        try {
            // Load positions for dropdown
            const positionsRes = await api.get('/positions');
            setPositions(positionsRes.data || []);

            // Try to load existing candidate data
            try {
                const response = await api.get('/candidates/my');
                if (response.data && response.data.length > 0) {
                    const candidate = response.data[0];
                    setCandidateData(candidate);
                    setSlogan(candidate.slogan || '');
                    setSelectedPositionId(candidate.positionId || '');
                    setIsNewNomination(false);
                } else {
                    setIsNewNomination(true);
                }
            } catch (error) {
                // No candidate profile yet - show nomination form
                setIsNewNomination(true);
            }
        } catch (error) {
            console.error('Failed to load data:', error);
            Alert.alert('Error', 'Failed to load data');
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

    const handleSubmitNomination = async () => {
        // Validation
        if (!selectedPositionId) {
            Alert.alert('Error', 'Please select a position to run for');
            return;
        }

        if (!slogan.trim()) {
            Alert.alert('Error', 'Please enter a campaign slogan');
            return;
        }

        if (!selectedManifesto) {
            Alert.alert('Error', 'Please upload your manifesto PDF');
            return;
        }

        setSaving(true);

        try {
            const formData = new FormData();
            formData.append('positionId', selectedPositionId);
            formData.append('slogan', slogan.trim());

            // Add manifesto
            formData.append('manifesto', {
                uri: selectedManifesto.uri,
                type: 'application/pdf',
                name: selectedManifesto.name || 'manifesto.pdf',
            });

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

            // Submit nomination
            await api.post('/candidates', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            Alert.alert(
                'Nomination Submitted! 🎉',
                'Your nomination has been submitted for review. You will be notified once it is approved.',
                [
                    {
                        text: 'OK',
                        onPress: () => navigation.goBack(),
                    },
                ]
            );
        } catch (error) {
            console.error('Nomination error:', error);
            const errorMsg = error.response?.data?.error || 'Failed to submit nomination';
            Alert.alert('Error', errorMsg);
        } finally {
            setSaving(false);
        }
    };

    const handleUpdateProfile = async () => {
        if (!candidateData) {
            Alert.alert('Error', 'No candidate data found');
            return;
        }

        if (!selectedManifesto && !selectedPhoto && slogan === (candidateData.slogan || '')) {
            Alert.alert('No Changes', 'Please make some changes to update');
            return;
        }

        setSaving(true);

        try {
            const formData = new FormData();

            // Add slogan if changed
            if (slogan !== (candidateData.slogan || '')) {
                formData.append('slogan', slogan.trim());
            }

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
            await api.put(`/candidates/${candidateData.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            Alert.alert(
                'Profile Updated! ✓',
                'Your profile has been updated successfully.',
                [
                    {
                        text: 'OK',
                        onPress: () => navigation.goBack(),
                    },
                ]
            );
        } catch (error) {
            console.error('Update error:', error);
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
        headerCard: {
            backgroundColor: theme.colors.primary,
            borderRadius: 16,
            padding: 20,
            marginBottom: 20,
        },
        headerTitle: {
            color: '#fff',
            fontSize: 22,
            fontWeight: 'bold',
            marginBottom: 5,
        },
        headerSubtitle: {
            color: 'rgba(255,255,255,0.8)',
            fontSize: 14,
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
        input: {
            backgroundColor: theme.colors.card,
            borderWidth: 1,
            borderColor: theme.colors.border,
            borderRadius: 12,
            padding: 15,
            fontSize: 16,
            color: theme.colors.text,
            marginBottom: 15,
        },
        textArea: {
            minHeight: 80,
            textAlignVertical: 'top',
        },
        pickerContainer: {
            backgroundColor: theme.colors.card,
            borderWidth: 1,
            borderColor: theme.colors.border,
            borderRadius: 12,
            marginBottom: 15,
            overflow: 'hidden',
        },
        picker: {
            color: theme.colors.text,
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
        submitButton: {
            backgroundColor: theme.colors.primary,
            padding: 18,
            borderRadius: 12,
            alignItems: 'center',
            marginTop: 10,
            marginBottom: 40,
        },
        submitButtonDisabled: {
            backgroundColor: theme.colors.border,
        },
        submitButtonText: {
            color: '#fff',
            fontWeight: 'bold',
            fontSize: 18,
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
        requiredStar: {
            color: '#ef4444',
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

    // === NEW NOMINATION FORM ===
    if (isNewNomination) {
        return (
            <View style={styles.container}>
                <ScrollView contentContainerStyle={styles.content}>
                    <View style={styles.headerCard}>
                        <Text style={styles.headerTitle}>Submit Nomination 📝</Text>
                        <Text style={styles.headerSubtitle}>
                            Complete the form below to submit your candidacy
                        </Text>
                    </View>

                    {/* Position Selection */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>
                            Position <Text style={styles.requiredStar}>*</Text>
                        </Text>
                        <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={selectedPositionId}
                                onValueChange={(value) => setSelectedPositionId(value)}
                                style={styles.picker}
                            >
                                <Picker.Item label="-- Select Position --" value="" />
                                {positions.map((pos) => (
                                    <Picker.Item key={pos.id} label={pos.name} value={pos.id} />
                                ))}
                            </Picker>
                        </View>
                    </View>

                    {/* Campaign Slogan */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>
                            Campaign Slogan <Text style={styles.requiredStar}>*</Text>
                        </Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            value={slogan}
                            onChangeText={setSlogan}
                            placeholder="Enter your campaign slogan..."
                            placeholderTextColor={theme.colors.subtext}
                            multiline
                            numberOfLines={3}
                        />
                    </View>

                    {/* Profile Photo */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Profile Photo</Text>
                        <View style={styles.fileCard}>
                            {selectedPhoto ? (
                                <Image source={{ uri: selectedPhoto.uri }} style={styles.photoPreview} />
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
                                    <Text style={styles.selectedText}>✓ Photo selected</Text>
                                </View>
                            )}
                        </View>
                    </View>

                    {/* Manifesto PDF */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>
                            Manifesto (PDF) <Text style={styles.requiredStar}>*</Text>
                        </Text>
                        <View style={styles.fileCard}>
                            <Text style={styles.fileIcon}>📄</Text>
                            {selectedManifesto ? (
                                <Text style={styles.fileName}>{selectedManifesto.name}</Text>
                            ) : (
                                <Text style={styles.fileName}>No file selected</Text>
                            )}
                            <TouchableOpacity style={styles.pickButton} onPress={pickManifesto}>
                                <Text style={styles.pickButtonText}>
                                    {selectedManifesto ? 'Change PDF' : 'Upload PDF'}
                                </Text>
                            </TouchableOpacity>
                            {selectedManifesto && (
                                <View style={styles.selectedBadge}>
                                    <Text style={styles.selectedText}>✓ PDF selected</Text>
                                </View>
                            )}
                        </View>
                    </View>

                    <TouchableOpacity
                        style={[styles.submitButton, saving && styles.submitButtonDisabled]}
                        onPress={handleSubmitNomination}
                        disabled={saving}
                    >
                        {saving ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.submitButtonText}>Submit Nomination 🚀</Text>
                        )}
                    </TouchableOpacity>
                </ScrollView>
            </View>
        );
    }

    // === EDIT EXISTING PROFILE ===
    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.headerCard}>
                    <Text style={styles.headerTitle}>Edit Profile ✏️</Text>
                    <Text style={styles.headerSubtitle}>
                        Update your campaign information
                    </Text>
                </View>

                <View style={styles.noteCard}>
                    <Text style={styles.noteText}>
                        💡 Your name and program are synced from your account. You can update your slogan, manifesto, and profile photo here.
                    </Text>
                </View>

                {/* Current Info */}
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
                    <View style={styles.infoCard}>
                        <Text style={styles.infoLabel}>Status</Text>
                        <Text style={[styles.infoValue, { color: candidateData.status === 'APPROVED' ? '#10b981' : '#f59e0b' }]}>
                            {candidateData.status}
                        </Text>
                    </View>
                </View>

                {/* Campaign Slogan */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Campaign Slogan</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        value={slogan}
                        onChangeText={setSlogan}
                        placeholder="Update your campaign slogan..."
                        placeholderTextColor={theme.colors.subtext}
                        multiline
                        numberOfLines={3}
                    />
                </View>

                {/* Profile Photo */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Profile Photo</Text>
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

                {/* Manifesto PDF */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Manifesto</Text>
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
                    style={[styles.submitButton, saving && styles.submitButtonDisabled]}
                    onPress={handleUpdateProfile}
                    disabled={saving}
                >
                    {saving ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.submitButtonText}>Save Changes</Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}
