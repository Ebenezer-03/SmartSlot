// const mongoose = require('mongoose')

// const connectDB = (url) => {
//   return mongoose.connect(url, {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useFindAndModify: false,
//     useUnifiedTopology: true,
//   })
// }
// // .then(() => console. log('CONNECTED TO THE DB...'))
// // .catch((err) => console. log(err))

// module.exports = connectDB
const mongoose = require('mongoose');

const connectDB = (url) => {
  return mongoose.connect(url); // No need for extra options in Mongoose v6+
};

module.exports = connectDB;
