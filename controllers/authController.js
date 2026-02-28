const supabase = require('../config/supabase');

exports.signup = async (req, res) => {
    try {
        const { email, password, fullName } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: process.env.FRONTEND_URL || 'http://localhost:5173',
                data: {
                    full_name: fullName || '',
                }
            }
        });

        if (error) throw error;

        res.status(201).json({
            message: 'User registered successfully',
            user: data.user,
            session: data.session
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) throw error;

        res.status(200).json({
            message: 'Login successful',
            user: data.user,
            token: data.session?.access_token
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
