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
});
const symptoms=new mongoose.Schema({
    symptoms:[String],
    symptomsduration:{
        type:String,
        require:true,
    }
});
const medicalhistory=new mongoose.Schema({
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
});
const contact= new mongoose.Schema({
    Contactname:{
        type:String,

    },
    Contactphone:{
        type:Number,
        require:true,
        maxlenght:[10,'contactphone cannot be more than 10 numbers'],
    },
})
module.exports = mongoose.model('basicinfo', Basicinfo);
module.exports= mongoose.model('symptoms',symptoms);
module.exports=mongoose.model('Medicalhistory',medicalhistory);