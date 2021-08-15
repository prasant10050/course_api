const express = require("express");
const router=express.Router();

router.get('/', (req, res) => {
    //res.send('Hello user');
    res.render('index',{title: 'Course app',message:'Welcome to course app'});
});

module.exports=router;