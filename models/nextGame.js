const mongoose = require('mongoose');
const { DateTime } = require('luxon')

const Schema = mongoose.Schema;

const NextGameSchema = new Schema({
    opponent_name: { type: String, required: true },
    opponent_logo: { data: Buffer, contentType: String },
    home_game: { type: Boolean, required: true },
    play_date: { type: Date, default: Date.now },
});

NextGameSchema.virtual('play_date_formatted').get(function () {
    return DateTime.fromJSDate(this.play_date).toLocaleString(DateTime.DATE_MED);
}); 

module.exports = mongoose.model('NextGame', NextGameSchema);