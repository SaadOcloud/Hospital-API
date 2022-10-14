const asyncHandler = require("express-async-handler");
const { Patient, validate } = require("../models/patientModel");

const { getPopularPet, getEveryPetDetails } = require("../utils/utils");

const patientList = asyncHandler(async (req, res) => {
  const patients = await Patient.find({});
  res.send(patients);
});

const getPatientById = asyncHandler(async (req, res) => {
  const patient = await Patient.findById(req.params.id);
  if (!patient) {
    res.status(404);
    throw new Error(`The patient with Id ${req.params.id} was not found`);
  }
  res.send(patient);
});

const deletePatient = asyncHandler(async (req, res) => {
  const patient = await Patient.findByIdAndRemove(req.params.id);
  if (!patient) {
    res.status(404);
    throw new Error(`The patient with Id ${req.params.id} was not found`);
  }

  res.send(patient);
});

const createPatient = asyncHandler(async (req, res) => {
  const { error } = validate(req.body);
  if (error) {  
    res.status(404);
    throw new Error(error.details[0].message);
  }
  const newPatient = new Patient({
    petName: req.body.petName,
    petType: req.body.petType,
    ownerName: req.body.ownerName,
    ownerAddress: req.body.ownerAddress,
    ownerPhoneNo: req.body.ownerPhoneNo,
  });

  await newPatient.save();
  res.status(201).send(newPatient);
});

const updatePatient = asyncHandler(async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    res.status(400);
    throw new Error(error.details[0].message);
  }

  var patient = await Patient.findByIdAndUpdate(
    req.params.id,
    {
      petName: req.body.petName,
      petType: req.body.petType,
      ownerName: req.body.ownerName,
      ownerAddress: req.body.ownerAddress,
      ownerPhoneNo: req.body.ownerPhoneNo,
    },
    {
      new: true,
    }
  );

  if (!patient) {
    res.status(404);
    throw new Error(`The patient with Id ${req.params.id} was not found`);
  }

  res.send(patient);
});

const getMostPopularPet = asyncHandler(async (req, res) => {
  const patients = await Patient.find().populate("appointments", "fee isPaid");

  const result = {};
  result.popularPet = getPopularPet(patients);
  result.petsDetail = getEveryPetDetails(patients);

  res.send(result);
});

module.exports = {
  createPatient,
  patientList,
  getPatientById,
  deletePatient,
  updatePatient,
  getMostPopularPet,
};
