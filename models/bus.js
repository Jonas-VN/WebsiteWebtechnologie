const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const BusSchema = new Schema({
  busNr: { type: Number, required: true },
  departure: { type: Date, required: true },
  persons: { 
    type: [{ 
      type: Schema.Types.ObjectId,
      ref: "Person",
      required: true
    }],
  }
})

// Format date of birth
BusSchema.virtual("departure_formatted").get(function () {
  return this.departure ? DateTime.fromJSDate(this.departure).toLocaleString(DateTime.DATE_MED) : '';
});


module.exports = mongoose.model('Bus', BusSchema);
