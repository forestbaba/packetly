const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RiderSchema = new Schema({

    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
    },
    password: {
        type: String,
    },
    earning: {
        type: String,
        default:"0"
    },
    created_at: {
        type: Date,
        default: Date.now
    },
})
module.exports = Rider = mongoose.model('rider', RiderSchema);