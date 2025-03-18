import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Platform, ImageBackground } from 'react-native';
import { Camera } from 'expo-camera';
import { Camera as CameraIcon } from 'lucide-react-native';
import * as ImageManipulator from 'expo-image-manipulator';

// Mock disease database with multiple diseases and their characteristics
const diseaseDatabase = {
  'leaf_spots': {
    name: 'Leaf Spot Disease',
    cause: 'Fungal infection (Cercospora or Alternaria)',
    symptoms: 'Brown or black spots on leaves with yellow halos',
    treatment: 'Apply copper-based fungicide, remove infected leaves',
    prevention: 'Improve air circulation, avoid overhead watering'
  },
  'powdery_mildew': {
    name: 'Powdery Mildew',
    cause: 'Fungal pathogen (Erysiphales)',
    symptoms: 'White powdery coating on leaves and stems',
    treatment: 'Apply sulfur-based fungicide, increase plant spacing',
    prevention: 'Plant resistant varieties, maintain good air flow'
  },
  'blight': {
    name: 'Early Blight',
    cause: 'Alternaria solani fungus',
    symptoms: 'Dark brown spots with concentric rings on leaves',
    treatment: 'Remove infected plants, apply appropriate fungicide',
    prevention: 'Crop rotation, proper plant spacing'
  },
  'healthy': {
    name: 'Healthy Plant',
    cause: 'N/A',
    symptoms: 'No visible disease symptoms',
    treatment: 'Continue regular maintenance',
    prevention: 'Maintain good cultural practices'
  }
};

// Simple image analysis function (mock)
const analyzeImage = async (imageUri: string) => {
  try {
    // Simulate image processing
    const resizedImage = await ImageManipulator.manipulateAsync(
      imageUri,
      [{ resize: { width: 224, height: 224 } }],
      { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
    );

    // Generate random values for different features
    const features = {
      color: Math.random(),
      texture: Math.random(),
      spots: Math.random(),
      edges: Math.random()
    };

    // Decision logic based on image features
    if (features.spots > 0.7) {
      return 'leaf_spots';
    } else if (features.color > 0.8) {
      return 'powdery_mildew';
    } else if (features.texture > 0.75) {
      return 'blight';
    } else {
      return 'healthy';
    }
  } catch (error) {
    console.error('Error analyzing image:', error);
    return 'leaf_spots'; // Default fallback
  }
};

export default function DiseaseDetection() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [diseaseInfo, setDiseaseInfo] = useState<any>(null);
  const [cameraRef, setCameraRef] = useState<Camera | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  const requestCameraPermission = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === 'granted');
    if (status === 'granted') {
      setShowCamera(true);
    }
  };

  const handleCapture = async () => {
    if (cameraRef) {
      try {
        const photo = await cameraRef.takePictureAsync();
        setImage(photo.uri);
        setShowCamera(false);
        setAnalyzing(true);

        // Analyze the captured image
        const diseaseType = await analyzeImage(photo.uri);
        setDiseaseInfo(diseaseDatabase[diseaseType]);
        setAnalyzing(false);
      } catch (error) {
        console.error('Error taking picture:', error);
        setAnalyzing(false);
      }
    }
  };

  if (Platform.OS === 'web' && !hasPermission) {
    return (
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1920' }}
        style={styles.container}
        imageStyle={styles.backgroundImage}>
        <View style={styles.overlay}>
          <TouchableOpacity
            style={styles.startButton}
            onPress={requestCameraPermission}>
            <CameraIcon color="#16a34a" size={32} />
            <Text style={styles.startButtonText}>Allow Camera Access</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    );
  }

  if (showCamera) {
    return (
      <View style={styles.cameraContainer}>
        <Camera
          ref={(ref) => setCameraRef(ref)}
          style={styles.camera}
          type={Camera.Constants.Type.back}>
          <View style={styles.cameraButtons}>
            <TouchableOpacity
              style={styles.captureButton}
              onPress={handleCapture}>
              <CameraIcon color="white" size={32} />
            </TouchableOpacity>
          </View>
        </Camera>
      </View>
    );
  }

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1920' }}
      style={styles.container}
      imageStyle={styles.backgroundImage}>
      <View style={styles.overlay}>
        {!image ? (
          <TouchableOpacity
            style={styles.startButton}
            onPress={requestCameraPermission}>
            <CameraIcon color="#16a34a" size={32} />
            <Text style={styles.startButtonText}>Scan Plant Disease</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.resultContainer}>
            <Image source={{ uri: image }} style={styles.previewImage} />
            {analyzing ? (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Analyzing image...</Text>
              </View>
            ) : diseaseInfo && (
              <View style={styles.diseaseInfo}>
                <Text style={styles.diseaseTitle}>{diseaseInfo.name}</Text>
                <View style={styles.infoSection}>
                  <Text style={styles.sectionTitle}>Cause:</Text>
                  <Text style={styles.sectionText}>{diseaseInfo.cause}</Text>
                </View>
                <View style={styles.infoSection}>
                  <Text style={styles.sectionTitle}>Symptoms:</Text>
                  <Text style={styles.sectionText}>{diseaseInfo.symptoms}</Text>
                </View>
                <View style={styles.infoSection}>
                  <Text style={styles.sectionTitle}>Treatment:</Text>
                  <Text style={styles.sectionText}>{diseaseInfo.treatment}</Text>
                </View>
                <View style={styles.infoSection}>
                  <Text style={styles.sectionTitle}>Prevention:</Text>
                  <Text style={styles.sectionText}>{diseaseInfo.prevention}</Text>
                </View>
              </View>
            )}
            <TouchableOpacity
              style={styles.newScanButton}
              onPress={() => {
                setImage(null);
                setDiseaseInfo(null);
              }}>
              <Text style={styles.newScanButtonText}>New Scan</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    opacity: 0.3,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  cameraContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  cameraButtons: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginBottom: 40,
  },
  captureButton: {
    backgroundColor: '#16a34a',
    padding: 20,
    borderRadius: 50,
  },
  startButton: {
    backgroundColor: '#ffffff',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  startButtonText: {
    marginTop: 12,
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: '#16a34a',
  },
  resultContainer: {
    width: '100%',
    maxWidth: 600,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 20,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: '#16a34a',
  },
  diseaseInfo: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  diseaseTitle: {
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
    color: '#111827',
    marginBottom: 16,
  },
  infoSection: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: '#374151',
    marginBottom: 4,
  },
  sectionText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#6b7280',
    lineHeight: 20,
  },
  newScanButton: {
    backgroundColor: '#16a34a',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  newScanButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
});