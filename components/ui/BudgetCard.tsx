import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

interface BudgetCardProps {
    budget: {
        _id: string;
        category: string;
        amount: number;
    };
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
}

const BudgetCard: React.FC<BudgetCardProps> = ({ budget, onEdit, onDelete }) => {
    return (
        <View style={styles.card}>
            <View style={styles.infoContainer}>
                <Text style={styles.title}>{budget.category}</Text>
                <Text style={styles.amount}>${budget.amount.toFixed(2)}</Text>
            </View>
            <View style={styles.actions}>
                <TouchableOpacity onPress={() => onEdit(budget._id)} style={styles.actionButton}>
                    <Icon name="edit" size={20} color="#007bff" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onDelete(budget._id)} style={styles.actionButton}>
                    <Icon name="trash" size={20} color="#dc3545" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        padding: 20,
        marginVertical: 10,
        backgroundColor: '#f8f9fa',
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    infoContainer: {
        flex: 1,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    amount: {
        fontSize: 16,
        color: '#28a745',
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionButton: {
        marginLeft: 10,
    },
});

export default BudgetCard;
