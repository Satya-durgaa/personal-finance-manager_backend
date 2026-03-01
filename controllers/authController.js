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

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password`,
        });

        if (error) throw error;

        // Always return 200 to prevent email enumeration attacks
        res.status(200).json({ message: 'If this email exists, a reset link has been sent.' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.resetPassword = async (req, res) => {
    const { password } = req.body;
    // The access_token from the recovery email is passed via Authorization header
    const token = req.headers.authorization?.split(' ')[1];

    if (!password || !token) {
        return res.status(400).json({ error: 'Password and token are required' });
    }

    try {
        // Use the recovery token to get a session, then update the password
        const { error: sessionError } = await supabase.auth.setSession({
            access_token: token,
            refresh_token: token
        });

        if (sessionError) throw sessionError;

        const { error } = await supabase.auth.updateUser({ password });
        if (error) throw error;

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
