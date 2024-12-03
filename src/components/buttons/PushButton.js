import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { colors } from '../../util/color-options';

const PushButton = ({ onPress, text, textColor, buttonColor }) => {
    return (
        <TouchableOpacity onPress={onPress} style={[styles.button, {backgroundColor: buttonColor}]}>
            <Text style={[styles.text, {color: textColor}]}>{text}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 15,
        // elevation: 3,
        margin: 5
    },
    text: {
        color: colors.black,
        fontSize: 20,
        // lineHeight: 21,
        // letterSpacing: 0.25,
    }
});

export default PushButton;