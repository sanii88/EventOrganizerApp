import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, Alert, StyleSheet } from 'react-native';
import { db, auth } from '../firebaseConfig'; 
import { collection, getDocs, query, where } from 'firebase/firestore';

const FavoriteEventsScreen = ({ navigation }) => {
  const [events, setEvents] = useState([]);

  const fetchFavoriteEvents = async () => {
    try {
      const q = query(
        collection(db, 'events'), 
        where('userId', '==', auth.currentUser.uid), 
        where('isFavorite', '==', true) 
      );

      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      if (data.length > 0) {
        setEvents(data);
      } else {
        Alert.alert('No Favorite Events', 'You have no favorite events.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch favorite events');
      console.error('Error fetching favorite events: ', error);
    }
  };

  useEffect(() => {
    if (auth.currentUser) {
      fetchFavoriteEvents();
    } else {
      Alert.alert('Error', 'User not logged in.');
    }
  }, []);

  const handleRemoveFavorite = async (event) => {
    try {
      await updateDoc(doc(db, 'events', event.id), { isFavorite: false });
      fetchFavoriteEvents(); 
    } catch (error) {
      Alert.alert('Error', 'Failed to remove from favorites');
      console.error('Error removing from favorites: ', error);
    }
  };

  const renderEvent = ({ item }) => (
    <View style={styles.eventCard}>
      <Text style={styles.title}>{item.title}</Text>
      <Text>{item.description}</Text>
      <Text>{item.date}</Text>

      <Button
        title="Remove from Favorites"
        onPress={() => handleRemoveFavorite(item)}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Favorite Events</Text>
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={renderEvent}
        ListEmptyComponent={<Text>No favorite events found.</Text>} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  heading: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  eventCard: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 4,
  },
});

export default FavoriteEventsScreen;
