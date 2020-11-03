// jshint esversion: 6
const express = require('express'),
    app = express(),
    bodyParser = require("body-parser"),
    methodOverride = require('method-override'),
    mongoose = require('mongoose');

//App config
mongoose.connect('mongodb://localhost:27017/blogapp', { useNewUrlParser: true, useUnifiedTopology: true });
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(methodOverride('_method'));
mongoose.set('useFindAndModify', false);

//Mongoose config
const blog = mongoose.model('blog', {
    title: String,
    image: String,
    body: String,
    created: { type: Date, default: Date.now }
});

//Restful routes
//Index Route
app.get("/", function (req, res) {
    res.redirect("blogs");
});

//Blogs route
app.get("/blogs", function (req, res) {
    //get all from db
    blog.find({}, function (err, blogs) {
        if (err) {
            console.log(err);
        } else {
            res.render("index", { blogs: blogs });
        }
    });
});
//New route
app.get("/blogs/new", function (req, res) {
    res.render("new");
});

//Post route
app.post("/blogs", function (req, res) {
    //Create to save to db
    blog.create(req.body.blog, function (err, Created) {
        if (err) {
            console.log(err);
        } else {
            //redirect
            res.redirect("/blogs");
        }
    });
});

app.get("/blogs/:id", function (req, res) {
    //find id
    blog.findById(req.params.id, function (err, founded) {
        if (err) {
            console.log(err);
        } else {
            //rendre it
            res.render("show", { blog: founded });
        }
    });
});

//Edit route
app.get("/blogs/edit/:id", function (req, res) {
    blog.findById(req.params.id, function (err, founded) {
        if (err) {
            console.log(err);
        } else {
            //rendre it
            res.render("edit", { blog: founded });
        }
    });
});

//Update route
app.put("/blogs/:id", function (req, res) {
    blog.findByIdAndUpdate(req.params.id, req.body.blog, function (err, founded) {
        if (err) {
            console.log(err);
        } else {
            //rendre it
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

//Delete
app.delete("/blogs/:id", function (req, res) {
    blog.findByIdAndDelete(req.params.id, function (err, founded) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/blogs");
        }
    });
});

app.listen(3000, function () {
    console.log("Started");
});