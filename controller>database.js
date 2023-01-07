const mysql = require('mysql');

var connection = mysql.createConnection({
	host : 'localhost',
	database : 'express_sample',
	user : 'root',
	password : ''
});

connection.connect(function(error){
	if(error)
	{
		throw error;
	}
	else
	{
		console.log('Database connected Successfully');
	}

});

module.exports = connection;
