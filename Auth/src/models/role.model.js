import mongoose,{Schema} from 'mongoose'

const userRole = new Schema({
    role:{
        type:String,
        required: true,
        enum:["admin","user"],
        lowercase:true,
        trim:true,
    },
    createdBy:{
        type:mongoose.Types.ObjectId,
        ref:"User"
    }
},{timestamps:true})
export const Role = mongoose.model("Role",userRole);