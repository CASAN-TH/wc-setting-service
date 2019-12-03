'use strict';
// use model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var SettingSchema = new Schema({
    label: {
        type: String
    },
    description: {
        type: String
    },
    parent_id: {
        type: String
    },
    sub_groups: {
        type: String
    },
    created: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: Date
    },
    createby: {
        _id: {
            type: String
        },
        username: {
            type: String
        },
        displayname: {
            type: String
        }
    },
    updateby: {
        _id: {
            type: String
        },
        username: {
            type: String
        },
        displayname: {
            type: String
        }
    }
});

mongoose.model("Setting", SettingSchema);