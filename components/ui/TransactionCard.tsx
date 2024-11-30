import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

interface TransactionCardProps {
    transaction: {
        _id: string;
        description: string;
        amount: number;
        date: string;
    };
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
}

const TransactionCard: React.FC<TransactionCardProps> = ({ transaction, onEdit, onDelete }) => {
    return (
        <View style={styles.card}>
            <View style={styles.infoContainer}>
                <Text style={styles.description}>{transaction.description}</Text>
                <Text style={styles.amount}>${transaction.amount.toFixed(2)}</Text>
                <Text style={styles.date}>{new Date(transaction.date).toLocaleDateString()}</Text>
            </View>
            <View style={styles.actions}>
                <TouchableOpacity onPress={() => onEdit(transaction._id)} style={styles.actionButton}>
                    <Icon name="edit" size={20} color="#007bff" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onDelete(transaction._id)} style={styles.actionButton}>
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
    description: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    amount: {
        fontSize: 16,
        color: '#dc3545',
    },
    date: {
        fontSize: 14,
        color: '#6c757d',
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionButton: {
        marginLeft: 10,
    },
});

export default TransactionCard;
