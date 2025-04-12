import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, ActivityIndicator, TouchableOpacity, Text } from 'react-native';
import { db } from '../firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const EditEventScreen = ({ route, navigation }) => {
  const { eventId } = route.params;
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEventData = async () => {
      if (!eventId) {
        Alert.alert('Error', 'Event ID is missing');
        navigation.goBack();
        return;
      }

      try {
        const eventRef = doc(db, 'events', eventId);
        const eventSnap = await getDoc(eventRef);

        if (eventSnap.exists()) {
          const eventData = eventSnap.data();
          setTitle(eventData.title || '');
          setDescription(eventData.description || '');
          setDate(eventData.date || '');
        } else {
          Alert.alert('Error', 'Event not found');
          navigation.goBack();
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch event data');
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    };

    fetchEventData();
  }, [eventId, navigation]);

  const handleUpdateEvent = async () => {
    if (!title || !description || !date) {
      Alert.alert('Error', 'Please fill all the fields');
      return;
    }

    try {
      const eventRef = doc(db, 'events', eventId);
      await updateDoc(eventRef, {
        title,
        description,
        date,
      });
      navigation.goBack(); 
    } catch (error) {
      Alert.alert('Error', 'Failed to update event');
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Event Title"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />
      <TextInput
        placeholder="Event Description"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
      />
      <TextInput
        placeholder="Event Date"
        value={date}
        onChangeText={setDate}
        style={styles.input}
      />
      <TouchableOpacity style={styles.button} onPress={handleUpdateEvent}>
        <Text style={styles.buttonText}>Update Event</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, justifyContent: 'center' },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EditEventScreen;
