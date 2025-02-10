const userDB = {
    users: require('../model/users.json'),
    setUsers: function (data) { this.users = data }
}

const fsPromises = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');

const handleLogin = async (req, res) => {
    const { user, pwd } = req.body;
    if (!user || !pwd) {
        return res.status(400).json({ 'message': `Username and password are required` });
    }
    const loginUser = userDB.users.find(usr => usr.username === user);
    if (!loginUser) return res.sendStatus(401); //unauthorized
    //evaluate the password
    const match =  await bcrypt.compare(pwd, loginUser.password);

    if (match) {
        // create JWTs
        res.json({ 'success': `User ${user} is logged in` });
    } else {
        res.sendStatus(401);
    }

}
module.exports = {handleLogin};