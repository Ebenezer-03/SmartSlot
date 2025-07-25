const basicinfo = require('../models/Task');
const symptoms =require('../models/Task');
const medicalhistory=require('../models/Task')
const contact = require('../models/Task')
const asyncWrapper = require('../middleware/async')
const { createCustomError } = require('../errors/custom-error')

const createhealthassessment = asyncWrapper(async (req, res) => {
  const info = await basicinfo.create(req.body)
  res.status(201).json({ info })
})
const getallhealthassessment =asyncWrapper(async(req,res)=>{
    const info =await basicinfo.find({});
    res.status(200).json({ info })
})
const createsymptomsassessment= asyncWrapper(async(req,res)=>{
    const symptom=await symptoms.create(req.body)
    res.status(201).json({symptom})
})
const createmedicalhistory =asyncWrapper(async(req,res)=>{
    const Medicalhistory=await medicalhistory.create(req.body)
    res.status(201).json({Medicalhistory})
})
const createcontact=asyncWrapper(async(req,res)=>{
    const Contact= await contact.create(req.body)
    res.status(201).json({Contact})
})
module.exports = {
    createhealthassessment,
    getallhealthassessment,
    createsymptomsassessment,
    createmedicalhistory,
    createcontact,
}