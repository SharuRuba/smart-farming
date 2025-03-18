import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, ImageBackground } from 'react-native';
import * as Location from 'expo-location';
import { Sun, Cloud, CloudRain, Droplets, Sunrise, Sunset } from 'lucide-react-native';

export default function Weather() {
  const [loading, setLoading] = useState(true);
  const [weatherData, setWeatherData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setError('Permission to access location was denied');
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        // Here you would typically make an API call to a weather service
        // For demo purposes, we'll set mock data
        setWeatherData({
          current: {
            temp: 25,
            humidity: 65,
            condition: 'Partly Cloudy',
            windSpeed: 12,
          },
          forecast: [
            { day: 'Monday', temp: 24, condition: 'Sunny' },
            { day: 'Tuesday', temp: 26, condition: 'Cloudy' },
            { day: 'Wednesday', temp: 23, condition: 'Rain' },
            { day: 'Thursday', temp: 25, condition: 'Partly Cloudy' },
            { day: 'Friday', temp: 27, condition: 'Sunny' },
            { day: 'Saturday', temp: 26, condition: 'Sunny' },
            { day: 'Sunday', temp: 24, condition: 'Rain' },
          ],
          soil: {
            moisture: 75,
            evaporation: 3.2,
          },
          sun: {
            sunrise: '6:30 AM',
            sunset: '7:45 PM',
          },
        });
      } catch (err) {
        setError('Error fetching weather data');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?auto=format&fit=crop&w=1920' }}
        style={styles.container}
        imageStyle={styles.backgroundImage}>
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#16a34a" />
        </View>
      </ImageBackground>
    );
  }

  if (error) {
    return (
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?auto=format&fit=crop&w=1920' }}
        style={styles.container}
        imageStyle={styles.backgroundImage}>
        <View style={styles.overlay}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?auto=format&fit=crop&w=1920' }}
      style={styles.container}
      imageStyle={styles.backgroundImage}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <View style={styles.currentWeather}>
            <Text style={styles.temperature}>{weatherData.current.temp}°C</Text>
            <Text style={styles.condition}>{weatherData.current.condition}</Text>
            <View style={styles.currentDetails}>
              <View style={styles.detailItem}>
                <Droplets size={24} color="#16a34a" />
                <Text style={styles.detailText}>{weatherData.current.humidity}%</Text>
                <Text style={styles.detailLabel}>Humidity</Text>
              </View>
              <View style={styles.detailItem}>
                <Cloud size={24} color="#16a34a" />
                <Text style={styles.detailText}>{weatherData.current.windSpeed} km/h</Text>
                <Text style={styles.detailLabel}>Wind Speed</Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>7-Day Forecast</Text>
            {weatherData.forecast.map((day: any, index: number) => (
              <View key={index} style={styles.forecastDay}>
                <Text style={styles.dayText}>{day.day}</Text>
                <Text style={styles.tempText}>{day.temp}°C</Text>
                <Text style={styles.conditionText}>{day.condition}</Text>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Soil Conditions</Text>
            <View style={styles.soilInfo}>
              <View style={styles.soilItem}>
                <CloudRain size={24} color="#16a34a" />
                <Text style={styles.soilValue}>{weatherData.soil.moisture}%</Text>
                <Text style={styles.soilLabel}>Soil Moisture</Text>
              </View>
              <View style={styles.soilItem}>
                <Sun size={24} color="#16a34a" />
                <Text style={styles.soilValue}>{weatherData.soil.evaporation} mm/day</Text>
                <Text style={styles.soilLabel}>Evaporation Rate</Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sun Timings</Text>
            <View style={styles.sunInfo}>
              <View style={styles.sunItem}>
                <Sunrise size={24} color="#16a34a" />
                <Text style={styles.sunTime}>{weatherData.sun.sunrise}</Text>
                <Text style={styles.sunLabel}>Sunrise</Text>
              </View>
              <View style={styles.sunItem}>
                <Sunset size={24} color="#16a34a" />
                <Text style={styles.sunTime}>{weatherData.sun.sunset}</Text>
                <Text style={styles.sunLabel}>Sunset</Text>
              </View>
            </View>
          </View>
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
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  currentWeather: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 24,
    alignItems: 'center',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  temperature: {
    fontSize: 48,
    fontFamily: 'Inter_700Bold',
    color: '#111827',
  },
  condition: {
    fontSize: 20,
    fontFamily: 'Inter_600SemiBold',
    color: '#374151',
    marginTop: 8,
  },
  currentDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 24,
  },
  detailItem: {
    alignItems: 'center',
  },
  detailText: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: '#111827',
    marginTop: 8,
  },
  detailLabel: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#6b7280',
    marginTop: 4,
  },
  section: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 16,
    marginBottom: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    color: '#111827',
    marginBottom: 16,
  },
  forecastDay: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  dayText: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: '#374151',
    flex: 1,
  },
  tempText: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: '#111827',
    flex: 1,
    textAlign: 'center',
  },
  conditionText: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: '#6b7280',
    flex: 1,
    textAlign: 'right',
  },
  soilInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  soilItem: {
    alignItems: 'center',
    flex: 1,
  },
  soilValue: {
    fontSize: 20,
    fontFamily: 'Inter_600SemiBold',
    color: '#111827',
    marginTop: 8,
  },
  soilLabel: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#6b7280',
    marginTop: 4,
  },
  sunInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  sunItem: {
    alignItems: 'center',
    flex: 1,
  },
  sunTime: {
    fontSize: 20,
    fontFamily: 'Inter_600SemiBold',
    color: '#111827',
    marginTop: 8,
  },
  sunLabel: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#6b7280',
    marginTop: 4,
  },
  errorText: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: '#ef4444',
    textAlign: 'center',
  },
});