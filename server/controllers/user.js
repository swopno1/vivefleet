
const getProfile = async (req, res) => {
    // a mock user profile since the user is authenticated
    const userProfile = {
        id: req.user.id,
        username: 'testuser',
        email: req.user.email,
        created_at: req.user.created_at
    };
    return res.status(200).json({
        userProfile
    })
};

export { getProfile };
