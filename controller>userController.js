const database = require('../controller/database');
const multer  = require('multer')
const path = require('path');
// const upload = multer({ dest: 'uploads/' })
const jwt = require('jsonwebtoken');

//email verification starts
exports.email_exists = function(req, res){
    var email = req.body.email;
    console.log("verify :",email)
    
    //email verification starts
    var query = 'SELECT * FROM users_sample WHERE email ="' + email + '"';
    database.query(query, function (err, result) {

        if (err) throw err;        

        if(result.length > 0){
            console.log("email exists");
            var demail = result[0].email
            console.log("database email:",demail);
                if(email == demail){
                console.log('user exists ')
               var message="success";
            }            
        }        
        else{
            console.log("no email exists");
                //var message="bad";
        }
    
        res.json({
            msg:message
         });
        
    });// verification ends

}//email verification ends


exports.add_user = function (req, res) {
    
    var transName;
    const storage = multer.diskStorage({
        destination :function(req,file,cb){
            cb(null,'./uploads');
        },
        filename : function(req,file,cb){
          var temp_file_arr = file.originalname.split(".");
          var temp_file_name = temp_file_arr[0];
          var temp_file_extension = temp_file_arr[1];
          transName = temp_file_name + '-' + Date.now() + '.' + temp_file_extension ;
          cb(null, transName);
        } 
      });
      
      var upload = multer({storage:storage}).single('file');
      
      upload(req, res, function(error){
      
          if (error) {
              console.log("There was an error uploading the image.");
          }
          else{

            var fname    = req.body.first_name;

            var last_name = req.body.last_name;

            var number = req.body.number;
            
            var email = req.body.email;
            
            var gender = req.body.gender;
            
            var address = req.body.address;
            
            var password = req.body.password;
            
            var cpassword = req.body.cpassword;
            
            //var filename = "hi";

            var filename = transName;

            var query = `
INSERT INTO users_sample 
(first_name, last_name, number, email, gender, address, password, cpassword, profile ) 
VALUES ("${fname}", "${last_name}", "${number}", "${email}", "${gender}", "${address}", "${password}", "${cpassword}", "${filename}")
`;

            database.query(query, function (error, data) {
                if (data < 0) {
                    console.log('no data');
                }
                if (error) {

                    throw error;
                }
                else {

                    res.send(console.log("rows are inserted"));
                }
                //res.send(console.log('wow you done..!'));

            });

            res.json({
                //"fileName":req.file.originalname,
                "userName":req.body.first_name,
                "phoneNumer":req.body.number     
               });


        }//else ends

      });// Upload funtion ends

}// user registeration ends



//login process
exports.user_login = function (req, res) {
    var email = req.body.email;
    var password = req.body.password;
    console.log(email);
    // res.end();
    // return
    //email verification starts
    var query = 'SELECT * FROM users_sample WHERE email ="' + email + '"';
    database.query(query, function (err, result) {
        if (err) throw err;

        if(result.length > 0){
            var id = result[0].id;
            var first_name = result[0].first_name;
            var last_name = result[0].last_name;
            var demail=result[0].email;
            var dpassword=result[0].password;
            console.log('database:',demail);
            console.log('database:',dpassword);
            console.log('user:',email);
            console.log('user:',password);

            if(email == demail && password == dpassword){
                console.log('dUser:',demail);
                var token = jwt.sign({id, email, first_name, last_name},'secret-key');
                res.json({
                    status:true,
                    token:token,
                    email:email
                });
               
            }
            else{
                res.json({
                    status:false
                });
            }    
        }
        else{
            console.log('This User is not exists');
            res.json({
                status:false
            });
        }

    });//email verification ends    

}//login process ends

