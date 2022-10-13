const Appointment= require('../models/appointmentModel');
const Patient= require('../models/patientModel');



const createAppointment=async (req, res) => {
    const newappointment = req.body;
    const appointment = new Appointment({
      start_time: newappointment.start_time,
      end_time: newappointment.end_time,
      description: newappointment.description,
      fee_paid: newappointment.fee_paid,
      amount: newappointment.amount,
      Date: newappointment.Date,
    });
    appointment.save().then(data => {
      res.send(data);
    }).catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Appointment."
      });
    });
  }


const patientAppointments=async (req, res) => {
    const { id } = req.params;
    const patient = await Patient.findByIdAndUpdate(
      { _id: id },
      {
        $push: { appointments: req.body.appointments },
      },
      { new: true }
    );
    patient.save().then(data => {
      res.send(data);
    }).catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while adding the Appointment"
      });
    });
  }

const appointmentList=async (req, res) => {
    Appointment.find({}).then(data => {
      res.json(data);
    }).catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while checking appointment list"
      });
    })
  }

const deleteAppointment=async (req, res) => {
    const { id } = req.params;
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return;
    }
    await Appointment.deleteOne({ _id: id });
    res.send("Deleted");
  }

const updateAppointment=async (req, res) => {
    try{
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
    res.send(appointment);
  }catch (err) {
    console.log("Error: ", err.message)
    res.status(404).send(err.message)
}
}

const getremainingBill = async (req, res) => {
    try {
        if(req.query.patientId) {
            const patient = await Patient.findById(req.query.patientId)
            if(!patient) {
                return res.status(404).send('The patient with given ID was not found')
            }
        }

        let today = getTodayDate()
        let numOfWeeks = getNumOfWeeks(req.query.period)
        let secondDate = getSecondDate(numOfWeeks, today)
        today = getStringDate(today)
        secondDate = getStringDate(secondDate)

        if(req.query.currency && !validCurrency(req.query.currency)) {
            return res.status(404).send('You can only get Bill in Euro or USD. So, try to send to Valid Currency.')
        }

        const appointments = await Appointment
                                        .find( { ...(req.query.period ? { date: { $gte: secondDate, $lte: today }} : {}) },) 
                                        .and([ { ...(req.query.patientId ? { patient: req.query.patientId} : {}) },]) 
        
        const requiredCurrency = req.query.currency ? req.query.currency : 'usd'
        const fee = getFee(appointments, requiredCurrency)

        const bill = {}
        bill.currency = requiredCurrency
        if(req.query.patientId) {
            bill.remainingBill = fee.unpaid
            return res.send(bill)
        } else {
            bill.unpaid = fee.unpaid
        }
        bill.paid = fee.paid
        const total = bill.paid + bill.unpaid
        bill.balance = total - bill.paid

        res.send(bill)
    } catch (err) {
        console.log("Error: ", err.message)
        res.status(404).send(err.message)
    }
}



  module.exports = {
    createAppointment,
    patientAppointments,
    appointmentList,
    deleteAppointment,
    updateAppointment,
    getremainingBill,
  }