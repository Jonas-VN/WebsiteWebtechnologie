const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TicketSchema = new Schema({
    persoon: { type: Schema.Types.ObjectId, ref: "Person", required: true },
    tribune: { type: Schema.Types.ObjectId, ref: "Tribune", required: true }
})

module.exports = mongoose.model('Ticket', TicketSchema);
