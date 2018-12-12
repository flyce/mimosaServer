const config = {
    // mongodb
    mongodbUri: 'mongodb://localhost/Mimosa',

    // bcrypt
    saltRounds: 10,

    // JsonWebToken
    secretKey: 'mimosaProject',
    expiresIn: 10800,
    refreshTime: 7200,

};

module.exports = config;