var express     = require('express');
var bodyParser  = require('body-parser');
const path = require('path');
var app = express();

// const demoRoutes = require('./routes/demo');
const userRoutes = require('./routes/user');
const addProduct = require('./routes/product');



//app.set('view engine','ejs');
app.set('view engine', 'html');
//app.use('/image',express.static(__dirname+'/image'));
app.use('/uploads', express.static('uploads'));

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({extended:true,limit:'50mb',parameterLimit:50000}));
app.use('/jquery',express.static(__dirname+'/node_modules/jquery/dist/'));


app.use("/user",userRoutes);
//app.use("/login",userRoutes);

app.use("/product",addProduct);

app.use(userRoutes);

// app.use(demoRoutes);


var port  = process.env.port || 8080;
app.listen(port,()=>console.log('server run at port '+port));

