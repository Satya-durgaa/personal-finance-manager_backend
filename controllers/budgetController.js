const supabase = require('../config/supabase');

// Get all budgets for the user
exports.getAllBudgets = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('budgets')
            .select('*')
            .eq('user_id', req.user.id);

        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Create or update a budget
exports.upsertBudget = async (req, res) => {
    const { category, limit_amount, period } = req.body;
    try {
        const { data, error } = await supabase
            .from('budgets')
            .upsert({
                user_id: req.user.id,
                category,
                limit_amount,
                period: period || 'monthly'
            }, { onConflict: 'user_id, category' })
            .select();

        if (error) throw error;
        res.status(200).json(data[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
