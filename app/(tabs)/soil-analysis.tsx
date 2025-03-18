import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Platform, ImageBackground, ScrollView } from 'react-native';
import { Camera } from 'expo-camera';
import { Camera as CameraIcon, Toilet as Soil, Plane as Plant, Droplet, ThermometerSun } from 'lucide-react-native';
import * as ImageManipulator from 'expo-image-manipulator';

const soilTypes = {
  clay: {
    name: 'Clay Soil',
    characteristics: 'Dense, heavy, and slow-draining soil with high nutrient content',
    fertility: 'High fertility and good at retaining nutrients',
    waterRetention: 'Excellent water retention but poor drainage',
    bestCrops: ['Wheat', 'Cabbage', 'Broccoli', 'Brussels Sprouts'],
    recommendations: [
      'Add organic matter to improve drainage',
      'Avoid working soil when wet',
      'Consider raised beds for better drainage',
    ],
  },
  sandy: {
    name: 'Sandy Soil',
    characteristics: 'Light, warm, and well-draining soil with low nutrient content',
    fertility: 'Low fertility and needs frequent fertilization',
    waterRetention: 'Poor water retention, needs frequent watering',
    bestCrops: ['Carrots', 'Potatoes', 'Lettuce', 'Strawberries'],
    recommendations: [
      'Add organic matter to improve water retention',
      'Use mulch to prevent water evaporation',
      'Consider drip irrigation',
    ],
  },
  loamy: {
    name: 'Loam Soil',
    characteristics: 'Perfect balance of sand, silt, and clay',
    fertility: 'Excellent fertility with good nutrient balance',
    waterRetention: 'Good water retention and drainage',
    bestCrops: ['Corn', 'Tomatoes', 'Peppers', 'Most vegetables'],
    recommendations: [
      'Maintain organic matter content',
      'Practice crop rotation',
      'Use cover crops in off-season',
    ],
  },
};

const analyzeSoil = async (imageUri: string) => {
  try {
    const resizedImage = await ImageManipulator.manipulateAsync(
      imageUri,
      [{ resize: { width: 224, height: 224 } }],
      { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
    );

    // Simulate AI analysis with random selection for demo
    const soilTypes = ['clay', 'sandy', 'loamy'];
    return soilTypes[Math.floor(Math.random() * soilTypes.length)];
  } catch (error) {
    console.error('Error analyzing soil:', error);
    return 'clay';
  }
};

export default function SoilAnalysis() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [soilInfo, setSoilInfo] = useState<any>(null);
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

        const soilType = await analyzeSoil(photo.uri);
        setSoilInfo(soilTypes[soilType as keyof typeof soilTypes]);
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
        source={{ uri: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&w=1920' }}
        style={styles.container}
        imageStyle={styles.backgroundImage}>
        <View style={styles.overlay}>
          <TouchableOpacity
            style={styles.startButton}
            onPress={requestCameraPermission}>
            <CameraIcon color="#16a34a" size={32} />
            <Text style={styles.startButtonText}>Analyze Soil</Text>
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
      source={{ uri: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&w=1920' }}
      style={styles.container}
      imageStyle={styles.backgroundImage}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          {!image ? (
            <TouchableOpacity
              style={styles.startButton}
              onPress={requestCameraPermission}>
              <CameraIcon color="#16a34a" size={32} />
              <Text style={styles.startButtonText}>Analyze Soil</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.resultContainer}>
              <Image source={{ uri: image }} style={styles.previewImage} />
              {analyzing ? (
                <View style={styles.loadingContainer}>
                  <Text style={styles.loadingText}>Analyzing soil...</Text>
                </View>
              ) : soilInfo && (
                <View style={styles.soilInfo}>
                  <View style={styles.headerSection}>
                    <Soil size={32} color="#16a34a" />
                    <Text style={styles.soilTitle}>{soilInfo.name}</Text>
                  </View>

                  <View style={styles.infoCard}>
                    <View style={styles.cardHeader}>
                      <ThermometerSun size={24} color="#16a34a" />
                      <Text style={styles.cardTitle}>Characteristics</Text>
                    </View>
                    <Text style={styles.cardText}>{soilInfo.characteristics}</Text>
                  </View>

                  <View style={styles.infoCard}>
                    <View style={styles.cardHeader}>
                      <Plant size={24} color="#16a34a" />
                      <Text style={styles.cardTitle}>Fertility</Text>
                    </View>
                    <Text style={styles.cardText}>{soilInfo.fertility}</Text>
                  </View>

                  <View style={styles.infoCard}>
                    <View style={styles.cardHeader}>
                      <Droplet size={24} color="#16a34a" />
                      <Text style={styles.cardTitle}>Water Retention</Text>
                    </View>
                    <Text style={styles.cardText}>{soilInfo.waterRetention}</Text>
                  </View>

                  <View style={styles.infoCard}>
                    <Text style={styles.cardTitle}>Best Crops</Text>
                    <View style={styles.cropsList}>
                      {soilInfo.bestCrops.map((crop: string, index: number) => (
                        <View key={index} style={styles.cropItem}>
                          <Plant size={16} color="#16a34a" />
                          <Text style={styles.cropText}>{crop}</Text>
                        </View>
                      ))}
                    </View>
                  </View>

                  <View style={styles.infoCard}>
                    <Text style={styles.cardTitle}>Recommendations</Text>
                    {soilInfo.recommendations.map((rec: string, index: number) => (
                      <View key={index} style={styles.recommendationItem}>
                        <Text style={styles.recommendationNumber}>{index + 1}</Text>
                        <Text style={styles.recommendationText}>{rec}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
              <TouchableOpacity
                style={styles.newScanButton}
                onPress={() => {
                  setImage(null);
                  setSoilInfo(null);
                }}>
                <Text style={styles.newScanButtonText}>New Scan</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
  soilInfo: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  headerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  soilTitle: {
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
    color: '#111827',
    marginLeft: 12,
  },
  infoCard: {
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    color: '#111827',
    marginLeft: 8,
  },
  cardText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#4b5563',
    lineHeight: 20,
  },
  cropsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  cropItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e2e8f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    margin: 4,
  },
  cropText: {
    marginLeft: 6,
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#4b5563',
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  recommendationNumber: {
    backgroundColor: '#16a34a',
    color: '#ffffff',
    width: 24,
    height: 24,
    borderRadius: 12,
    textAlign: 'center',
    lineHeight: 24,
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    marginRight: 12,
  },
  recommendationText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#4b5563',
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