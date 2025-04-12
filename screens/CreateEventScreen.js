import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { db, auth } from '../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

const CreateEventScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');

  const createEvent = async () => {
    if (!title || !description || !date) {
      Alert.alert('Please fill all fields');
      return;
    }

    try {
      const docRef = await addDoc(collection(db, 'events'), {
        title,
        description,
        date,
        userId: auth.currentUser.uid,  
      });
      console.log('Document written with ID: ', docRef.id);
      navigation.navigate('Dashboard');  
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Event Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Event Description"
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        style={styles.input}
        placeholder="Event Date"
        value={date}
        onChangeText={setDate}
      />

      <TouchableOpacity style={styles.createButton} onPress={createEvent}>
        <Text style={styles.buttonText}>Create Event</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f4f4f4',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
    paddingLeft: 15,
    backgroundColor: 'white',
    fontSize: 16,
  },
  createButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default CreateEventScreen;
