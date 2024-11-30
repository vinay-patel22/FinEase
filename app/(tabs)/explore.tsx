import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TextInput,
  Button,
  Alert,
  Modal,
} from 'react-native';
import BudgetCard from '../../components/ui/BudgetCard';
import GoalCard from '../../components/ui/GoalCard';
import TransactionCard from '../../components/ui/TransactionCard';

const API_URL = 'http://192.168.0.106:5000/api'; // Use your machine's IP address

interface FormState {
  title: string;
  amount: string;
  description: string;
}

interface EditItem {
  _id: string;
  title?: string;
  amount?: number;
  description?: string;
  category?: string;
}

const ExploreScreen = () => {
  const [budgets, setBudgets] = useState<any[]>([]);
  const [goals, setGoals] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editItem, setEditItem] = useState<EditItem | null>(null); // State for editing
  const [editVisible, setEditVisible] = useState(false); // Modal visibility
  const [editForm, setEditForm] = useState<FormState>({
    title: '',
    amount: '',
    description: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const responses = await Promise.all([
        fetch(`${API_URL}/budgets`),
        fetch(`${API_URL}/goals`),
        fetch(`${API_URL}/transactions`),
      ]);

      const [budgetsData, goalsData, transactionsData] = await Promise.all(
        responses.map(response => {
          if (!response.ok) throw new Error('Failed to fetch data');
          return response.json();
        })
      );

      setBudgets(budgetsData);
      setGoals(goalsData);
      setTransactions(transactionsData);
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (type: string, id: string) => {
    const item = (
      type === 'budget'
        ? budgets
        : type === 'goal'
          ? goals
          : transactions
    ).find((item: any) => item._id === id);

    if (item) {
      setEditItem(item);
      setEditForm({
        title: item.title || item.category || item.description || '',
        amount: item.amount ? item.amount.toString() : '',
        description: item.description || '',
      });
      setEditVisible(true);
    }
  };

  const handleUpdate = async () => {
    if (!editItem) return;

    const type = editItem.category ? 'budget' : editItem.title ? 'goal' : 'transaction';

    try {
      const response = await fetch(`${API_URL}/${type}s/${editItem._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...editItem,
          title: editForm.title,
          amount: parseFloat(editForm.amount),
          description: editForm.description,
        }),
      });

      if (response.ok) {
        Alert.alert('Success', 'Item updated successfully.');
        setEditVisible(false);
        fetchData();
      } else {
        const responseData = await response.json();
        throw new Error(responseData.message || 'Failed to update');
      }
    } catch (err: any) {
      Alert.alert('Error', `Update failed: ${err.message}`);
    }
  };

  const handleDelete = async (type: string, id: string) => {
    Alert.alert(
      'Confirm Delete',
      `Are you sure you want to delete this ${type}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              const response = await fetch(`${API_URL}/${type}s/${id}`, {
                method: 'DELETE',
              });

              if (response.ok) {
                Alert.alert('Success', `${type} deleted successfully.`);
                fetchData();
              } else {
                const responseData = await response.json();
                throw new Error(responseData.message || 'Failed to delete');
              }
            } catch (err: any) {
              Alert.alert('Error', `Delete failed: ${err.message}`);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#1E90FF" />
        <Text style={styles.loadingText}>Loading data...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Section title="Budgets" data={budgets} onEdit={handleEdit} onDelete={handleDelete} type="budget" />
      <Section title="Goals" data={goals} onEdit={handleEdit} onDelete={handleDelete} type="goal" />
      <Section title="Transactions" data={transactions} onEdit={handleEdit} onDelete={handleDelete} type="transaction" />

      <Modal
        visible={editVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setEditVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Edit {editItem?.title ? 'Goal' : editItem?.category ? 'Budget' : 'Transaction'}
            </Text>
            {editItem?.description !== undefined ? (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="Description"
                  value={editForm.description || ''}
                  onChangeText={text => setEditForm({ ...editForm, description: text })}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Amount"
                  keyboardType="numeric"
                  value={editForm.amount}
                  onChangeText={text => setEditForm({ ...editForm, amount: text })}
                />
              </>
            ) : (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="Category/Title"
                  value={editForm.title || ''}
                  onChangeText={text => setEditForm({ ...editForm, title: text })}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Amount"
                  keyboardType="numeric"
                  value={editForm.amount}
                  onChangeText={text => setEditForm({ ...editForm, amount: text })}
                />
              </>
            )}
            <Button title="Update" onPress={handleUpdate} />
            <Button title="Cancel" onPress={() => setEditVisible(false)} color="red" />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

interface SectionProps {
  title: string;
  data: any[];
  onEdit: (type: string, id: string) => void;
  onDelete: (type: string, id: string) => void;
  type: string;
}

const Section = ({ title, data, onEdit, onDelete, type }: SectionProps) => (
  <>
    <Text style={styles.heading}>{title}</Text>
    {data.length > 0 ? (
      data.map(item => {
        switch (type) {
          case 'budget':
            return (
              <BudgetCard
                key={item._id}
                budget={item}
                onEdit={() => onEdit(type, item._id)}
                onDelete={() => onDelete(type, item._id)}
              />
            );
          case 'goal':
            return (
              <GoalCard
                key={item._id}
                goal={item}
                onEdit={() => onEdit(type, item._id)}
                onDelete={() => onDelete(type, item._id)}
              />
            );
          case 'transaction':
            return (
              <TransactionCard
                key={item._id}
                transaction={item}
                onEdit={() => onEdit(type, item._id)}
                onDelete={() => onDelete(type, item._id)}
              />
            );
          default:
            return null;
        }
      })
    ) : (
      <Text style={styles.noDataText}>No {title.toLowerCase()} available</Text>
    )}
  </>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  loadingText: {
    fontSize: 18,
    color: '#333',
    marginTop: 10,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    marginTop: 10,
  },
  noDataText: {
    fontSize: 18,
    color: '#777',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
  },
});

export default ExploreScreen;
