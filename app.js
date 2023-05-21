const express=require('express')
const ejs=require('ejs');
const mongoose=require('mongoose');
const bodyParser=require('body-parser');

const app=express();

app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}))   /// we told our app to use body-parser
app.use(express.static("public"))  // tell javascript to serve this static folder.





mongoose.connect('mongodb://localhost:27017/wikiDB',{useNewUrlParser: true,useUnifiedTopology: true,
family: 4});

const articleSchema=new mongoose.Schema({
    title: String,
    content: String
})

const Article=mongoose.model('Article',articleSchema);

// Set the GET Route of the API

// Here we faces all the articles and the name of the route is '/article' and give the feedback to the page

// Chained Route handleres.
// Here we add all of route with each other 




///////////////////////////////// Request Targeting ALl Articles//////////////////////////////////

app.route('/articles')
.get(function(req,res)
{
    // we find all of data from our wikiDB Database.
    Article.find({}).then(function(docs)
    {
       res.send(docs);
    }
)})  // POST a new article
.post(function(req,res)
{
    // console.log(req.body.title);
    // console.log(req.body.content);

    // put these value to the databases
    const newArticle=new Article({
        title:req.body.title,
        content:req.body.content
    })
    newArticle.save();
}) // Delete all of articles
.delete(function(req,res)
{
    // delete all of documents inside the articles collections
    Article.deleteMany({}).then(function(err){
        if(!err)
        {
            res.send('Successfully deleted all of Articles.')
        }
        else{
            res.send('Error Occured '+err);
        }
    })
});



//////////////////////////////////////////////////Request Targeting a Specific Articles //////////////////////////


app.route('/articles/:articleTitle')
.get(function(req,res)
{
    const getTitle=req.params.articleTitle;
    
    Article.findOne({title:getTitle}).then(function(foundArticle)
    {
        if(foundArticle)
        {
            res.send(foundArticle);
        }
        else{
            res.send('No Articles Matching to the according requirments of given title.');
        }
    })
})// Here is the code of PUT a specific article on Database and Here PUT is the update of entire documets and update into a new one.
.put(function(req,res)
{
    Article.findOneAndUpdate({title:req.params.articleTitle},
        {
            title:req.body.title,
            content:req.body.content
        },
        {
            overwrite:true
        }).then(function(err)
        {
            if(!err)
            {
                res.send('Successfully Updated Article');
            }
           
        })
})
.patch(function(req,res)
{
    // In patch we only update a  particular part
    Article.findOneAndUpdate(
    { title:req.params.articleTitle},
    {$set:req.body}).then(function(err) //Userr should change either title or content and for that reason we just put req.body and not specifice exactly.    //{$set: {title: " ",content: " "}}
    {
    if(!err)
    {
        res.send('Successfully Updated the articles')
    }
    else{
        res.send('Error Occuring While Updating.')
    }
    })
})
.delete(function(req,res)
{
    Article.deleteOne({title:req.params.articleTitle}).then(function(req,res)
    { })
})

app.listen(3000,function(req,res)
{
    console.log('The Server has started on port 3000')
})