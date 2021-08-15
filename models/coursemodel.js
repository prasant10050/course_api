const mongoose = require("mongoose");
const courseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 26,
        //match: /pattern/
    },
    author: String,
    tags: {
        type: Array,
        /*validate: {
            validator: function (v) {
                return v && v.length > 0;
            },
            messages: 'A course should have atleast one tag'
        }*/
        // Async validator
        isAsync:true,
        validate: {
            validator: function (v,callback) {
                setTimeout(()=>{
                    const result=v && v.length > 0;
                    callback(result);
                },4000);
            },
            messages: 'A course should have atleast one tag'
        }
    },
    date: { type: Date, default: Date.now },
    isPublished: Boolean,
    price: {
        type: Number, required: function () {
            return this.isPublished;
        },
        min: 10,
        max: 200,
        get:v=>Math.round(v),
        set:v=>Math.round(v)
    ,
    category: {
        type: String,
        enum: ['web', 'mobile', 'network'],
        lowercase: true,
        //uppercase: true,
        trim: true,
    }
});

const Course = mongoose.model("Course", courseSchema);

module.exports = Course