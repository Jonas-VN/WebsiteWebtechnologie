const mongoose = require('mongoose');
const { DateTime } = require('luxon')

const Schema = mongoose.Schema;

const PersonSchema = new Schema({
  first_name: { type: String, required: true },
  family_name: { type: String, required: true },
  date_of_birth: { type: Date, required: true },
});

// Format full name
AuthorSchema.virtual("name").get(function () {
  let fullname = "";
  if (this.first_name && this.family_name) {
    fullname = `${this.family_name}, ${this.first_name}`;
  }
  if (!this.first_name || !this.family_name) {
    fullname = "";
  }
  return fullname;
});

// Format date of birth
AuthorSchema.virtual("date_of_birth_formatted").get(function () {
  return this.date_of_birth ? DateTime.fromJSDate(this.date_of_birth).toLocaleString(DateTime.DATE_MED) : '';
});

module.exports = mongoose.model("Person", PersonSchema);
