var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "MySQLEasyPass",
  database: "app"
});

con.connect(function(err) {
  if (err) throw err;
  con.query("SELECT * FROM pokemon_list", function (err, result, fields) {
    if (err) throw err;
    console.log(result);
  });
});