const mongoose = require('mongoose')
const Joi = require('joi')

const appointmentSchema = new mongoose.Schema({
    startTime: {
        type: Date,
        required: true,
    },
    endTime: {
        type: Date,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    fee: {
        type: Number,
        required: true,
        min: 0,
    },
    currency: {
        type: String,
        enum: ['USD', 'EUR', 'BITCOIN'],
        required: true,
    },
    isPaid: {
        type: Boolean,
        default: false
    },
    day: {
        type: String,
        enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
        required: true,
    },
    date: {
        type: Date,
    },
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true,
    },
})

const Appointment = new mongoose.model('Appointment', appointmentSchema)

const validAppointment = (appointment) => {
    const schema = {
        startTime: Joi.date().iso().required(),
        endTime: Joi.date().iso().required(),
        description: Joi.string().required(),
        fee: Joi.number().min(0).required(),
        currency: Joi.string().required(),
        isPaid: Joi.boolean(),
        day: Joi.string().required(),
        date: Joi.date().iso().required(),
        patientId: Joi.objectId().required(),
    }

    return Joi.validate(appointment, schema)
}


module.exports.Appointment = Appointment
module.exports.validate = validAppointment
