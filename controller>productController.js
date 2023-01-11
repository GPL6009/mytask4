const database = require('./database');
const multer = require('multer')
// const upload = multer({ dest: 'uploads/' })


exports.productDashboard = function (req, res) {
    console.log("this is add product");
    var data = req.body.pageindex;
    var pagesize = req.body.pagesize;
    console.log("coming pageindex:", data);

    //
    const token = req.headers['decodedtoken'];
    var decoded = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    var userId = decoded.id;
    console.log("particular user:", userId);
    //

    var querytotal = 'SELECT COUNT(*) AS count FROM addProduct WHERE userId = "' + userId + '"';
    database.query(querytotal, function (err, result) {
        if (err) throw err;

        var totolcount;

        if (result.length > 0) {
            totolcount = result[0].count;
        }
        console.log("total count 2 :", totolcount);

        pagesize;
        var pageindex = req.body.pageindex;
        var skip = (pageindex - 1) * pagesize;
        var limit = skip + ',' + pagesize;

        if (data > 0 && pagesize > 0) {
            var query = 'SELECT * FROM addProduct WHERE userId = "' + userId + '" ORDER BY id DESC LIMIT ' + limit;
            database.query(query, function (err, result) {
                if (err) throw err;

                if (result.length > 0 && pagesize > 0) {
                    var count = Math.ceil(totolcount / pagesize);
                    console.log("total divided :", count);
                    res.json({
                        data: result,
                        count: count
                    });
                }
                else {
                    console.log("no data in that table..!");
                    res.end();
                }

            });//
        }
        else {
            console.log("coming data is not 1...");
            res.end();
        }

    });//

}


//adding products
exports.addProduct = function (req, res) {
    console.log("this is product Details");

    var transName;
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './uploads');
        },
        filename: function (req, file, cb) {
            var temp_file_arr = file.originalname.split(".");
            var temp_file_name = temp_file_arr[0];
            var temp_file_extension = temp_file_arr[1];
            transName = temp_file_name + '-' + Date.now() + '.' + temp_file_extension;
            cb(null, transName);
        }
    });

    var upload = multer({ storage: storage }).single('pImage');

    upload(req, res, function (error) {

        if (error) {
            console.log("There was an error uploading the image.");
        }
        else {
            const token = req.headers['decodedtoken'];
            var decoded = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
            var userId = decoded.id;
            console.log("particular user:", userId);

            var title = req.body.title;
            var description = req.body.description;
            //var pImage = req.body.pImage;
            var pImage = transName;
            var price = req.body.price;

            var query = `
INSERT INTO addProduct 
(userId, productTitle, description, image, price ) 
VALUES ("${userId}", "${title}", "${description}", "${pImage}", "${price}" )
`;

            database.query(query, function (err, result) {
                if (err) {
                    throw err;
                }
                //
                if (result < 0) {
                    console.log('no data');
                    res.json({
                        data: false
                    });
                }
                else {

                    console.log("rows are inserted");
                    //var message = "success";
                    res.json({
                        data: true
                    });
                }

            });
        }//else ends

    });// Upload funtion ends   

}


//
exports.editProduct = function (req, res) {
    var editId = req.body.editId;
    console.log("this is a editing id: ", editId);

    var query = 'SELECT * FROM addProduct WHERE id ="' + editId + '"';
    database.query(query, function (err, result) {

        if (err) throw err;

        if (result.length > 0) {
            console.log("data exists to edit..");
            //var demail = result[0].email
            res.json({
                data: result
            });
        }
        else {
            console.log("no such data exists");
            //var message="bad";
            res.json({
                data: false
            });
        }

    });// verification ends
}


//editProductmain
exports.editProductmain = function (req, res) {
    console.log("this is edit main");

    var transName;
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './uploads');
        },
        filename: function (req, file, cb) {
            var temp_file_arr = file.originalname.split(".");
            var temp_file_name = temp_file_arr[0];
            var temp_file_extension = temp_file_arr[1];
            transName = temp_file_name + '-' + Date.now() + '.' + temp_file_extension;
            cb(null, transName);
        }
    });

    var upload = multer({ storage: storage }).single('file');

    upload(req, res, function (error) {

        if (error) {
            console.log("There was an error while uploading the image.");
        }
        else {

            var stdImgNamer;
            if (transName == undefined) {
                stdImgNamer = req.body.stdImgName;
            }
            else{
                stdImgNamer = transName;
            }

            var imgOriginalName = stdImgNamer;
            // console.log("Original name:", imgOriginalName);

            var title = req.body.title;
            console.log("edit data: ", title);
            var description = req.body.description;
            var price = req.body.price;
            var filename = imgOriginalName;
            var productId = req.body.productId;
            console.log("product id: ", productId);

                var query = `
            UPDATE addProduct SET productTitle = "${title}", description = "${description}", image = "${filename}", price = "${price}" WHERE id = "${productId}"
            `;

                database.query(query, function (err, data) {
                    //
                    if (err) {
                        throw err;
                    }
                    //
                    if (data < 0) {
                        console.log('no data');
                        res.json({
                            status: false
                        });
                    }
                    else {
                        console.log("rows are inserted");
                        res.json({
                            status: true
                        });
                    }

                });

        }//else ends

    });// Upload funtion ends
}

