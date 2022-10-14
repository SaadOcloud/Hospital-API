const asyncHandler = require("express-async-handler");

const { Appointment, validate } = require("../models/appointmentModel");
const getFee=require("../middleware/feeMiddleware")
const { Patient } = require("../models/patientModel");
const {
  getTodayDate,
  getSecondDate,
  getStringDate,
  getNumOfWeeks,
  validCurrency,
} = require("../utils/utils");

const getAppointments = asyncHandler(async (req, res) => {
  const appointments = await Appointment.find({})
    .populate("patient", "petName")
    .sort("date");
  res.send(appointments);
});

const getAppointmentById = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id).populate(
    "patient",
    "petName"
  );
  if (!appointment) {
    res.status(404);
    throw new Error(`The appointment with Id ${req.params.id} was not found`);
  }

  res.send(appointment);
});

const deleteAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findByIdAndRemove(req.params.id);
  if (!appointment) {
    res.status(404);
    throw new Error(`The appointment with Id ${req.params.id} was not found`);
  }

  const patient = await Patient.findById(appointment.patient);
  if (!patient) {
    res.status(404);
    throw new Error(`The patient with Id ${appointment.patient} was not found`);
  }
  const index = patient.appointments.indexOf(req.params.id);
  if (index > -1) {
    patient.appointments.splice(index, 1);
  }

  await patient.save();
  res.send(appointment);
});

const createAppointment = asyncHandler(async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    res.status(404);
    throw new Error(error.details[0].message);
  }

  const patient = await Patient.findById(req.body.patientId);
  if (!patient) {
    res.status(404);
    throw new Error("No Such Patient Exist. Send Valid Patient");
  }

  const newAppointment = new Appointment({
    startTime: req.body.startTime,
    endTime: req.body.endTime,
    description: req.body.description,
    fee: req.body.fee,
    currency: req.body.currency,
    isPaid: req.body.isPaid,
    day: req.body.day,
    date: req.body.date,
    patient: req.body.patientId,
  });

  await newAppointment.save();
  patient.appointments.push(newAppointment._id);
  await patient.save();
  res.send(newAppointment);
});

const updateAppointment = asyncHandler(async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    res.status(404);
    throw new Error(error.details[0].message);
  }

  var appointment = await Appointment.findById(req.params.id);
  if (!appointment) {
    res.status(404);
    throw new Error(`The appointment with Id ${req.params.id} was not found`);
  }

  const patient = await Patient.findById(req.body.patientId);
  if (!patient) {
    res.status(404);
    throw new Error(
      "The patient with given ID doesn't exist. Try to send Valid Patient Id"
    );
  }

  if (!patient._id.equals(appointment.patient)) {
    res.status(404);
    throw new Error(
      "The Patient Id does not match with Appointment's Patient Id.(Means you are trying to update another patient appointment)"
    );
  }

  appointment = await Appointment.findByIdAndUpdate(
    req.params.id,
    {
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      description: req.body.description,
      fee: req.body.fee,
      currency: req.body.currency,
      isPaid: req.body.isPaid,
      day: req.body.day,
      date: req.body.date,
      patient: req.body.patientId,
    },
    {
      new: true,
    }
  );

  res.send(appointment);
});

const findAllAppointments = asyncHandler(async (req, res) => {
  if (req.query.patientId) {
    const patient = await Patient.findById(req.query.patientId);
    if (!patient) {
      res.status(404);
      throw new Error(
        `The patient with Id ${req.query.patientId} was not found`
      );
    }
  }

  var unpaid;
  if (req.query.unpaid === "true") {
    unpaid = "false";
  } else {
    unpaid = "true";
  }

  const appointments = await Appointment.find()
    .and([
      { ...(req.query.patientId ? { patient: req.query.patientId } : {}) },
      { ...(req.query.day ? { day: req.query.day } : {}) },
      { ...(req.query.unpaid ? { isPaid: unpaid } : {}) },
    ])
    .populate("patient", "name");
  res.send(appointments);
});

const getRemainingBill = asyncHandler(async (req, res) => {
  if (req.query.patientId) {
    const patient = await Patient.findById(req.query.patientId);
    if (!patient) {
      res.status(404);
      throw new Error(
        `The patient with Id ${req.query.patientId} was not found`
      );
    }
  }

  var today = getTodayDate();
  var numOfWeeks = getNumOfWeeks(req.query.period);
  var secondDate = getSecondDate(numOfWeeks, today);
  today = getStringDate(today);
  secondDate = getStringDate(secondDate);

  if (req.query.currency && !validCurrency(req.query.currency)) {
    res.status(404);
    throw new Error(
      "You can only get Bill in Euro or USD. So, try to send to Valid Currency."
    );
  }

  const appointments = await Appointment.find({
    ...(req.query.period ? { date: { $gte: secondDate, $lte: today } } : {}),
  }).and([
    { ...(req.query.patientId ? { patient: req.query.patientId } : {}) },
  ]);

  const requiredCurrency = req.query.currency ? req.query.currency : "USD";
  const fee = getFee(appointments, requiredCurrency);

  const bill = {};
  bill.currency = requiredCurrency;
  if (req.query.patientId) {
    bill.remainingBill = fee.unpaid;
    return res.send(bill);
  } else {
    bill.unpaid = fee.unpaid;
  }
  bill.paid = fee.paid;
  const total = bill.paid + bill.unpaid;
  bill.balance = total - bill.paid;

  res.send(bill);
});

module.exports = {
  createAppointment,
  getAppointments,
  getAppointmentById,
  deleteAppointment,
  updateAppointment,
  findAllAppointments,
  getRemainingBill,
};
