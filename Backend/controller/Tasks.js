// // const basicinfo = require('../models/Task');
// // const symptoms =require('../models/Task');
// // const medicalhistory=require('../models/Task')
// // const contact = require('../models/Task')
// // const asyncWrapper = require('../middleware/async')
// // const { createCustomError } = require('../errors/custom-error')

// // const createhealthassessment = asyncWrapper(async (req, res) => {
// //   const info = await basicinfo.create(req.body)
// //   res.status(201).json({ info })
// // })
// // const getallhealthassessment =asyncWrapper(async(req,res)=>{
// //     const info =await basicinfo.find({});
// //     res.status(200).json({ info })
// // })


// // module.exports = {
// //     createhealthassessment,
// //     getallhealthassessment,
// // }
// const basicinfo = require('../models/Task');
// const asyncWrapper = require('../middleware/async');
// const { createCustomError } = require('../errors/custom-error');
// const getUrgencyLevel = require('../AI/gemini'); // Import Gemini

// // POST /api/v1/tasks
// // const createhealthassessment = asyncWrapper(async (req, res) => {
// //   const info = await basicinfo.create(req.body)
// //   res.status(201).json({ info })
// // })
// const createhealthassessment = asyncWrapper(async (req, res) => {
//   const patientData = req.body;

//   // Predict urgency using Gemini
//   const urgency = await getUrgencyLevel(patientData);

//   // Save to DB with urgency added
//   const info = await basicinfo.create({ ...patientData, urgency });

//   res.status(201).json({ message: 'Patient added', info });
// });

// // GET /api/v1/tasks
// const getallhealthassessment = asyncWrapper(async (req, res) => {
//   const urgencyRank = { High: 1, Medium: 2, Low: 3 };
//   const info = await basicinfo.find({});

//   // Sort by urgency + arrivalTime
//   info.sort((a, b) => {
//     if (urgencyRank[a.urgency] === urgencyRank[b.urgency]) {
//       return new Date(a.arrivalTime) - new Date(b.arrivalTime);
//     }
//     return urgencyRank[a.urgency] - urgencyRank[b.urgency];
//   });

//   res.status(200).json({ count: info.length, info });
// });

// module.exports = {
//   createhealthassessment,
//   getallhealthassessment,
// };
const basicinfo = require('../models/Task'); // Only import once
const asyncWrapper = require('../middleware/async');
// const { createCustomError } = require('../errors/custom-error');
const getUrgencyLevel = require('../AI/gemini'); // Import Gemini

// POST /api/v1/tasks
const createhealthassessment = asyncWrapper(async (req, res) => {
  const patientData = req.body;

  // Predict urgency using Gemini
  const urgency = await getUrgencyLevel(patientData);

  // Save to DB with urgency added
  const info = await basicinfo.create({ ...patientData, urgency });

  res.status(201).json({ message: 'Patient added', info });
});

// GET /api/v1/tasks
const getallhealthassessment = asyncWrapper(async (req, res) => {
  const urgencyRank = { High: 1, Medium: 2, Low: 3 };
  const info = await basicinfo.find({});

  // Sort by urgency + arrivalTime
  info.sort((a, b) => {
    if (urgencyRank[a.urgency] === urgencyRank[b.urgency]) {
      return new Date(a.arrivalTime) - new Date(b.arrivalTime);
    }
    return urgencyRank[a.urgency] - urgencyRank[b.urgency];
  });

  res.status(200).json({ count: info.length, info });
});

module.exports = {
  createhealthassessment,
  getallhealthassessment,
};
