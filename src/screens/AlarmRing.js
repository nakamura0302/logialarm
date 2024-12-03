import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { colors } from '../util/color-options'; // Adjust this import based on your project structure

const AlarmRing = ({ route, navigation }) => {

  const {ring, setRing} = route.params;

  const [selectedRing, setSelectedRing] = useState(ring);

  const [rings] = useState([
    { id: 0, value: 'bell.wav', label: 'ベル', imagePath: require('../../assets/bell.png') },
    { id: 1, value: 'doorbell.wav', label: 'ドアベル', imagePath: require('../../assets/doorbell.png') },
    { id: 2, value: 'harp.wav', label: 'ハープ', imagePath: require('../../assets/harp.png') },
    { id: 3, value: 'magic.wav', label: '神秘的な', imagePath: require('../../assets/magic.png') },
    { id: 4, value: 'bubble.wav', label: 'バブル', imagePath: require('../../assets/bubble.png') },
    { id: 5, value: 'guitar.wav', label: 'ギター', imagePath: require('../../assets/guitar.png') },
    { id: 6, value: 'flute.wav', label: 'フルート', imagePath: require('../../assets/flute.png') },
    { id: 7, value: 'message.mp3', label: 'メッセージ', imagePath: require('../../assets/message.png') },
  ]);

  const handleSelectRing = (value) => {
    // Handle the selection of the ring here, e.g., set it in state or navigate
    setRing(value);
    setSelectedRing(value);
  };

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {rings.map(item => (
          <TouchableOpacity 
            key={item.id} 
            style={[styles.card, item.value == selectedRing.value && styles.selected]} 
            onPress={() => handleSelectRing(item)}
          >
            <Image style={styles.image} source={item.imagePath} />
            <Text style={styles.label}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.white,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%', // Adjust width for two columns
    marginBottom: 16,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    elevation: 1, // For Android shadow
    shadowColor: '#000', // For iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  selected:{
    borderWidth: 2,
    borderColor: colors.blue
  },
  image: {
    width: 60,
    height: 60,
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    textAlign: 'center',
  },
});

export default AlarmRing;
