import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  Send,
  User,
  CircleUser as UserCircle,
  Image as ImageIcon,
  Bot,
} from 'lucide-react-native';

type Message = {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  expertName?: string;
  expertTitle?: string;
  attachedImage?: string;
};

const experts = [
  {
    id: '1',
    name: 'Dr. Sarah Chen',
    title: 'Agricultural Scientist',
    expertise: ['Crop Disease', 'Soil Health'],
    online: true,
  },
  {
    id: '2',
    name: 'Prof. Michael Rodriguez',
    title: 'Agronomist',
    expertise: ['Sustainable Farming', 'Irrigation'],
    online: false,
  },
  {
    id: '3',
    name: 'Dr. Emily Thompson',
    title: 'Plant Pathologist',
    expertise: ['Disease Control', 'Organic Farming'],
    online: true,
  },
];

export default function AskExpert() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Welcome to Smart Farming Assistant! How can I help you today?',
      isUser: false,
      timestamp: new Date(),
      expertName: 'AI Assistant',
      expertTitle: 'Smart Farming Guide',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [selectedExpert, setSelectedExpert] = useState<string | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleSend = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');

    // Simulate AI/Expert response
    setTimeout(() => {
      const expert = experts.find((e) => e.id === (selectedExpert || '1'));
      const isAIResponse = !selectedExpert;
      
      const response: Message = {
        id: (Date.now() + 1).toString(),
        text: isAIResponse
          ? `Based on my analysis, ${inputText.toLowerCase()} typically indicates ${generateAIResponse()}`
          : `Thank you for your question about ${inputText.toLowerCase()}. Based on my expertise in ${
              expert?.expertise.join(' and ')
            }, I recommend...`,
        isUser: false,
        timestamp: new Date(),
        expertName: isAIResponse ? 'AI Assistant' : expert?.name,
        expertTitle: isAIResponse ? 'Smart Farming Guide' : expert?.title,
      };
      
      setMessages((prev) => [...prev, response]);
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 1000);
  };

  const generateAIResponse = () => {
    const responses = [
      'a common issue that can be addressed with proper irrigation and soil management.',
      'an opportunity to implement sustainable farming practices.',
      'a situation where crop rotation might be beneficial.',
      'a challenge that can be overcome with organic farming methods.',
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
        keyboardVerticalOffset={100}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Expert Consultation</Text>
        </View>

        <View style={styles.expertsContainer}>
          <Text style={styles.sectionTitle}>Choose Your Expert</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity
              style={[
                styles.expertCard,
                !selectedExpert && styles.expertCardSelected,
              ]}
              onPress={() => setSelectedExpert(null)}>
              <View style={styles.expertImageContainer}>
                <Bot size={32} color="#16a34a" />
              </View>
              <Text style={styles.expertName}>AI Assistant</Text>
              <Text style={styles.expertTitle}>Quick Responses</Text>
              <View style={[styles.onlineIndicator, { backgroundColor: '#16a34a' }]} />
            </TouchableOpacity>
            {experts.map((expert) => (
              <TouchableOpacity
                key={expert.id}
                style={[
                  styles.expertCard,
                  selectedExpert === expert.id && styles.expertCardSelected,
                ]}
                onPress={() => setSelectedExpert(expert.id)}>
                <View style={styles.expertImageContainer}>
                  <UserCircle size={32} color="#16a34a" />
                </View>
                <Text style={styles.expertName}>{expert.name}</Text>
                <Text style={styles.expertTitle}>{expert.title}</Text>
                <View
                  style={[
                    styles.onlineIndicator,
                    { backgroundColor: expert.online ? '#16a34a' : '#6b7280' },
                  ]}
                />
                <View style={styles.expertiseContainer}>
                  {expert.expertise.map((item, index) => (
                    <Text key={index} style={styles.expertiseItem}>
                      {item}
                    </Text>
                  ))}
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.chatContainer}>
          <ScrollView
            ref={scrollViewRef}
            style={styles.messagesContainer}
            onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}>
            {messages.map((message) => (
              <View
                key={message.id}
                style={[
                  styles.messageContainer,
                  message.isUser ? styles.userMessage : styles.expertMessage,
                ]}>
                {message.isUser ? (
                  <View style={styles.userIcon}>
                    <User size={24} color="#ffffff" />
                  </View>
                ) : (
                  <View style={styles.expertIcon}>
                    <UserCircle size={24} color="#16a34a" />
                  </View>
                )}
                <View style={styles.messageContent}>
                  {!message.isUser && (
                    <View style={styles.expertInfo}>
                      <Text style={styles.expertMessageName}>
                        {message.expertName}
                      </Text>
                      <Text style={styles.expertMessageTitle}>
                        {message.expertTitle}
                      </Text>
                    </View>
                  )}
                  <Text
                    style={[
                      styles.messageText,
                      message.isUser && styles.userMessageText,
                    ]}>
                    {message.text}
                  </Text>
                  {message.attachedImage && (
                    <View style={styles.attachedImagePlaceholder}>
                      <ImageIcon size={24} color="#6b7280" />
                      <Text style={styles.attachedImageText}>Image Attachment</Text>
                    </View>
                  )}
                  <Text style={styles.timestamp}>
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>

          <View style={styles.inputContainer}>
            <TouchableOpacity style={styles.attachButton}>
              <ImageIcon size={24} color="#16a34a" />
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Type your farming question..."
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              style={[styles.sendButton, !inputText && styles.sendButtonDisabled]}
              onPress={handleSend}
              disabled={!inputText}>
              <Send
                size={24}
                color={inputText ? '#ffffff' : '#a1a1aa'}
                style={styles.sendIcon}
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Inter_600SemiBold',
    color: '#111827',
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: '#374151',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  expertsContainer: {
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  expertCard: {
    alignItems: 'center',
    marginHorizontal: 8,
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
    width: 160,
  },
  expertCardSelected: {
    borderColor: '#16a34a',
  },
  expertImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f0fdf4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  expertName: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: '#111827',
    textAlign: 'center',
  },
  expertTitle: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: '#6b7280',
    textAlign: 'center',
  },
  expertiseContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 8,
  },
  expertiseItem: {
    fontSize: 10,
    fontFamily: 'Inter_400Regular',
    color: '#16a34a',
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginHorizontal: 2,
    marginVertical: 2,
  },
  onlineIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  chatContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  messagesContainer: {
    flex: 1,
    padding: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    maxWidth: '80%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    flexDirection: 'row-reverse',
  },
  expertMessage: {
    alignSelf: 'flex-start',
  },
  messageContent: {
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 12,
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  expertInfo: {
    marginBottom: 4,
  },
  expertMessageName: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: '#111827',
  },
  expertMessageTitle: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: '#6b7280',
  },
  messageText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#111827',
  },
  userMessageText: {
    color: '#111827',
  },
  attachedImagePlaceholder: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    padding: 8,
    borderRadius: 8,
    marginTop: 8,
  },
  attachedImageText: {
    marginLeft: 8,
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#6b7280',
  },
  timestamp: {
    fontSize: 10,
    fontFamily: 'Inter_400Regular',
    color: '#9ca3af',
    marginTop: 4,
    textAlign: 'right',
  },
  userIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#16a34a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  expertIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f0fdf4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    alignItems: 'flex-end',
  },
  attachButton: {
    padding: 8,
    marginRight: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    maxHeight: 100,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#16a34a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#e5e7eb',
  },
  sendIcon: {
    transform: [{ rotate: '45deg' }],
  },
});