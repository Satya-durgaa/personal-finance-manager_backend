const supabase = require('../config/supabase');

// Get all savings goals
exports.getAllGoals = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('savings_goals')
            .select('*')
            .eq('user_id', req.user.id);

        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Create a new goal
exports.createGoal = async (req, res) => {
    const { name, target_amount, current_amount, deadline } = req.body;
    try {
        const { data, error } = await supabase
            .from('savings_goals')
            .insert([{
                user_id: req.user.id,
                name,
                target_amount,
                current_amount: current_amount || 0,
                deadline
            }])
            .select();

        if (error) throw error;
        res.status(201).json(data[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
