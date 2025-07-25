const express = require('express')
const router = express.Router()

const {
    createhealthassessment,
    getallhealthassessment,
    createsymptomsassessment,
    createmedicalhistory
} = require('../controller/Tasks')

router.route('/').post(createhealthassessment).get(getallhealthassessment)
router.route('/symptom').post(createsymptomsassessment)
router.route('/medicalhistory').post(createmedicalhistory)
// router.route('/:id').get(getTask).patch(updateTask).delete(deleteTask)

module.exports = router