const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const User = require('mongoose').model('User');

let userService = logger => {
    let getAll = () => {
        return new Promise((resolve, reject) => {
            return User.find((err, results) => {
                if (err) {
                    logger.log('error', err);
                    reject({error: err});
                } else
                    resolve(results);
            });
        });
    };

    let getByUserName = (username) => {
        return new Promise((resolve, reject) => {
            User.findOne().where('userName', username).exec((err, results) => {
                if (err) {
                    logger.log('error', err);
                    reject({error: err});
                } else
                    resolve(results);
            });
        });
    };

    return {
        getAll: getAll,
        getByUserName: getByUserName
    };
};

module.exports = userService;