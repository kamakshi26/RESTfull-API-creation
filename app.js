const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

//TODO
mongoose.connect("mongodb://localhost:27017/wikiDB",{useNewUrlParser: true});

//create schema for articles
const articleSchema = mongoose.Schema(
  {
    title : String,
    content : String
  }
);


// create model
const articleModel = mongoose.model("article",articleSchema);


app.route('/articles')
.get(function(req,res){
  articleModel.find({},function(err,foundItems){
    if(!err){
      res.send(foundItems);
    }else{
      res.send(err);
    }

  });
})
.post(function(req,res){
  const newArticle= new articleModel(
    {
      title :req.body.title,
      content :req.body.content
    }
  );
newArticle.save(function(err){
  if(!err){
    res.redirect('/articles');
  }
});
})
.delete(function(req,res){
  articleModel.deleteMany({},function(err){
    if(!err){
    res.send("deleted");
    }
  });
});

// specific article
app.route('/articles/:articlename')
.get(function(req,res){
  articleModel.findOne({title : req.params.articlename}, function(err,foundvalue){
    if(foundvalue){
          res.send(foundvalue);
    }else{
      res.send("no matching article");
    }

  });

})

.put(function(req,res){
  articleModel.update(
    {title :req.params.articlename},
  {title : req.body.title , content: req.body.content},
  {overwrite: true},
  function(err){
    if(!err){
      res.redirect('/articles');
      console.log("updated");
    }
  }
);
})


.patch(function(req,res){
  articleModel.update(
    {title :req.params.articlename}, //condition
  {$set: req.body}, //updates
  function(err){ //callback
    if(!err){
      res.redirect('/articles');
      console.log("updated");
    }
  }
);
})

.delete(function(req,res){
  articleModel.deleteOne({title : req.params.articlename},function(err){
    if(!err){
      res.redirect('/articles');
      console.log("deleted");
    }else{
      res.send(err);
    }
  });
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
