const User = require('../model/User');
const jwt = require('jsonwebtoken');

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) {
        return res.sendStatus(401);
    }
    const refreshToken = cookies.jwt;

    const loginUser = await User.findOne({ refreshToken}).exec();
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