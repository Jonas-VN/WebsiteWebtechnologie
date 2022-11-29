const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const BusSchema = new Schema({
  number: { type: Number, required: true },
  departure: { type: Date, required: true },
})

// Format date of birth
BusSchema.virtual("departure_formatted").get(function () {
  return this.departure ? DateTime.fromJSDate(this.departure).toLocaleString(DateTime.DATE_MED) : '';
});


module.exports = mongoose.model('Bus', BusSchema);
