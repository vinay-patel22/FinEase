import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

type CardProps = {
    title: string;
    amount: string;
    description?: string;
};

const CardComponent: React.FC<CardProps> = ({ title, amount, description }) => {
    return (
        <LinearGradient
            colors={['#FF7E5F', '#FFB88C']} style={styles.card}
        >
            <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{title}</Text>
                <Text style={styles.cardAmount}>{amount}</Text>
                {description && <Text style={styles.cardDescription}>{description}</Text>}
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 10,
        padding: 20,
        marginVertical: 10,
        marginHorizontal: 10,
        elevation: 5, // For shadow effect on Android
        shadowColor: '#000', // For shadow effect on iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    cardContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    cardAmount: {
        fontSize: 16,
        color: '#fff',
    },
    cardDescription: {
        fontSize: 14,
        color: '#fff',
        textAlign: 'center',
        marginTop: 10,
    },
});

export default CardComponent;
