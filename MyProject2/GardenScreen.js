import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, Dimensions, Alert } from 'react-native';
import { captureRef } from 'react-native-view-shot';

import PlantSelectionModal from './PlantSelectionModal';

const TREFLE_API_URL = 'https://trefle.io/api/v1/plants';
const TREFLE_API_TOKEN = 'sov1HjlFykyxkGl02VIozlnh5DEIqeyZlT3zewFsKzo';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;
const numColumns = 4;
const marginSize = 5;
const containerPadding = 10;
const size = (screenWidth - 2 * containerPadding - (numColumns - 1) * 2 * marginSize) / numColumns;

const rows = 6;
const availableHeight = screenHeight - (2 * containerPadding) - ((rows - 1) * 2 * marginSize);
const squareSize = Math.min(size, availableHeight / rows); 

// ... (rest of the code remains unchanged)

const GardenScreen = ({ navigation, route }) => {
  const { username } = route.params;
  const gardenRef = useRef(null); // Define gardenRef using useRef

  const [selectedPlant, setSelectedPlant] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [plants, setPlants] = useState([]);
  const [garden, setGarden] = useState(() => {
    const rows = 6;
    return Array.from({ length: rows }).map(() => Array(numColumns).fill(null));
  });

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={shareGarden} style={{ marginRight: 10 }}>
          <Text>Share</Text>
        </TouchableOpacity>
      ),
    });

    const getPlants = async () => {
      const fetchedPlants = await fetchPlants();
      setPlants(fetchedPlants);
    };

    const loadUserGarden = async () => {
      try {
        const response = await fetch(`http://172.20.10.5:5000/api/garden/load/${username}`);
        const data = await response.json();
        if (data && Array.isArray(data) && data.length > 0) {
          setGarden(data);
        }
      } catch (error) {
        console.error("Failed loading user garden", error);
      }
    };

    getPlants();
    loadUserGarden();
  }, [username]);

  async function fetchPlants() {
    try {
      const response = await fetch(`${TREFLE_API_URL}?token=${TREFLE_API_TOKEN}&page_size=100`);
      const data = await response.json();
      return data.data.map(plant => ({
        id: plant.id,
        name: plant.common_name,
        image: plant.image_url
      }));
    } catch (error) {
      console.error("Failed fetching plants", error);
      return [];
    }
  }

  const shareGarden = async () => {
    const gardenScreenshot = await captureRef(gardenRef, {
      format: 'png',
      quality: 0.8,
    });
  
    try {
      const response = await fetch('http://172.20.10.5:5000/api/garden/share', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username,
          gardenPicture: gardenScreenshot,
        })
      });
  
      if(response.ok) {
        const data = await response.json();
        if (data.success) {
          Alert.alert('Success', 'Garden shared successfully!');
          // Now, let's assume data.uri holds the link to the image
          navigation.navigate('Blog', { newPostUri: data.uri });
        } else {
          Alert.alert('Error', data.message || 'Unable to share garden.');
        }
      } else {
        console.error("Server responded with status:", response.status);
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred. Please try again.');
    }
  };
  

  const handleSquarePress = (rowIndex, colIndex) => {
    setSelectedPlant({ rowIndex, colIndex });
    setModalVisible(true);
  };

  const handlePlantSelect = (plant) => {
    const newGarden = [...garden];
    newGarden[selectedPlant.rowIndex][selectedPlant.colIndex] = plant;
    setGarden(newGarden);
    setModalVisible(false);
    saveGarden();
  };

  const saveGarden = async () => {
    try {
      const response = await fetch('http://172.20.10.5:5000/api/garden/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          gardenData: garden,
        }),
      });

      const data = await response.json();
      if (!data) {
        console.error('Failed saving garden.');
      }
    } catch (error) {
      console.error('Error saving garden:', error);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={gardenRef} // Now, this line will work properly
        data={garden}
        renderItem={({ item, index }) => (
          <View style={styles.row}>
            {item.map((square, colIndex) => (
              <TouchableOpacity
                key={colIndex}
                style={styles.square}
                onPress={() => handleSquarePress(index, colIndex)}
              >
                {square && 
                  <>
                    <Image source={{ uri: square.image }} style={styles.image} />
                    <Text style={styles.plantName}>{square.name}</Text>
                  </>
                }
              </TouchableOpacity>
            ))}
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
      <PlantSelectionModal
        visible={modalVisible}
        onPlantSelect={handlePlantSelect}
        closeModal={() => setModalVisible(false)}
        plants={plants}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: containerPadding,
    backgroundColor: '#4CAF50',  // Green background
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  square: {
    width: squareSize, // Updated width
    height: squareSize, // Updated height
    borderWidth: 1,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    margin: marginSize,
    backgroundColor: '#A5D6A7',
    position: 'relative',
  },
  image: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 5,  // Rounded corners for images
  },
  plantName: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    backgroundColor: 'rgba(139, 69, 19, 0.7)',  // Slight brown tinted overlay for plant names
    textAlign: 'center',
    color: '#FFFFFF',  // White color for plant names
    padding: 3,
    overflow: 'hidden',
    fontSize: 10,  // Reduced font size for clarity
  },
});

export default GardenScreen;




