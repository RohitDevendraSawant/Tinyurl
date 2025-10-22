const mongoose = require('mongoose');
const nanoid = require('nanoid').nanoid;

const urlSchema = new mongoose.Schema({
    originalUrl: {
        type: String,
        required: true,
        unique: true,
    },
    key: {
        type: String,
        required: true,
        unique: true,
        default: () => nanoid(6),
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }

}, { timestamps: true });

urlSchema.clearIndexes({ created_by:1, originalUrl: 1});

const Url = mongoose.model('Url', urlSchema);
module.exports = Url;