
//General code
var express = require('express');
var path = require('path');
var fs = require('fs');
const { title, emitWarning } = require('process');
var app = express();
var nameofuser=""; //to add this username in the cart.json
var reg;
var cartt=[];
let alert=require('alert'); 

var createError = require('http-errors');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const session = require('express-session');
var app = express();
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: false,
}))




// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

function splitString(stringToSplit, separator) {
  const arrayOfStrings = stringToSplit.split(separator)
}

app.use("/public", express.static('public'))


//showing login page
app.get('/', function(req,res){
res.render('login');
});

//showing regestiration page if a new user hadn't sign up before
app.get('/registration', function(req,res){
res.render('registration',{ppp:"Registration"});
});


//Redirect to login after registration 
app.post('/login',function(req,res){
res.render('home');
})
//Get username and password => login to home
app.post('/', function(req,res){
  
  var x = req.body.username;
  var y = req.body.password;

  req.session.username =x;
  req.session.password=y;
 
  async function main(){
    //MongoDB connection
    var { MongoClient } = require('mongodb');
    var uri="mongodb+srv://admin:admin@cluster0.vtras.mongodb.net/netflix?retryWrites=true&w=majority"
    var client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true}) ;
    await client.connect();
     var data = fs.readFileSync("users.json");
    var object  =JSON.parse(data);
    var output = await client.db('netflix').collection('netflix1').find().toArray(); //array containing items i have in the database
   
 //Display Error if username or password are not written or wrong   
if (x==''|| y==''){
  alert("invalid username or password ");
  res.render('login');

}
else{
var i=0;
    for (i=0; i<output.length;i++){
if(output[i].username==x){
  if(output[i].password==y){
    res.render('home');
    break;
  }}}}
  if(i==output.length){
alert("Wrong username or Password");
res.render('login');}
nameofuser=x;

    client.close();
    }
    main().catch(console.error);
});


// Registration
app.post('/register', function (req, res) {
var xx = req.body.username;
var yy = req.body.password;

 reg={username: xx , password: yy ,cart:cartt };
var j=JSON.stringify(reg);
fs.writeFileSync("users.json",j);

//Mongo atlas connection
async function main(){
var { MongoClient } = require('mongodb');
var uri="mongodb+srv://admin:admin@cluster0.vtras.mongodb.net/netflix?retryWrites=true&w=majority"
var client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true}) ;
await client.connect();
 var data = fs.readFileSync("users.json");
var object  =JSON.parse(data);
var output = await client.db('netflix').collection('netflix1').find().toArray(); //array containing items i have in the database 

//check if username is taken when registering 
var taken=true;
var istaken=false;
if (xx==''|| yy==''){
alert("invalid username or password ");
res.render('registration',{ppp:"Registration"});
}
else if(taken==true) {
  var i=0;
  for (i=0; i<output.length && taken==true;i++){
if(output[i].username==xx){
  taken=false;
  istaken=true;
alert("TAKEN USERNAME, please try another one or try to login");
res.render('registration',{ppp:"Registration"});
}}

}
if(istaken==false && xx!='' && yy!=''){ 
  await client.db('netflix').collection('netflix1').insertOne(object);
alert("YOU HAVE REGISTERED SUCCESSFULLY, please login")
res.redirect('/');
}

client.close();
}
main().catch(console.error);
});

//Showing login form
app.get("/login", function (req, res) {
res.render('login');
});

//handling search >>chech data base
app.post('/search', function (req, res) {
  var items = ["Tennis Racket", 'Boxing Bag', 'Leaves of Grass', 'The Sun and Her Flowers', 'Samsung Galaxy S21 Ultra', 'iPhone 13 Pro'];
  var result = [];
  let searchWord = (req.body.Search).toLowerCase();
  console.log(searchWord);
  for (var i = 0; i < items.length; i++) {
    let str = items[i].toLowerCase();
    if (str.includes(searchWord)) {
      result.push(items[i]);
    }
  }
  console.log(result);
  if (result.length == 0) {
    alert("Item not found");
    res.status(204).send();
  }
  else {
    res.render("searchresults", { x: result });
  }
})


//showing books  AFTER LOGIN
app.get('/books', function(req,res){
  if (nameofuser==""){
    alert("you must log in first")
   res.redirect('/');
  }
  else{
  res.render('books');}
});

//showing boxing  AFTER LOGIN
app.get('/boxing', function(req,res){
  if (nameofuser==""){
    alert("you must log in first")
    res.redirect('/');
  }
  else{
  res.render('boxing');}
});

//showing cart AFTER LOGIN
app.get('/cart', function(req,res){
  if (nameofuser==""){
    alert("you must log in first");
    res.redirect('/');
  }
  else{
  //showing cart AFTER LOGIN  
  async function main(){
    var { MongoClient } = require('mongodb');
    var uri="mongodb+srv://admin:admin@cluster0.vtras.mongodb.net/netflix?retryWrites=true&w=majority"
    var client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true}) ;
    await client.connect();
    var show = await client.db('netflix').collection('netflix1').find().toArray(); //array containing items i have in database 
    var sort;
    var count=[]
    var k=0;

  var i=0;
  var itemm;
  var j=0;
    for (i=0; i<show.length;i++){
      if(show[i].username==nameofuser){
         itemm=show[i].cart
       var lenS=itemm.length
       console.log(itemm);
        itemm.forEach((num ) => {
           sort=num; 
        });
          res.render('cart',{CartItems:lenS+" "+"ITEMS",Items:itemm});
        }
        }   
    client.close();
    }
   
    main().catch(console.error);}
});

//show galaxy AFTER LOGIN
app.get('/galaxy', function(req,res){
  if (nameofuser==""){
    alert("you must log in first")
    res.redirect('/');
  }
  else{
  res.render('galaxy');}
});

//show home AFTER LOGIN
app.get('/home', function(req,res){
  if (nameofuser==""){
    alert("you must log in first")
    res.redirect('/');
  }
  else{
  res.render('home');}
});

//show iphone AFTER LOGIN
app.get('/iphone', function(req,res){
  console.log(nameofuser)
  if (nameofuser==""){
    alert("you must log in first")
    res.redirect('/');
  }
  else{
  res.render('iphone');}
});

//show leaves AFTER LOGIN
app.get('/leaves', function(req,res){
  if (nameofuser==""){
    alert("you must log in first")
    res.redirect('/');
  }
  else{
  res.render('leaves');}
});

//show phones AFTER LOGIN
app.get('/phones', function(req,res){
  if (nameofuser==""){
    alert("you must log in first")
    res.redirect('/');
  }
  else{
  res.render('phones');}
});

//show search AFTER LOGIN
app.get('/searchresults', function(req,res){
  if (nameofuser==""){
    alert("you must log in first")
    res.redirect('/');
  }
  else{
  res.render('searchresults');}
});

//show sports AFTER LOGIN
app.get('/sports', function(req,res){
  if (nameofuser==""){
    alert("you must log in first")
    res.redirect('/');
  }
  else{
  res.render('sports');}
});

//show sun AFTER LOGIN
app.get('/sun', function(req,res){
  if (nameofuser==""){
    alert("you must log in first")
    res.redirect('/');
  }
  else{
  res.render('sun');
}
});

//show tennis AFTER LOGIN
app.get('/tennis', function(req,res){
  if (nameofuser==""){
    alert("you must log in first")
    res.redirect('/');
  }
  else{
  res.render('tennis');}
});

//Add iphone to cart
app.post('/iphone',function(req,res){
  var title="Iphone 13 pro";
  async function main(){
    var { MongoClient } = require('mongodb');
    var uri="mongodb+srv://admin:admin@cluster0.vtras.mongodb.net/netflix?retryWrites=true&w=majority"
    var client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true}) ;
    await client.connect();
    var cc = await client.db('netflix').collection('netflix1').find().toArray(); //array containing items in the database 
   // cartt.join("\n");

    var i=0;
    var addedd=false;
        for (i=0; i<cc.length;i++){
          if(cc[i].username==nameofuser){
            for( var j=0;j<cc[i].cart.length;j++){
            if(cc[i].cart[j]==title){
          addedd=true;
          console.log("true");
          break;
        }
      }
    }
  }
  
    if(addedd==false){
      console.log("false");
      alert("Item added to cart"); 
    await client.db('netflix').collection('netflix1').findOneAndUpdate({username:nameofuser},
    { $push:{cart:title} 
  })
 
 }
    else if(addedd){
      alert("Item is already added")
    }
        client.close();
        }
        res.status(204).send();
        main().catch(console.error);
    });

//Add tennis to cart
app.post('/tennis',function(req,res){
  var title="Tennis Racket";
  //Mongo connection
  async function main(){
    var { MongoClient } = require('mongodb');
    var uri="mongodb+srv://admin:admin@cluster0.vtras.mongodb.net/netflix?retryWrites=true&w=majority"
    var client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true}) ;
    await client.connect();
    var cc = await client.db('netflix').collection('netflix1').find().toArray(); //array containing the items in the database 
    

    var i=0;
    var addedd=false;
        for (i=0; i<cc.length;i++){
          if(cc[i].username==nameofuser){
            for( var j=0;j<cc[i].cart.length;j++){
            if(cc[i].cart[j]==title){
          addedd=true;
          console.log("true");
          break;
        }
      }
    }
  }
    if(addedd==false){
      console.log("false");
      alert("Item added to cart"); 
    await client.db('netflix').collection('netflix1').findOneAndUpdate({username:nameofuser},
    { $push:{cart:title}
    })
    }
    else if(addedd){
      alert("Item is already added")
    }
        client.close();
        }
        res.status(204).send();
        main().catch(console.error);
    });
    
//Add boxing to cart    
app.post('/boxing',function(req,res){
  var title="Boxing Bag";
  //Mongo connection
  async function main(){
    var { MongoClient } = require('mongodb');
    var uri="mongodb+srv://admin:admin@cluster0.vtras.mongodb.net/netflix?retryWrites=true&w=majority"
    var client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true}) ;
    await client.connect();
    var cc = await client.db('netflix').collection('netflix1').find().toArray(); //array containing items in database 
    
    var i=0;
    var addedd=false;
        for (i=0; i<cc.length;i++){
          if(cc[i].username==nameofuser){
            for( var j=0;j<cc[i].cart.length;j++){
            if(cc[i].cart[j]==title){
          addedd=true;
          console.log("true");
          break;
        }
      }
    }
  }
    if(addedd==false){
      console.log("false");
      alert("Item added to cart"); 
    await client.db('netflix').collection('netflix1').findOneAndUpdate({username:nameofuser},
    { $push:{cart:title}
    })
    }
    else if(addedd){
      alert("Item is already added")
    }
        client.close();
        }
        res.status(204).send();
        main().catch(console.error);
    });

//Add galaxy to cart
app.post('/galaxy',function(req,res){
  var title="Samsung Galaxy s21";
  //Mongo connection
  async function main(){
    var { MongoClient } = require('mongodb');
    var uri="mongodb+srv://admin:admin@cluster0.vtras.mongodb.net/netflix?retryWrites=true&w=majority"
    var client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true}) ;
    await client.connect();
    var cc = await client.db('netflix').collection('netflix1').find().toArray(); //array containing items in database 
   
    var i=0;
    var addedd=false;
        for (i=0; i<cc.length;i++){
          if(cc[i].username==nameofuser){
            for( var j=0;j<cc[i].cart.length;j++){
            if(cc[i].cart[j]==title){
          addedd=true;
          console.log("true");
          break;
        }
      }
    }
  }
    if(addedd==false){
      console.log("false");
      alert("Item added to cart"); 
    await client.db('netflix').collection('netflix1').findOneAndUpdate({username:nameofuser},
    { $push:{cart:title}
    })
    }
    else if(addedd){
      alert("Item is already added")
    }
        client.close();
        }
        res.status(204).send();
        main().catch(console.error);
    });

//Add sun to cart
app.post('/sun',function(req,res){
   var title="The Sun and her Flowers";
  //Mongo connection 
  async function main(){
    var { MongoClient } = require('mongodb');
    var uri="mongodb+srv://admin:admin@cluster0.vtras.mongodb.net/netflix?retryWrites=true&w=majority"
    var client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true}) ;
    await client.connect();
    var cc = await client.db('netflix').collection('netflix1').find().toArray(); //array containing items in database 
   
    var i=0;
    var addedd=false;
        for (i=0; i<cc.length;i++){
          if(cc[i].username==nameofuser){
            for( var j=0;j<cc[i].cart.length;j++){
            if(cc[i].cart[j]==title){
          addedd=true;
          console.log("true");
          break;
        }
      }
    }
  }
    if(addedd==false){
      console.log("false");
      alert("Item added to cart"); 
    await client.db('netflix').collection('netflix1').findOneAndUpdate({username:nameofuser},
    { $push:{cart:title}
    })
    }
    else if(addedd){
      alert("Item is already added")
    }
        client.close();
        }
        res.status(204).send();
        main().catch(console.error);
    });

 //Add leaves to cart    
app.post('/leaves', function (req, res){
  var title="Leaves of Grass"
  //Mongo connection 
  async function main(){
    var { MongoClient } = require('mongodb');
    var uri="mongodb+srv://admin:admin@cluster0.vtras.mongodb.net/netflix?retryWrites=true&w=majority"
    var client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true}) ;
    await client.connect();
    var cc = await client.db('netflix').collection('netflix1').find().toArray(); //array containing items in database 
   
    var i=0;
    var addedd=false;
        for (i=0; i<cc.length;i++){
          if(cc[i].username==nameofuser){
            for( var j=0;j<cc[i].cart.length;j++){
            if(cc[i].cart[j]==title){
          addedd=true;
          console.log("true");
          break;
        }
      }
    }
  }
    if(addedd==false){
      console.log("false");
      alert("Item added to cart"); 
    await client.db('netflix').collection('netflix1').findOneAndUpdate({username:nameofuser},
    { $push:{cart:title}
    })
    }
    else if(addedd){
      alert("Item is already added")
    }
        client.close();
        }
        res.status(204).send();
        main().catch(console.error);
    });


if(process.env.PORT){
  app.listen(process.env.PORT,function(){console.log("Server started")});
}
else{
  app.listen(3000,function() {console.log("Server started on port 3000")});
}

