const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const BusSchema = new Schema({
  busNr: { type: Number, required: true },
  capacity: { type: Number },
  persons: { 
    type: [{ 
      type: Schema.Types.ObjectId,
      ref: "Person"
    }],
    validate: [arrayLimit, 'Bus exceeds maximum capacity']
  }
})

function arrayLimit(val) {
  return val.length <= this.capacity;
}

module.exports = mongoose.model('Bus', BusSchema);
