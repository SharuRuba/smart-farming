import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { Sprout, Droplet, FlaskRound as Flask, Bug, Repeat, Bell, TrendingUp, Leaf } from 'lucide-react-native';

export default function Recommendations() {
  const [selectedCategory, setSelectedCategory] = useState('crops');

  const recommendations = {
    crops: {
      title: 'Recommended Crops',
      items: [
        {
          name: 'Tomatoes',
          description: 'Ideal for current soil conditions and climate. Plant in well-drained soil with full sun exposure.',
        },
        {
          name: 'Bell Peppers',
          description: 'Suitable for the upcoming season. Requires moderate watering and rich soil.',
        },
      ],
    },
    irrigation: {
      title: 'Irrigation Schedule',
      items: [
        {
          name: 'Morning Watering',
          description: 'Water deeply between 6-8 AM to minimize evaporation.',
        },
        {
          name: 'Soil Moisture',
          description: 'Maintain soil moisture at 60-70% capacity for optimal growth.',
        },
      ],
    },
    fertilizer: {
      title: 'Fertilizer Guide',
      items: [
        {
          name: 'NPK Balance',
          description: 'Apply 5-10-5 fertilizer every 3 weeks during growing season.',
        },
        {
          name: 'Organic Options',
          description: 'Consider compost tea or fish emulsion for organic fertilization.',
        },
      ],
    },
    pestControl: {
      title: 'Pest Control',
      items: [
        {
          name: 'Prevention',
          description: 'Install physical barriers and use companion planting.',
        },
        {
          name: 'Natural Solutions',
          description: 'Use neem oil spray for common pests like aphids and mites.',
        },
      ],
    },
    rotation: {
      title: 'Crop Rotation',
      items: [
        {
          name: 'Current Phase',
          description: 'Rotate leafy greens with root vegetables in the next season.',
        },
        {
          name: 'Planning',
          description: 'Prepare for legumes in the following rotation to fix nitrogen.',
        },
      ],
    },
    alerts: {
      title: 'Important Alerts',
      items: [
        {
          name: 'Weather Warning',
          description: 'Frost expected in 3 days. Protect sensitive crops.',
        },
        {
          name: 'Disease Risk',
          description: 'High humidity increases risk of fungal diseases. Monitor closely.',
        },
      ],
    },
    market: {
      title: 'Market Insights',
      items: [
        {
          name: 'Price Trends',
          description: 'Tomato prices expected to rise in the next month.',
        },
        {
          name: 'Harvest Timing',
          description: 'Optimal market conditions for leafy greens in 2 weeks.',
        },
      ],
    },
    organic: {
      title: 'Organic Farming',
      items: [
        {
          name: 'Soil Health',
          description: 'Add cover crops to improve soil structure and fertility.',
        },
        {
          name: 'Natural Methods',
          description: 'Implement beneficial insects for pest management.',
        },
      ],
    },
  };

  const categories = [
    { id: 'crops', icon: Sprout, label: 'Crops' },
    { id: 'irrigation', icon: Droplet, label: 'Irrigation' },
    { id: 'fertilizer', icon: Flask, label: 'Fertilizer' },
    { id: 'pestControl', icon: Bug, label: 'Pest Control' },
    { id: 'rotation', icon: Repeat, label: 'Rotation' },
    { id: 'alerts', icon: Bell, label: 'Alerts' },
    { id: 'market', icon: TrendingUp, label: 'Market' },
    { id: 'organic', icon: Leaf, label: 'Organic' },
  ];

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=1920' }}
      style={styles.container}
      imageStyle={styles.backgroundImage}>
      <View style={styles.overlay}>
        <View style={styles.categoryScroll}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryButton,
                  selectedCategory === category.id && styles.categoryButtonActive,
                ]}
                onPress={() => setSelectedCategory(category.id)}>
                <category.icon
                  size={24}
                  color={selectedCategory === category.id ? '#ffffff' : '#16a34a'}
                />
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory === category.id && styles.categoryTextActive,
                  ]}>
                  {category.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <ScrollView style={styles.content}>
          <Text style={styles.sectionTitle}>
            {recommendations[selectedCategory as keyof typeof recommendations].title}
          </Text>
          {recommendations[selectedCategory as keyof typeof recommendations].items.map((item, index) => (
            <View key={index} style={styles.recommendationCard}>
              <Text style={styles.recommendationTitle}>{item.name}</Text>
              <Text style={styles.recommendationDescription}>{item.description}</Text>
            </View>
          ))}
        </ScrollView>
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
  },
  categoryScroll: {
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#16a34a',
  },
  categoryButtonActive: {
    backgroundColor: '#16a34a',
  },
  categoryText: {
    marginLeft: 8,
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: '#16a34a',
  },
  categoryTextActive: {
    color: '#ffffff',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
    color: '#111827',
    marginBottom: 16,
  },
  recommendationCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recommendationTitle: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    color: '#111827',
    marginBottom: 8,
  },
  recommendationDescription: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#6b7280',
    lineHeight: 20,
  },
});