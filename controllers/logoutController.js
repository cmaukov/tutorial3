const userDB = {
    users: require('../model/users.json'),
    setUsers: function (data) { this.users = data }
}
const fsPromises = require('fs').promises;
const path = require('path');

const handleLogout = async (req, res) => {
    // On client, also delete accessToken


    const cookies = req.cookies;
    if (!cookies?.jwt) {
        return res.sendStatus(204); // No content
    }
    const refreshToken = cookies.jwt;
    // Is refresh token in db?
    const loginUser = userDB.users.find(usr => usr.refreshToken === refreshToken);
    if (!loginUser) {
        // crear cookie jwt
        res.clearCookie('jwt', { httpOnly: true, sameSite:'None'}); // we need to pass the same options
        return res.sendStatus(204);
    }

    // Delete refresh token in db
    const otherUsers = userDB.users.filter(usr => usr.refreshToken !== loginUser.refreshToken);
    const currentUser = { ...loginUser, refreshToken: '' };
    userDB.setUsers([...otherUsers, currentUser]);
    await fsPromises.writeFile(path.join(__dirname, '..', 'model', 'users.json'), JSON.stringify(userDB.users));
    res.clearCookie('jwt', { httpOnly: true,sameSite:'None' }); // we need to pass the same options. In production also set option secure: true - only serves on https
    res.sendStatus(204);
}
module.exports = { handleLogout }