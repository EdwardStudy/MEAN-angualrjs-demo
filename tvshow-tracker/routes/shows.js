var mongoose = require('mongoose');
var async = require('async');
var request = require('request');
var xml2js = require('xml2js');
var _ = require('lodash');
var agenda = require('agenda')({ db: { address: 'localhost:27017/email-notice' } });
var sugar = require('sugar');
var nodemailer = require('nodemailer');

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

            //Start the agenda
            //Use sugar to stronger Date object
            var alertDate = Date.create('Next ' + show.airsDayOfWeek + ' at ' + show.airsTime).rewind({ hour: 2});
            agenda.schedule(alertDate, 'send email alert', show.name).repeatEvery('1 week');
            res.send(200);
        });
    });
};

exports.subscribe = function(req, res, next){
    Show.findById(req.body.showId, function(err, show){
        if(err) return next(err);
        show.subscribers.push(req.user.id);
        show.save(function(err){
            if(err) return next(err);
            res.send(200);
        });
    });
};

exports.unsubscribe = function(req, res, next){
    Show.findById(req.body.showId, function(err, show){
        if(err) return next(err);
        var index = show.subscribers.indexOf(req.user.id);
        show.subscribers.splice(index, 1);
        show.save(function(err){
            if(err) return next(err);
            res.send(200);
        });
    });
};


/**
 * Email Agenda --- job scheduling
 *
 * */

//define JOB
agenda.define('send email alert', function(job, done) {
    //Populate
    Show.findOne({ name: job.attrs.data }).populate('subscribers').exec(function(err, show) {
        var emails = show.subscribers.map(function(user) {
            return user.email;
        });

        var upcomingEpisode = show.episodes.filter(function(episode) {
            return new Date(episode.firstAired) > new Date();
        })[0];

        var smtpTransport = nodemailer.createTransport('SMTP', {
            service: 'SendGrid',
            auth: { user: 'hslogin', pass: 'hspassword00' }
        });

        var mailOptions = {
            from: 'Fred Foo ✔ <foo@blurdybloop.com>',
            to: emails.join(','),
            subject: show.name + ' is starting soon!',
            text: show.name + ' starts in less than 2 hours on ' + show.network + '.\n\n' +
                'Episode ' + upcomingEpisode.episodeNumber + ' Overview\n\n' + upcomingEpisode.overview
        };

        smtpTransport.sendMail(mailOptions, function(error, response) {
            console.log('Message sent: ' + response.message);
            smtpTransport.close();
            done();
        });
    });
});

agenda.start();

agenda.on('start', function(job) {
    console.log("Job %s starting", job.attrs.name);
});

agenda.on('complete', function(job) {
    console.log("Job %s finished", job.attrs.name);
});
