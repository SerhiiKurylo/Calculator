const mssql = require('mssql');

const config = {
    user: 'connectjs',   				// користувач
	password: '12345', 	 			// пароль
	server: 'localhost', 			// хост
	database: 'MortageDB',    		// імя бд
	port: 1433,			 			// порт sql server
    trustServerCertificate: true,
    pool: {
        max: 10, 					// максимальна кількість з'єднань пула
        min: 0,  					// мінімальна кількість з'єднань пула
        idleTimeoutMillis: 30000 	// час очікування невикористовуємого з'єднання 
    }	
}

const connection = new mssql.ConnectionPool(config); 
let pool = connection.connect(function(err) {
	if (err) console.log( '!!!'+ err)
}); 

module.exports = pool;
