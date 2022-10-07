const mongoose = require("mongoose");
const { Schema } = mongoose;
const express = require("express");
const bodyParser = require("body-parser");
const { restart } = require("nodemon");
server = express();
mongoose.connect("mongodb://localhost:27017/hospital");

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
  appointments: [{ type: "ObjectID", ref: "Appointment" }],
});

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

const Patient = mongoose.model("Patient", patientSchema);
const Appointment = mongoose.model("Appointment", appointmentSchema);

server.use(bodyParser.json());
const PORT = 5000;
server.listen(PORT, () => console.log("Server running...."));

server.get("/", (req, res) => {
  res.send();
});

function addPatient() {
  server.post("/addpatient", (req, res) => {
    const newpatient = req.body;
    console.log(newpatient);

    const patient = new Patient({
      pet_name: newpatient.pet_name,
      pet_type: newpatient.pet_type,
      owner_name: newpatient.owner_name,
      owner_address: newpatient.owner_address,
      owner_phonenumber: newpatient.owner_phonenumber,
      appointments: [],
    });
    res.send("New Patient is added");
    patient.save();
  });
}

async function patientList() {
  server.get("/patientlist", async (req, res) => {
    Patient.find({})
      .populate("appointments")
      .exec((err, docs) => {
        if (err) {
          console.log(err);
        }
        res.json(docs);
      });
  });
}

function getPatient() {
  server.get("/:id", async (req, res) => {
    const { id } = req.params;
    const patient = await Patient.findById(id).populate("appointments");
    res.send(patient.appointments);
  });
}

async function deletePatient() {
  server.delete("/:id", async (req, res) => {
    const { id } = req.params;
    const patient = await Patient.findById(id);
    if (!patient) {
      return;
    }
    await Patient.deleteOne({ _id: id });
    res.send("Deleted");
  });
}

async function updatePatient() {
  server.put("/:id", async (req, res) => {
    const { id } = req.params;
    const patient = await Patient.findById(id);
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
    );
    res.send("Update");
  });
}

async function addAppointment() {
  server.post("/addAppointment", async (req, res) => {
    const newappointment = req.body;
    const appointment = new Appointment({
      start_time: newappointment.start_time,
      end_time: newappointment.end_time,
      description: newappointment.description,
      fee_paid: newappointment.fee_paid,
      amount: newappointment.amount,
      Date: newappointment.Date,
    });
    res.send("New Appointment is added");
    appointment.save();
  });
}

async function patientAppointment() {
  server.put("/patientAppointment/:id", async (req, res) => {
    const { id } = req.params;
    const patient = await Patient.findByIdAndUpdate(
      { _id: id },
      {
        $push: { appointments: req.body.appointments },
      },
      { new: true }
    );
    res.send("Appointment Added");
    patient.save();
  });
}

async function appointmentList() {
  server.get("/appointmentlist", async (req, res) => {
    Appointment.find({}).exec((err, docs) => {
      if (err) {
        console.log(err);
      }
      res.json(docs);
    });
  });
}

async function deleteAppointment() {
  server.delete("/appointment/:id", async (req, res) => {
    const { id } = req.params;
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return;
    }
    await Appointment.deleteOne({ _id: id });
    res.send("Deleted");
  });
}

async function updateAppointment() {
  server.put("/appointment/:id", async (req, res) => {
    const { id } = req.params;
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return;
    }
    await Appointment.findByIdAndUpdate(
      { _id: id },
      {
        start_time: req.body.start_time,
        end_time: req.body.end_time,
        description: req.body.description,
        fee_paid: req.body.fee_paid,
        amount: req.body.amount,
        Date:req.body.Date
      },
      { new: true }
    );
    res.send("Update");
  });
}

async function unpaidAppointment() {
  server.get("/unpaid/appointmentlist", async (req, res) => {
    Appointment.find({}).exec((err, docs) => {
      if (err) {
        console.log(err);
      } else {
        for(const i in docs){
          if(docs[i].fee_paid=="Unpaid"){
            res.send(docs[i])
          }
        }
      }
    });
  });
}

async function remainingBill() {
  server.get("/bill", async (req, res) => {
    Patient.find({}).populate('appointments').exec((err, docs) => {
      if (err) {
        console.log(err);
      } else {
        var temp=0
        for(const i in docs){
          for(const j in docs[i].appointments){
            if(docs[i].appointments[j].fee_paid=="Unpaid"){
              temp+=docs[i].appointments[j].amount
              res.send(temp.toString())
            }
          }
        }
      }
    });
  });
}





// remainingBill()
// addPatient();
// patientList();
// deletePatient();
// updatePatient();
// getPatient();
// addAppointment();
// patientAppointment();
// appointmentList();
// deleteAppointment();
// updateAppointment();
// unpaidAppointment();