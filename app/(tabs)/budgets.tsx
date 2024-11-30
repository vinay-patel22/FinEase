import React, { useEffect, useState } from 'react';
import { Animated, FlatList, StyleSheet, Text, TextInput, View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

interface Budget {
    _id: string; // Ensure this is a unique identifier
    category: string;
    amount: number;
}

const BudgetsScreen = () => {
    const [category, setCategory] = useState('');
    const [amount, setAmount] = useState('');
    const [fadeAnim] = useState(new Animated.Value(0));
    const [budgets, setBudgets] = useState<Budget[]>([]);
    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        // Fetch existing budgets when the screen loads
        const fetchBudgets = async () => {
            try {
                const response = await fetch('http://192.168.0.106:5000/api/budgets');
                const data = await response.json();
                if (response.ok) {
                    setBudgets(data);
                    if (data.length === 0) {
                        setMessage('No budgets available');
                    }
                } else {
                    alert('Failed to fetch budgets');
                }
            } catch (error) {
                console.error(error);
                alert('An error occurred while fetching budgets');
            }
        };

        fetchBudgets();
    }, []);

    useEffect(() => {
        // Trigger fade-in animation on component mount
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start();
    }, [fadeAnim]);

    const handleAddBudget = async () => {
        try {
            const response = await fetch('http://192.168.0.106:5000/api/budgets', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    category,
                    amount: parseFloat(amount),
                }),
            });
            const data = await response.json();
            if (response.ok) {
                // Update the local state with the new budget
                setBudgets(prevBudgets => [...prevBudgets, data]);
                setCategory('');
                setAmount('');
                setMessage('Budget added successfully');
                setTimeout(() => setMessage(null), 3000); // Clear message after 3 seconds
            } else {
                alert('Failed to add budget');
            }
        } catch (error) {
            console.error(error);
            alert('An error occurred');
        }
    };

    const getTopBudgets = (budgets: Budget[]) => {
        const sortedBudgets = [...budgets].sort((a, b) => b.amount - a.amount);
        return sortedBudgets.slice(0, 5);
    };

    const renderItem = ({ item }: { item: Budget }) => (
        <View style={styles.budgetItem}>
            <Text style={styles.budgetText}>{item.category}: ${item.amount.toFixed(2)}</Text>
        </View>
    );

    return (
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
            <Text style={styles.title}>Add Budget</Text>
            <View style={styles.inputContainer}>
                <Icon name="tag" size={20} color="#888" style={styles.icon} />
                <TextInput
                    style={styles.input}
                    placeholder="Category"
                    value={category}
                    onChangeText={setCategory}
                />
            </View>
            <View style={styles.inputContainer}>
                <Icon name="usd" size={20} color="#888" style={styles.icon} />
                <TextInput
                    style={styles.input}
                    placeholder="Amount"
                    keyboardType="numeric"
                    value={amount}
                    onChangeText={setAmount}
                />
            </View>
            <TouchableOpacity style={styles.button} onPress={handleAddBudget}>
                <Text style={styles.buttonText}>Add Budget</Text>
            </TouchableOpacity>
            {message && <Text style={styles.message}>{message}</Text>}
            <Text style={styles.recentTitle}>Your Top 5 Budgets by Amount</Text>
            <FlatList
                data={getTopBudgets(budgets)} // Use the top 5 budgets
                renderItem={renderItem}
                keyExtractor={(item) => item._id}
                style={styles.budgetList}
                ListEmptyComponent={<Text style={styles.message}>No budgets available</Text>}
                contentContainerStyle={styles.listContainer}
            />
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f9f9f9',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        marginBottom: 20,
    },
    icon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        height: 40,
        fontSize: 16,
    },
    button: {
        backgroundColor: '#007bff',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    budgetList: {
        flexGrow: 1,
    },
    listContainer: {
        paddingBottom: 20,
    },
    budgetItem: {
        backgroundColor: '#fff',
        padding: 15,
        marginBottom: 10,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    budgetText: {
        fontSize: 16,
        color: '#333',
    },
    message: {
        fontSize: 16,
        color: '#ff0000',
        textAlign: 'center',
        marginVertical: 20,
    },
    recentTitle: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 20,
        color: '#333',
    },
});

export default BudgetsScreen;
