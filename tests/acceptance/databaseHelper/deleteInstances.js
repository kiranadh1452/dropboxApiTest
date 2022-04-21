const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'joomlauser',
  password: 'kiran12345',
  database: 'joomladb'
});

const clearDropbox = () => {

  connection.connect((e) => {
    if(e) throw e;
  });

  connection.query('DELETE FROM kiran_dropbox',(e,result)=> {
    if(e) throw e;
  });

  connection.end();
}

module.exports = {clearDropbox};
