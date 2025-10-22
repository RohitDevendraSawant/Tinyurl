const mongoose = require('mongoose');

const urlAnalyticsSchema = mongoose.Schema({
    urlRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Url',
        required: true,
    },
    user_ip: {
        type: String,
        required: true,
    },
    user_agent: {
        type: String,
        required: true
    }
}, { timestamps: true });

const UrlAnalytics = mongoose.model('UrlAnalytics', urlAnalyticsSchema);
module.exports = UrlAnalytics;