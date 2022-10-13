const Appointment= require('../models/appointmentModel');
const Patient= require('../models/patientModel');
const express = require('express');
const router = express.Router();

const{
    createAppointment,
    patientAppointments,
    appointmentList,
    deleteAppointment,
    updateAppointment,
    getremainingBill,

}=require('../controller/appointmentController');

router.route('/').post(createAppointment).get(appointmentList);

router.route('/:id').get(patientAppointments).delete(deleteAppointment).put(updateAppointment);

router.route('/remainingBill/:id').get(getremainingBill);

module.exports = router;