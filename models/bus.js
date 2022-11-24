const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const BusSchema = new Schema({
  busNr: { type: Number, required: true },
  capacity: { type: Number, required: true },
  current_amount_of_persons: { type: Number, default: 0},
  persons: { 
    type: [{ 
      type: Schema.Types.ObjectId,
      ref: "Person",
      required: true
    }],
    // niet zeker ofdat dit werkt, daarom current_amount_of_persons toegevoegd zodat we ook makkelijk in de controller zouden kunnen
    validate: [arrayLimit, 'Bus exceeds maximum capacity'] 
  }
})

function arrayLimit(val) {
  return val.length <= this.capacity;
}

module.exports = mongoose.model('Bus', BusSchema);
