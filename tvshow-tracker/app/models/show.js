/**
 * app/models/show.js
 * show model
 */

var mongoose = require('mongoose');

// SHOW SCHEMA
var showSchema = new mongoose.Schema({
    _id: { type: Number },
    name: { type: String },
    airsDayOfWeek: { type:String },
    airsTime: { type: String },
    firstAired: { type: Date },
    genre: [
        { type: String }
    ],
    network: { type: String },
    overview: { type: String },
    rating: { type: Number },
    ratingCount: { type: Number },
    status: { type: String },
    poster: { type:String },
    subscribers: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    ],
    episodes: [{
            season: { type:Number },
            episodeNumber: { type: Number },
            episodeName: { type: String },
            firstAired: { type: Date },
            overview: { type: String }

    }]
});

// Build the show model
mongoose.model( 'Show', showSchema );



