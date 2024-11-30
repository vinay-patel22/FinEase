import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, FlatList } from 'react-native';

interface Goal {
    _id: string;
    title: string;
    amount: number;
}

const GoalsScreen = () => {
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [goals, setGoals] = useState<Goal[]>([]);
    const [topGoals, setTopGoals] = useState<Goal[]>([]);
    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        fetchGoals();
    }, []);

    const fetchGoals = async () => {
        try {
            const response = await fetch('http://192.168.0.106:5000/api/goals');
            const data = await response.json();
            if (response.ok) {
                setGoals(data);
                updateTopGoals(data);
            } else {
                alert('Failed to fetch goals');
            }
        } catch (error) {
            console.error(error);
            alert('An error occurred while fetching goals');
        }
    };

    const updateTopGoals = (goals: Goal[]) => {
        const sortedGoals = [...goals].sort((a, b) => b.amount - a.amount);
        setTopGoals(sortedGoals.slice(0, 5));
    };

    const handleAddGoal = async () => {
        try {
            const response = await fetch('http://192.168.0.106:5000/api/goals', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title,
                    amount: parseFloat(amount),
                }),
            });
            const data = await response.json();
            if (response.ok) {
                setTitle('');
                setAmount('');
                await fetchGoals();
                setMessage('Goal added successfully');
                setTimeout(() => setMessage(null), 3000);
            } else {
                alert('Failed to add goal');
            }
        } catch (error) {
            console.error(error);
            alert('An error occurred');
        }
    };

    const renderItem = ({ item }: { item: Goal }) => (
        <View style={styles.goalItem}>
            <Text style={styles.goalTitle}>{item.title}</Text>
            <Text style={styles.goalAmount}>${item.amount.toFixed(2)}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Add Goal</Text>
            <TextInput
                style={styles.input}
                placeholder="Title"
                value={title}
                onChangeText={setTitle}
            />
            <TextInput
                style={styles.input}
                placeholder="Amount"
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
            />
            <TouchableOpacity style={styles.addButton} onPress={handleAddGoal}>
                <Text style={styles.addButtonText}>Add Goal</Text>
            </TouchableOpacity>

            {message && <Text style={styles.message}>{message}</Text>}

            <Text style={styles.recentTitle}>Top 5 Goals by Amount</Text>
            <FlatList
                data={topGoals}
                renderItem={renderItem}
                keyExtractor={(item) => item._id}
                style={styles.goalList}
                ListEmptyComponent={<Text style={styles.message}>No goals available</Text>}
                contentContainerStyle={{ paddingVertical: 0 }}
            />
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
        marginBottom: 20,
        color: '#333',
    },
    input: {
        height: 45,
        borderColor: '#ddd',
        borderWidth: 1,
        marginBottom: 20,
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
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 5,
        marginBottom: 20,
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
    goalList: {
        backgroundColor: '#FFF',
        borderRadius: 10,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 5,
    },
    goalItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        height: 60,
        alignItems: 'center',
    },
    goalTitle: {
        fontSize: 16,
        color: '#333',
    },
    goalAmount: {
        fontSize: 16,
        color: '#1E90FF',
        fontWeight: '600',
    },
    message: {
        fontSize: 16,
        color: '#ff0000',
        textAlign: 'center',
        marginVertical: 20,
    },
});

export default GoalsScreen;
