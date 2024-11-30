import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface TransactionCardProps {
    transaction: {
        _id: string;
        description: string;
        amount: number;
    };
}

const TransactionCard: React.FC<TransactionCardProps> = ({ transaction }) => {
    return (
        <View style={styles.card}>
            <Text style={styles.description}>{transaction.description}</Text>
            <Text style={styles.amount}>${transaction.amount.toFixed(2)}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        padding: 16,
        marginBottom: 8,
        backgroundColor: '#fff',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
    description: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    amount: {
        fontSize: 14,
        color: 'green',
    },
});

export default TransactionCard;
