const mongoose =require("mongoose");
const Basicinfo= new mongoose.Schema({
    age:{
        type:Number,
        require:[true,'Must Provide Age'],
        maxlenght:[3,'Age cannot be more than 3 digit'],
    },
    bodytemperature:{
        type:Number,
        require:false,
    },
    symptoms:[String],
    symptomsduration:{
        type:String,
        require:true,
    },
    visitedthishospital:{
        type:Boolean,
        require: true,
    },
    currentmedications:{
        type:String,
        
    },
    knownallergies:{
        type:String,
        require:true,
    },
    Contactname:{
        type:String,

    },
    Contactphone:{
        type:Number,
        require:true,
        maxlenght:[10,'contactphone cannot be more than 10 numbers'],
    },
    urgency: {
        type: String,
        required: true
    },
    arrivalTime: { 
        type: Date,
         default: Date.now 
    }
});

module.exports = mongoose.model('basicinfo', Basicinfo);