const express = require('express')
const router = express.Router()

const {
    getPatients,
    createPatient,
    getPatientById,
    deletePatient,
    updatePatient,
    getMostPopularPet


} = require('../controller/patientController')

router.route('/').get(getPatients).post(createPatient)
router.route('/mostPopular').get(getMostPopularPet)


router
    .route('/:id')
    .get(getPatientById)
    .delete(deletePatient)
    .put(updatePatient)


module.exports = router

