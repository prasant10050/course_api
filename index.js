const express = require("express");
const Joi = require("joi");
const helmet = require("helmet");
const morgan = require("morgan");
const courses = require("./routes/course");
const home = require("./routes/home");
const app = express();
const mongoose = require("mongoose");
const CourseModels = require("./models/coursemodel");


app.set('view engine', 'pug');
app.set('views', './views');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(helmet());
app.use(morgan('tiny'));
app.use('api/courses', courses);
app.use('/', home);

const port = process.env.PORT || 3000;

mongoose.connect('mongodb://localhost/playground').then(() => {
    console.log("Connected to mongodb..");
}).catch(err => console.error("could not connect to MongoDb", err))

const server = app.listen(port, () =>
    console.log(`Listening on port ${port}...`)
);

function validateCourse(course) {
    const schema = Joi.object({
        name: Joi.string().min(5).required().max(20),
    });
    return schema.validate(course);
}