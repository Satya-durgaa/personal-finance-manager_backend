const supabase = require('../config/supabase');

// Get all transactions for the logged-in user
exports.getAllTransactions = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('transactions')
            .select('*')
            .eq('user_id', req.user.id)
            .order('date', { ascending: false });

        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Create a new transaction
exports.createTransaction = async (req, res) => {
    const { amount, type, category, description, date, tags } = req.body;
    try {
        const { data, error } = await supabase
            .from('transactions')
            .insert([
                {
                    user_id: req.user.id,
                    amount,
                    type,
                    category,
                    description,
                    date: date || new Date().toISOString(),
                    tags
                }
            ])
            .select();

        if (error) throw error;
        res.status(201).json(data[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete a transaction
exports.deleteTransaction = async (req, res) => {
    const { id } = req.params;
    try {
        const { error } = await supabase
            .from('transactions')
            .delete()
            .eq('id', id)
            .eq('user_id', req.user.id);

        if (error) throw error;
        res.json({ message: 'Transaction deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
