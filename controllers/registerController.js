const User = require('../model/User');
const bcrypt = require('bcrypt');

const handleNewUser = async (req, res) => {
    const { user, pwd } = req.body;
    if (!user || !pwd) {
        return res.status(400).json({ 'message': `Username and password are required` });
    }

    // check for duplicate usernames in the database
    const duplicate = await User.findOne({ username: user }).exec();
    if (duplicate) return res.sendStatus(409); // conflict
    try {
        //encrypt the password
        const hashedPassword = await bcrypt.hash(pwd, 10);

        // Assign roles (use request body or default to User role)
    const roles = req.body.roles || { User: 2001 }; // Default role if not provided
        //store the username and password
        const result = await User.create({
            "username": user,
            "password": hashedPassword,
            "roles": roles
        });
        console.log(result);
        res.status(201).json({ 'success': `New user ${user} created` });
    } catch (error) {
        res.status(500).json({ "message": error.message });
    }
}

module.exports = { handleNewUser };
