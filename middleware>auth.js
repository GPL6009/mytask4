const database = require('../controller/database');

exports.user = function (req, res, next) {
    //console.log("decoded:",req.headers);
    const token = req.headers['decodedtoken'];

    var decoded = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    //console.log("decoded 1:", decoded);
    console.log("decoded 2:", decoded.email);
    console.log("this is middlware auth");
    var id = decoded.id;
    var email = decoded.email;
    var first_name = decoded.first_name;
    var last_name = decoded.last_name;

    //
    var query = 'SELECT * FROM users_sample WHERE id ="' + id + '"';
    database.query(query, function (err, result) {

        if (err) throw err;

        if (result.length > 0) {
            var did = result[0].id;
            var demail = result[0].email;
            console.log("database email:", demail);
            if (email == demail && id == did) {
                console.log('user exists ')
                next();
            }
        }
        else {
            console.log("no such user exists");
            res.end();
        }

    });// verification ends    
}


//
exports.dummy = function (req, res, next) {
    console.log("this is next page..");
}
