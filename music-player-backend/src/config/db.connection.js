const mysql = require('mysql2');
const dbConfig = require('./db.config.js');

// Crear una conexión a la base de datos
const connection = mysql.createConnection({
  host: dbConfig.HOST,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
  database: dbConfig.DB
});

// Abrir la conexión MySQL
connection.connect(error => {
  if (error) throw error;
  console.log("Successfully connected to the database.");
});

module.exports = connection;
