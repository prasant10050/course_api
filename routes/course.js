const express = require("express");
const router=express.Router();
const mongoose = require("mongoose");
const CourseModels = require("./models/coursemodel");

async function createCourse() {
    const course = new CourseModels({
        name: "Angular 12 course",
        author: "Nillu",
        tags: ["angular", "frontend"],
        isPublished: true,
        price:10,
        category: "mobile"
    });
    try {
        const result = await course.save();
        console.log(result);
    } catch (e) {
        for (field in e) {
            console.log(e.errors[field].message);
        }
    }
}

async function getCourses() {
    const result = await CourseModels.find();
    console.log(result);
}

async function getFilterByAuthorCourses() {
    // .find({ author: 'Prasant', isPublished: true})
    // .find({ price: { $gte: 10, $lte: 20 } })
    // .find({ price: { $in: [10,20,30] ] } })
    // logical operator "or" "and"
    // .find().or([ {author: 'Prasant'}, {isPublished: true} ])
    // .find().and([ {author: 'Prasant'}, {isPublished: true} ])
    // Starts with Prasant
    find({ author: /^Prasant/ })
    // End - use /Prasant$/ , Non Case senstitive - use /Prasant$/i , contain prasant - use /.*Prasant.*/i
    const result = await CourseModels.find({ author: "Prsant" }).limit(2).sort({ date: -1 }).select({
        name: 1,
        author: 1
    });
    console.log(result);
}

async function getPaginationCourses() {
    const pageNumber = 2;
    const pageSize = 10;

    const result = await CourseModels
        .find({ author: "Prsant" })
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .sort({ date: -1 })
        .select({ name: 1, author: 1 });
    console.log(result);
}

async function updateCourse(id) {
    const result = await CourseModels.update({ _id: id }, {
        $set: {
            author: "Nillu",
            isPublished: true
        }
    });
    console.log(result);
}

async function updateManyCourse() {
    const result = await CourseModels.updateMany({}, {
        $set: {
            price: 10,
            category: 'mobile'
        },
    },{ multi: true, upsert: true },(err, doc)=>{
        console.log(err);
    });
    console.log(result);
}

async function updateCourseByFind(id) {
    const result = await CourseModels.findByIdAndUpdate(id, {
        $set: {
            author: "Nillu",
            isPublished: false
        }
    }, { new: true });
    console.log(result);
}

const courses = [{id: 1, name: 'course1'}, {id: 2, name: 'course2'}, {id: 3, name: 'course3'}];

router.get('/', (req, res) => {
    res.send(courses);
});

router.get('/:id', (req, res) => {
    const course = courses.find(c => c.id == parseInt(req.params.id));
    if (!course) return res.status(404).send('The course with given ID was not found');
    res.send(course);
});

router.post('/', (req, res) => {
    /*const schema = Joi.object({
        name: Joi.string().min(3).required()
    });
    const result = schema.validate(req.body);
    if (result.error) {
        // Bade request
        res.status(400).send(result.error.details[0].message);
        return;
    }*/
    const { error }=validateCourse(req.body);
    if (error) {
        // Bade request
        return res.status(400).send(error.details[0].message);
    }
    const course = {
        id: courses.length + 1,
        name: req.body.name
    };
    courses.push(course);
    res.send(course);
});

router.put('/:id', (req, res) => {
    // Lookup the course
    // If not existing, return 404 - Resource not found
    const course = courses.find(c => c.id == parseInt(req.params.id));
    if (!course) return res.status(404).send('The course with given ID was not found');

    // Validate
    // In invalid, return 400 - Bad request
    /*const result=validateCourse(req.body);
    if (result.error) {
        // Bade request
        res.status(400).send(result.error.details[0].message);
        return;
    }*/
    // Object destructor
    const { error }=validateCourse(req.body);
    if (error) {
        // Bade request
        return res.status(400).send(error.details[0].message);
    }
    // Update course
    // return the updated course
    course.name=req.body.name;
    res.send(course);
});

router.delete('/:id', (req, res) => {
    // Lookup the course
    // If not existing, return 404 - Resource not found
    const course = courses.find(c => c.id == parseInt(req.params.id));
    if (!course) return res.status(404).send('The course with given ID was not found');

    // Delete course
    const index=courses.indexOf(course);
    courses.slice(index,1);
    console.log('length '+course.length());
    // return the updated course
    res.send(course);
});

module.exports=router;