import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { colors } from '../../util/color-options';

const CreateButton = ({ title, onPress }) => {
    return (
        <TouchableOpacity onPress={onPress} style={styles.button}>
            <Text style={styles.text}>{'+'}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 60,
        height: 60,
        borderRadius: 30,
        elevation: 3,
        backgroundColor: colors.white,
        position: 'absolute',
        bottom: 80,
        right: 50,
    },
    text: {
        fontSize: 30,
        color: colors.blue,
    }
});

export default CreateButton;