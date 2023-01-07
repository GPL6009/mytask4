//productcontroller.productDashboard

const database = require('./database');
const multer = require('multer')
// const upload = multer({ dest: 'uploads/' })


exports.productDashboard = function (req, res) {
    console.log("this is add product");
    var data = req.body.pageindex;
    var pagesize = req.body.pagesize;
    console.log("coming pageindex:", data)


    var querytotal = "SELECT COUNT(*) AS count FROM addProduct";
    database.query(querytotal, function (err, result) {
        if (err) throw err;

        var totolcount;

        if (result.length > 0) {
            totolcount = result[0].count;
            console.log("total count 1 :", totolcount);
            // res.json({
            //     data: result
            // });
        }
        console.log("total count 2 :", totolcount);

        pagesize;
        var pageindex = req.body.pageindex;
        var skip = (pageindex - 1) * pagesize;
        var limit = skip + ',' + pagesize;

        if (data > 0 && pagesize > 0 ) {
            var query = 'SELECT * FROM addProduct ORDER BY id DESC LIMIT ' + limit;
            database.query(query, function (err, result) {
                if (err) throw err;

                if (result.length > 0 && pagesize > 0 ) {
                    console.log("total count 3 :", totolcount);
                    
                    var count = Math.ceil(totolcount/pagesize);
                    console.log("total divided :", count);
                    res.json({
                        data: result,
                        count: count
                    });
                }
                else{
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
            var title = req.body.title;
            var description = req.body.description;
            //var pImage = req.body.pImage;
            var pImage = transName;
            var price = req.body.price;

            var query = `
INSERT INTO addProduct 
(productTitle, description, image, price ) 
VALUES ("${title}", "${description}", "${pImage}", "${price}" )
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
                    var message = "success";
                    res.json({
                        data: true
                    });
                }
                //res.send(console.log('wow you done..!'));

            });
        }//else ends

    });// Upload funtion ends   

}//


//productDashboard.html

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css">
</head>

<body>
    <form id="form2" enctype="multipart/form-data">
        <nav class="navbar navbar-expand-lg navbar-light bg-light fixed-top">
            <!-- <a class="navbar-brand" href="/addP/logout" style="margin-left:10%;">Logout</a> -->
            <button type="button" onclick="" id="logout" name="logout" class="navbar-brand">Logout</button>
        </nav>
        <div class="nav justify-content-center">
            <div class="card nav justify-content-center" style="width: 80rem; margin-top:7%;">
                <div class="card-body text-center">
                    <button type="button" onclick="" id="addProduct" class="form-control">Add Product</button>
                </div>

                <div>
                    <select name="pagesize" id="pagesize" onChange="load_data(this.value)">
                        <option value="4">4</option>
                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                    </select>
                </div>

                <div id="dynamicbutton">
                    <div>
                    </div>
                </div>

                <table class="table table-striped table-bordered" id="sample_data">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Description</th>
                            <th>image</th>
                            <th>Price</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>

            </div>
        </div>
    </form>

    <script src="/jquery/jquery.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.2/jquery.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-validate/1.19.5/jquery.validate.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-validate/1.19.5/additional-methods.min.js"></script>
    <script>
        $(document).ready(function () {
            var clicked_value = 1;
            load_data(clicked_value);
            if (localStorage.getItem('token')) {
            }
            else {
                alert("you have to login first..!");
                location.href = "http://localhost:8080/user/login";
            }
        });

        var pagesize = 4;

        function load_data(clicked_value) {
            //alert(clicked_value);
            var pageindex = clicked_value;
            pagesize = document.getElementById("pagesize").value;

            console.log("coming pageindex:", pageindex);
            console.log("coming pagesize:", pagesize);
            //
            
            $.ajax({
                url: "http://localhost:8080/product/productDashboard",
                method: "POST",
                data: { pageindex: pageindex, pagesize: pagesize },
                dataType: "JSON",
                success: function (response) {
                    var html = '';
                    var html1 = '';
                    if (response.data.length > 0) {
                        for (var count = 0; count < response.data.length; count++) {
                            html += `
                    <tr>
                        <td>`+ response.data[count].productTitle + `</td>
                        <td>`+ response.data[count].description + `</td>
                        <td><img src="http://localhost:8080/uploads/`+ response.data[count].image + `" alt="shark" width="80" height="70"></td>
                        <td>`+ response.data[count].price + `</td>
                    </tr>
                    `;
                        }
                    }

                    if (response.count) {
                        var count = response.count;
                        console.log("total count : ", count)
                        for (var i = 1; i <= count; i++) {
                            html1 += `
                            <button type="button" onclick="load_data(this.value)" class = "" id = "`+ i + `" value="` + i + `">` + i + ` </button>
                            `;
                        }
                    }

                    $('#sample_data tbody').html(html);

                    $('#dynamicbutton div').html(html1);
                }
            });

        }
        //

        //add product
        document.getElementById("addProduct").onclick = function () {
            location.href = "http://localhost:8080/product/addProduct";
        };

        //Logout
        document.getElementById("logout").onclick = function () {
            location.href = "http://localhost:8080/user/login";
            localStorage.removeItem('token');
            //localStorage.clear();
        };

    </script>
</body>

</html>
