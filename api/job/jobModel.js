const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const JobSchema = new Schema({
    pick_up_address: {
        type: String,
    },
    pick_up_state: {
        type: String,
    },
    drop_off_address: {
        type: String,
    },
    drop_off_state: {
        type: String,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'user'
    },
    rider: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'rider'
    },
    price: {
        type: String,
    },
    status: {
        type: String,
        default: 'pending',
    },
    created_at: {
        type: Date,
        default: Date.now
    },
})
module.exports = Job = mongoose.model('job', JobSchema);