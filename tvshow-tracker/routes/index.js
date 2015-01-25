/*
 * GET home page.
 */

exports.index = function (req, res) {
    res.render('index');
};


exports.redirect = function (req, res) {
    res.redirect('/#' + req.originalUrl);
};

exports.partials = function (req, res) {
    var name = req.params.name;
    res.render('partials/' + name);
};