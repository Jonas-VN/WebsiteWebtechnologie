const mongoose = require('mongoose');
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const BusSchema = new Schema({
  number: { type: Number, required: true },
  departure: { type: Date, required: true },
})

// Format date of birth
BusSchema.virtual("departure_time").get(function () {
  return this.departure ? DateTime.fromJSDate(this.departure).setLocale('nl').toLocaleString(DateTime.TIME_24_SIMPLE) : '';
});


module.exports = mongoose.model('Bus', BusSchema);
