import React, { useState, useEffect, useCallback } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  StyleSheet,
  TextInput,
} from 'react-native';

const PlantItem = React.memo(({ item, onSelect }) => (
  <TouchableOpacity style={styles.plantItem} onPress={() => onSelect(item)}>
    <Image source={{ uri: item.image }} style={styles.plantImage} />
    <Text>{item.name}</Text>
  </TouchableOpacity>
));

const PlantSelectionModal = ({ visible, closeModal, onPlantSelect, plants }) => {
  const [filteredPlants, setFilteredPlants] = useState(plants);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      setFilteredPlants(
        plants.filter(
          (plant) => plant.name && plant.name.toLowerCase().includes(query)
        )
      );
    } else {
      setFilteredPlants(plants);
    }
  }, [searchQuery, plants]);

  const handlePlantSelectMemo = useCallback(
    (plant) => {
      onPlantSelect(plant);
      closeModal();
    },
    [onPlantSelect, closeModal]
  );

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.modalContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search for plants..."
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
        />
        <FlatList
          data={filteredPlants}
          renderItem={({ item }) => (
            <PlantItem item={item} onSelect={handlePlantSelectMemo} />
          )}
          keyExtractor={(item) => item.id.toString()}
        />
        <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    padding: 20,
  },
  searchBar: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    color: 'white',
  },
  plantItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
  },
  plantImage: {
    width: 50,
    height: 50,
    marginRight: 15,
  },
  closeButton: {
    padding: 15,
    backgroundColor: '#2196F3',
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default PlantSelectionModal;
