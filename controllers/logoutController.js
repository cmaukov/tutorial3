const User = require('../model/User');

const handleLogout = async (req, res) => {
    // On client, also delete accessToken

    const cookies = req.cookies;
    if (!cookies?.jwt) {
        return res.sendStatus(204); // No content
    }
    const refreshToken = cookies.jwt;

    // Is refresh token in db?
    const loginUser = await User.findOne({ refreshToken }).exec();
    if (!loginUser) {
        // crear cookie jwt
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None' }); // we need to pass the same options
        return res.sendStatus(204);
    }

    // Delete refresh token in db
    loginUser.refreshToken = '';
    const resutl = await loginUser.save();
    console.log(resutl);

    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None' }); // we need to pass the same options. In production also set option secure: true - only serves on https
    res.sendStatus(204);
}
module.exports = { handleLogout }