import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface BudgetCardProps {
    budget: {
        _id: string;
        category: string;
        amount: number;
    };
}

const BudgetCard: React.FC<BudgetCardProps> = ({ budget }) => {
    return (
        <View style={styles.card}>
            <Text style={styles.category}>{budget.category}</Text>
            <Text style={styles.amount}>${budget.amount.toFixed(2)}</Text>
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
    category: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    amount: {
        fontSize: 14,
        color: 'blue',
    },
});

export default BudgetCard;
