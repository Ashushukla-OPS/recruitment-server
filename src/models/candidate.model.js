import mongoose from "mongoose"

const candidateSchema= mongoose.Schema({
 name:{type:String,required:true},
 email:{
    type:String,
    unique:true,
    required:true,
    trim:true
},
 phone:{
    type:String,
    unique:true,
    trim:true
},
 resume:{
    type:String,
    trim:true
},
 skills:{
    type:[String],
    default:[],
    required:true

},
yearOfExperience:{
    type:Number,    
    default:0,
    required:true,
    min:0,

},
preferredRole:{
    type:[String],
    default:[],
    required:true
},
},{
    timestamps:true
})  
      
const CandidateModel=mongoose.model("candidate",candidateSchema)    

export default CandidateModel