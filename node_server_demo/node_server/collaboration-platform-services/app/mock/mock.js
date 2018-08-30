var mongoose = require("mongoose");
mongoose.connect('localhost:/collaboration_platform');


var User = require("../model/User.model.js");
var Blog = require("../model/Blog.model.js");
var Discussion = require("../model/Discussion.model.js");
var Answer = require("../model/Answer.model.js");
var Category = require("../model/Category.model.js");

var User1 = require("../mock/data/user1.json");
var User2 = require("../mock/data/user2.json");
var Blog1 = require("../mock/data/blog1.json");
var Blog2 = require("../mock/data/blog2.json");
var Discussion1 = require("../mock/data/discussion1.json");
var Answer1 = require("../mock/data/answer1.json");
var Category1 = require("../mock/data/category1.json");
var Category2 = require("../mock/data/category2.json");
var Category3 = require("../mock/data/category3.json");

var user1 = new User(User1);
var user2 = new User(User2);
var category1=new Category(Category1);
var category2=new Category(Category2);
var category3=new Category(Category3);

Blog1.author=user1._id;
Blog1.comments.commented_by=user2._id;

Blog2.author=user2._id;
Blog2.comments.commented_by=user1._id;

Discussion1.postedBy=user1._id;
Discussion1.comments.commented_by=user2._id;

Answer1.answered_by=user1._id;
Answer1.comments.commented_by=user2._id;

var blog1 = new Blog(Blog1);
var blog2 = new Blog(Blog2);

var discussion1=new Discussion(Discussion1);

var answer1=new Answer(Answer1);

User.remove().exec();
Category.remove().exec();
Blog.remove().exec();
Discussion.remove().exec();
Answer.remove().exec();


user1.save();
console.log("User1:",user1.employee_id);

user2.save();
console.log("User2:",user2.employee_id);

category1.save();
console.log("Category1:",category1.category);

category2.save();
console.log("Category2:",category2.category);

category3.save();
console.log("Category3:",category3.category);

blog1.save();
console.log("Blog1:",blog1.blog_id);

blog2.save();
console.log("Blog2:",blog2.blog_id);

discussion1.save();
console.log("Discussion1:",discussion1.discussion_id);

answer1.save();
console.log("Answer1:",answer1.answer_id);
