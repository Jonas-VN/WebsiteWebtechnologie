const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TicketSchema = new Schema({
    persoon: { type: Schema.Types.ObjectId, ref: "Person", required: true },
    tribune: { type: Number, required: true },
    blok: { type: String, maxLength: 1, required: true },
    rij: { type: Number, required: true },
    plaats: { type: Number, required: true}
})

module.exports = mongoose.model('Ticket', TicketSchema);
