const userDB = {
    users: require('../model/users.json'),
    setUsers: function (data) { this.users = data }
}

const fsPromises = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const handleLogin = async (req, res) => {
    const { user, pwd } = req.body;
    if (!user || !pwd) {
        return res.status(400).json({ 'message': `Username and password are required` });
    }
    const loginUser = userDB.users.find(usr => usr.username === user);
    if (!loginUser) return res.sendStatus(401); //unauthorized
    //evaluate the password
    const match = await bcrypt.compare(pwd, loginUser.password);

    if (match) {
        const roles = Object.values(loginUser.roles);
        // create JWTs
        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "username": loginUser.username,
                    "roles": roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '120s' } // in production set the expiration <15 minutes

        );
        const refreshToken = jwt.sign(
            { "username": loginUser.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' } // in production this should be set to expire at some point in the future. here we have 1 day

        );
        // Saving refreshToken with current user
        // we are saving our refresh token in the database. in our example we are using a json file but in production this will be a database
        const otherUsers = userDB.users.filter(person => person.username !== loginUser.username);
        const currentUser = { ...loginUser, refreshToken };
        userDB.setUsers([...otherUsers, currentUser]);
        await fsPromises.writeFile(
            path.join(__dirname, '..', 'model', 'users.json'),
            JSON.stringify(userDB.users));

        res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 }); // it is very important we send the option httpOnly: true. httpOnly cookie is not available to javascript.
        //  maxAge is in milliseconds - in our example we are setting it to 24h
        res.json({ accessToken });
    } else {
        res.sendStatus(401);
    }

}
module.exports = { handleLogin }