const Tribune = require('../models/tribune')
const async = require("async");
//const { body, validationResult } = require("express-validator");

exports.index = function(req, res, next) {
    Tribune.find()
        .exec(function (err, list_tribunes) {
        if (err) {
            return next(err);
        }
        console.log(list_tribunes)
        // Successful, so render
        res.render('index', {
            tribunes: list_tribunes,
        });
    });
};