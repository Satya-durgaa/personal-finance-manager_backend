const supabase = require('../config/supabase');

// Get all shared groups for the user
exports.getAllGroups = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('shared_groups')
            .select('*')
            .or(`owner_id.eq.${req.user.id},members.cs.{${req.user.email}}`);

        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Create a new shared group
exports.createGroup = async (req, res) => {
    const { name, description, members } = req.body;
    try {
        const { data, error } = await supabase
            .from('shared_groups')
            .insert([{
                owner_id: req.user.id,
                name,
                description,
                members: members || [],
                total_expenses: 0,
                status: 'active'
            }])
            .select();

        if (error) throw error;
        res.status(201).json(data[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Add expense to group
exports.addExpenseToGroup = async (req, res) => {
    const { groupId } = req.params;
    const { amount, description } = req.body;
    try {
        // This would involve updating the group total and potentially adding a record to a shared_expenses table
        // For this implementation, we'll just update the group total as a simplified version
        const { data: group, error: fetchError } = await supabase
            .from('shared_groups')
            .select('total_expenses')
            .eq('id', groupId)
            .single();

        if (fetchError) throw fetchError;

        const newTotal = parseFloat(group.total_expenses) + parseFloat(amount);

        const { data, error } = await supabase
            .from('shared_groups')
            .update({ total_expenses: newTotal })
            .eq('id', groupId)
            .select();

        if (error) throw error;
        res.json(data[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
