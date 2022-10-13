const mongoose = require("mongoose");
const { Schema } = mongoose;

const patientSchema = new mongoose.Schema({
  pet_name: { type: String, required: true },
  pet_type: {
    type: String,
    enum: {
      values: ["cat", "dog", "bird"],
      message: "Pet Type is other than included",
    },
    required: true,
  },
  owner_name: { type: String, required: true },
  owner_address: { type: String, required: true },
  owner_phonenumber: { type: String, required: true },
  appointments: [{ type: "ObjectID", ref: "Appointment", default: [] }],
});

const Patient = mongoose.model("Patient", patientSchema);

module.exports = Patient;
