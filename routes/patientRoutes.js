const express = require('express')
const router = express.Router()
const { 
    createPatient,
    patientList, 
    getPatientById,
    updatePatient,
    deletePatient,
    getMostPopularPet
} = require('../controllers/patientController')
const { validationHandler } = require('../middleware/validateMiddleware')

router.route('/').get(patientList).post(createPatient)
router.route('/mostPopular').get(getMostPopularPet)
router
    .route('/:id')
    .get(getPatientById)
    .delete(deletePatient)
    .put(updatePatient)

module.exports = router
