const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const BusTicketSchema = new Schema({
    person: { type: Schema.Types.ObjectId, ref: "Person", required: true },
    bus: { type: Schema.Types.ObjectId, ref: "Bus", required: true }
})

module.exports = mongoose.model('BusTicket', BusTicketSchema);