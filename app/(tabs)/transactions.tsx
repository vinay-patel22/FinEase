import React, { useState, useEffect } from 'react';
import { Button, StyleSheet, Text, TextInput, View, Modal, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const TransactionsScreen = () => {
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [transactions, setTransactions] = useState([]);
    const [recentTransactions, setRecentTransactions] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const navigation = useNavigation();

    // Function to fetch the latest transactions
    const fetchTransactions = async () => {
        try {
            const response = await fetch('http://192.168.0.106:5000/api/transactions');
            const data = await response.json();
            if (response.ok) {
                const sortedByAmountTransactions = data.sort((a, b) => b.amount - a.amount);
                const highestAmountTransactions = sortedByAmountTransactions.slice(0, 5);


                const sortedByDateTransactions = [...data].sort((a, b) => new Date(b.date) - new Date(a.date));
                const latestTransactions = sortedByDateTransactions.slice(0, 5);

                setTransactions(highestAmountTransactions);
                setRecentTransactions(latestTransactions);
            } else {
                alert('Failed to fetch transactions');
            }
        } catch (error) {
            console.error(error);
            alert('An error occurred while fetching transactions');
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    const handleAddTransaction = async () => {
        try {
            const response = await fetch('http://192.168.0.106:5000/api/transactions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    description,
                    amount: parseFloat(amount.replace(',', '.')), // Handle comma as decimal separator
                }),
            });
            if (response.ok) {
                setDescription('');
                setAmount('');
                await fetchTransactions();
                setModalVisible(true);
            } else {
                alert('Failed to add transaction');
            }
        } catch (error) {
            console.error(error);
            alert('An error occurred');
        }
    };

    const formatDateTime = (dateTime) => {
        const date = new Date(dateTime);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const renderItem = ({ item }) => (
        <View style={styles.transactionItem}>
            <Text style={styles.transactionDescription}>{item.description}</Text>
            <View style={styles.transactionDetails}>
                <Text style={styles.transactionAmount}>${item.amount.toFixed(2)}</Text>
                <Text style={styles.transactionDate}>{formatDateTime(item.date)}</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Add Transaction</Text>
            <TextInput
                style={styles.input}
                placeholder="Description"
                value={description}
                onChangeText={setDescription}
            />
            <TextInput
                style={styles.input}
                placeholder="Amount"
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
            />
            <TouchableOpacity style={styles.addButton} onPress={handleAddTransaction}>
                <Text style={styles.addButtonText}>Add Transaction</Text>
            </TouchableOpacity>

            <Text style={styles.recentTitle}>Top 5 Transactions by Amount</Text>
            <FlatList
                data={transactions}
                renderItem={renderItem}
                keyExtractor={(item) => item._id}
                style={styles.transactionList}
                ListEmptyComponent={<Text style={styles.emptyMessage}>No transactions available</Text>}
                contentContainerStyle={styles.listContentContainer}
            />

            <Modal
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Recent Transactions</Text>
                        <FlatList
                            data={recentTransactions}
                            renderItem={renderItem}
                            keyExtractor={(item) => item._id}
                            contentContainerStyle={styles.modalListContentContainer}
                        />
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => {
                                setModalVisible(false);
                                navigation.navigate('Explore');
                            }}
                        >
                            <Text style={styles.buttonText}>View More Details</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.buttonText}>Later</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 26,
        fontWeight: '700',
        marginBottom: 10,
        color: '#333',
    },
    input: {
        height: 45,
        borderColor: '#ddd',
        borderWidth: 1,
        marginBottom: 15,
        paddingHorizontal: 15,
        borderRadius: 8,
        backgroundColor: '#fff',
        fontSize: 16,
    },
    addButton: {
        backgroundColor: '#1E90FF',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 5,
    },
    addButtonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '600',
    },
    recentTitle: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 20,
        color: '#333',
    },
    transactionList: {
        backgroundColor: '#FFF',
        borderRadius: 10,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 5,
    },
    transactionItem: {
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    transactionDescription: {
        fontSize: 16,
        color: '#333',
        marginBottom: 5,
    },
    transactionDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    transactionAmount: {
        fontSize: 16,
        color: '#1E90FF',
        fontWeight: '600',
    },
    transactionDate: {
        fontSize: 14,
        color: '#888',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    modalContent: {
        width: '90%',
        padding: 25,
        backgroundColor: '#fff',
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: '700',
        marginBottom: 20,
        color: '#333',
    },
    button: {
        backgroundColor: '#1E90FF',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginTop: 12,
        width: '100%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 5,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
    emptyMessage: {
        fontSize: 16,
        color: '#888',
        textAlign: 'center',
        marginVertical: 20,
    },
    listContentContainer: {
        paddingBottom: 20,
    },
    modalListContentContainer: {
        paddingBottom: 20,
    },
});

export default TransactionsScreen;
