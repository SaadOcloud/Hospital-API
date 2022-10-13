const mongoose = require("mongoose");
const { Schema } = mongoose;

const appointmentSchema = new mongoose.Schema({
    start_time: { type: String, required: true },
    end_time: { type: String, required: true },
    description: { type: String, required: true },
    fee_paid: {
      type: String,
      enum: {
        values: ["USD", "EUR", "Bitcoin", "Unpaid"],
        message: "Pet Type is other than included",
      },
      required: true,
    },
    amount: { type: Number, required: true },
    Date: { type: Date, required: true },
  });
  const Appointment = mongoose.model("Appointment", appointmentSchema);

    module.exports = Appointment;