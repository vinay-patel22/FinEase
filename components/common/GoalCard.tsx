import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface GoalCardProps {
    goal: {
        _id: string;
        title: string;
        amount: number;
    };
}

const GoalCard: React.FC<GoalCardProps> = ({ goal }) => {
    return (
        <View style={styles.card}>
            <Text style={styles.title}>{goal.title}</Text>
            <Text style={styles.amount}>${goal.amount.toFixed(2)}</Text>
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
    title: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    amount: {
        fontSize: 14,
        color: 'orange',
    },
});

export default GoalCard;
