const userDB = {
    users: require('../model/users.json'),
    setUsers: function (data) { this.users = data }
}
const jwt = require('jsonwebtoken');
require('dotenv').config(); //This loads environment variables from a .env file into process.env


const handleRefreshToken = (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) {
        return res.sendStatus(401);
    }
    console.log(cookies.jwt);
    const refreshToken = cookies.jwt;

    const loginUser = userDB.users.find(usr => usr.refreshToken === refreshToken);
    if (!loginUser) return res.sendStatus(403); //Forbidden
    //evaluate jwt

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err || loginUser.username !== decoded.username) return res.sendStatus(403); // Forbidden
            const roles = Object.values(loginUser.roles);
            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        'username': decoded.username,
                        "roles": roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '120s' }
            )
            res.json({ accessToken });
        }
    );

}
module.exports = { handleRefreshToken }