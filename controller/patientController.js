const Patient = require("../models/patientModel");

const getPatients = async (req, res) => {
  const patients = await Patient.find({})
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving patients.",
      });
    });
};

const createPatient = async (req, res) => {
  const newpatient = req.body; // const {petname, pet_type } = req.body
  const patient = new Patient({
    pet_name: newpatient.pet_name,
    pet_type: newpatient.pet_type,
    owner_name: newpatient.owner_name,
    owner_address: newpatient.owner_address,
    owner_phonenumber: newpatient.owner_phonenumber,
    appointments: [],
  });
  patient
    .save()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Patient.",
      });
    });
};

const getPatientById = async (req, res) => {
  const { id } = req.params;
  try {
    const patient = await Patient.findById(id);
    if (!patient) {
      return res.status(404).send("The patient with given ID not found");
    }
    res.send(patient);
  } catch (err) {
    console.log("Error: ", err.message);
    res.status(404).send(err.message);
  }
};

const deletePatient = async (req, res) => {
  const { id } = req.params;
  const patient = await Patient.deleteOne({ _id: id })
    .then()
    .catch((err) => {
      res.status(500).send({
        message: "Error in Deleting Patient",
      });
    });
  res.send("deleted");
};

const updatePatient = async (req, res) => {
  const { id } = req.params;
  const patient = await Patient.findById(id);
  try{
    if (!patient) {
        return;
      }
    
      await Patient.findByIdAndUpdate(
        { _id: id },
        {
          pet_name: req.body.pet_name,
          pet_type: req.body.pet_type,
          owner_name: req.body.owner_name,
          owner_address: req.body.owner_address,
          owner_phonenumber: req.body.owner_phonenumber,
        },
        { new: true }
      )
      res.send(patient);
    
  } catch (err) {
    console.log("Error: ", err.message);
    res.status(404).send(err.message);
  }
};

const getMostPopularPet = async (req, res) => {
    try {
        const patients = await Patient.find().populate('appointments', 'fee isPaid')

        const result = {}

        let max = 0
        result.popularPet = patients.reduce((acc, patient) => {
            if(patient.appointments.length > max) {
                max = patient.appointments.length
                acc.id = patient._id
                acc.name = patient.name
                acc.totalAppointments = max
            }
            return acc
        }, {})

        result.petsDetail = patients.reduce((acc, patient) => {
            const petDetail = {}
            petDetail.id = patient._id
            petDetail.name = patient.name

            petDetail.totalFeePaid = patient.appointments.reduce((sum, appointment) => {
                if(appointment.isPaid) {
                    console.log("hahah")
                    sum = sum + appointment.fee
                }
                return sum
            }, 0)
            petDetail.totalFeeUnPaid = patient.appointments.reduce((sum, appointment) => {
                if(!appointment.isPaid) {
                    sum = sum + appointment.fee
                }
                return sum
            }, 0)

            acc.push(petDetail)
            return acc
        }, [])

        res.send(result)
    } catch (err) {
        console.log("Error: ", err.message)
        res.status(404).send(err.message)
    }
    
}



module.exports = {
  getPatients,
  createPatient,
  getPatientById,
  deletePatient,
  updatePatient,
  getMostPopularPet,
};
