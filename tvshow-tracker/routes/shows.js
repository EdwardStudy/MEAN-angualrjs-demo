var mongoose = require('mongoose');
var async = require('async');
var request = require('request');
var xml2js = require('xml2js');
var _ = require('lodash');

var Show = mongoose.model('Show');

//execute route GET /api/shows
exports.getAllShows = function (req, res, next) {
    var query = Show.find();
    if (req.query.genre) {
        query.where({ genre: req.query.genre });
    } else if (req.query.alphabet) {
        query.where({ name: new RegExp('^' + '[' + req.query.alphabet + ']', 'i') });
    } else {
        query.limit(12);
    }
    query.exec(function (err, shows) {
        if (err) return next(err);
        res.send(shows);
    });
};

//execute route GET /api/shows/:id
exports.getShow = function (req, res, next) {
    Show.findById(req.params.id, function (err, show) {
        if (err) return next(err);
        res.send(show);
    });
};

//execute route POST /api/shows
exports.addShow = function (req, res, next) {
    var apiKey = '9EF1D1E7D28FDA0B';
    var parser = xml2js.Parser({
        explicitArray: false,
        normalizeTags: true
    });
    var seriesName = req.body.showName
        .toLowerCase()
        .replace(/ /g, '_')
        .replace(/[^\w-]+/g, '');

    async.waterfall([
        function (callback) {
            //get seriesId by seriesname
            request.get('http://thetvdb.com/api/GetSeries.php?seriesname=' + seriesName, function(error, response, body) {
                if (error) return next(error);
                parser.parseString(body, function(err, result) {
                    if (!result.data.series) {
                        return res.send(404, { message: req.body.showName + ' was not found.' });
                    }
                    var seriesId = result.data.series.seriesid || result.data.series[0].seriesid;
                    //pass seriesId
                    callback(err, seriesId);
                });
            });
        },
        function (seriesId, callback) {
            //get details by seriesId
            request.get('http://thetvdb.com/api/' + apiKey + '/series/' + seriesId + '/all/en.xml', function (error, response, body) {
                if (error) return next(error);
                parser.parseString(body, function (err, result) {
                    var series = result.data.series;
                    var episodes = result.data.episode;
                    //Create show Object
                    var show = new Show({
                        _id: series.id,
                        name: series.seriesname,
                        airsDayOfWeek: series.airs_dayofweek,
                        airsTime: series.airs_time,
                        firstAired: series.firstaired,
                        genre: series.genre.split('|').filter(Boolean),
                        network: series.network,
                        overview: series.overview,
                        rating: series.rating,
                        ratingCount: series.ratingcount,
                        runtime: series.runtime,
                        status: series.status,
                        poster: series.poster,
                        episodes: []
                    });
                    _.each(episodes, function (episode) {
                        //push episodes array
                        show.episodes.push({
                            season: episode.seasonnumber,
                            episodeNumber: episode.episodenumber,
                            episodeName: episode.episodename,
                            firstAired: episode.firstaired,
                            overview: episode.overview
                        });
                    });
                    //pass show
                    callback(err, show);
                });
            });
        },
        function (show, callback) {
            //store img by base64
            var url = 'http://thetvdb.com/banners/' + show.poster;
            request({ url: url, encoding: null }, function (error, response, body) {
                show.poster = 'data:' + response.headers['content-type'] + ';base64,' + body.toString('base64');
                callback(error, show);
            });
        }
    ], function (err, show) {
        if (err) return next(err);
        show.save(function(err) {
            if (err) {

                //duplication error
                if (err.code == 11000) {
                    return res.send(409, { message: show.name + ' already exists.' });
                }
                return next(err);
            }
            res.send(200);
        });
    });
};