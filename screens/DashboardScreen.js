import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Alert, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { db, auth } from '../firebaseConfig';
import { collection, query, where, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';

const DashboardScreen = ({ navigation }) => {
  const [events, setEvents] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const q = query(collection(db, 'events'), where('userId', '==', auth.currentUser.uid));
        const querySnapshot = await getDocs(q);
        const eventsList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEvents(eventsList);
      } catch (error) {
        console.error('Error fetching events: ', error);
      }
    };

    const fetchFavoriteEvents = async () => {
      try {
        const q = query(collection(db, 'favorites'), where('userId', '==', auth.currentUser.uid));
        const querySnapshot = await getDocs(q);
        const favoriteList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setFavorites(favoriteList);
      } catch (error) {
        console.error('Error fetching favorite events: ', error);
      }
    };

    fetchEvents();
    fetchFavoriteEvents();
  }, []);

  const handleLogout = () => {
    auth.signOut().then(() => {
      navigation.replace('SignIn');
    }).catch((error) => {
      console.log('Sign Out Error: ', error);
    });
  };

  const handleCreateEvent = () => {
    navigation.navigate('CreateEvent');
  };

  const handleEventPress = (event) => {
    navigation.navigate('EditEvent', { eventId: event.id });
  };

  const handleDeleteEvent = (eventId) => {
    Alert.alert(
      'Delete Event',
      'Are you sure you want to delete this event?',
      [
        { text: 'Cancel' },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'events', eventId));
              setEvents(events.filter(event => event.id !== eventId));
              Alert.alert('Success', 'Event deleted successfully');
            } catch (error) {
              console.error('Error deleting event: ', error);
              Alert.alert('Error', 'Failed to delete event');
            }
          },
        },
      ]
    );
  };

  const handleToggleFavorite = async (eventId, isFavorited) => {
    try {
      const eventRef = doc(db, 'events', eventId);
      await updateDoc(eventRef, { isFavorited: !isFavorited });
      setEvents(events.map((event) =>
        event.id === eventId ? { ...event, isFavorited: !isFavorited } : event
      ));
    } catch (error) {
      console.error('Error updating favorite status: ', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.createButton} onPress={handleCreateEvent}>
          <Text style={styles.buttonText}>Create Event</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => setShowFavorites(!showFavorites)}
        >
          <Text style={styles.buttonText}>
            {showFavorites ? 'Show All Events' : 'Show Favorite Events'}
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={showFavorites ? favorites : events}
        renderItem={({ item }) => (
          <View style={styles.eventCard}>
            <View style={styles.eventHeader}>
              <Text style={styles.eventTitle}>{item.title}</Text>
              <Switch
                value={item.isFavorited}
                onValueChange={() => handleToggleFavorite(item.id, item.isFavorited)} // Toggle favorite status
              />
            </View>
            <Text>{item.description}</Text>
            <Text>{item.date}</Text>
            <View style={styles.eventActions}>
              <TouchableOpacity style={styles.editButton} onPress={() => handleEventPress(item)}>
                <Text style={styles.actionText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteEvent(item.id)}>
                <Text style={styles.actionText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  createButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  favoriteButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  eventCard: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eventTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 8,
  },
  eventActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  editButton: {
    backgroundColor: '#2196F3', 
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: '#FF5722', 
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  actionText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default DashboardScreen;

