const mssql = require('mssql');
const express = require('express');
const path = require('path');
const fs = require('fs'); 
const app = express();
const apiHandler = require('./api');
const bodyParser = require('body-parser'); 

const port = 8080;


// подгрузка статических файлов из папки pages 
app.use(express.static(__dirname));//(path.join(__dirname, 'pages')));
app.use(express.static(path.join(__dirname, 'pages')));
app.use(bodyParser.json()); 

app.get('/', function(req, res){

	// 
	const file_path = path.join(__dirname, 'pages/banklist.html');
	console.log(file_path);
	fs.readFile(file_path, function (err, data) { 

		// обробка помилок
		if (err) {
			console.log(err);
			res.writeHead(404, { 'Content-Type': 'text/plain' });
			res.write('Not Found!');

		} else {
			res.writeHead(200, { 'Content-Type': 'text/html'}); 
			// запис сторінки 
			res.write(data.toString());

		}

		res.end();
	});

});

app.get('/api', apiHandler.loadBankList);

app.get('/api/edit/:id', apiHandler.editBank);

app.delete('/api/:id', apiHandler.removeBank);

app.post('/api/save/:id', apiHandler.SaveBank);

app.get('/calculate/:id', apiHandler.loadBankOffer);

app.get('/calculate', function(req, res){
	// 
	const file_path = path.join(__dirname, 'pages/calculator.html');

	fs.readFile(file_path, function (err, data) { 

		// обробка помилок
		if (err) {
			console.log(err);
			res.writeHead(404, { 'Content-Type': 'text/plain' });
			res.write('Not Found!');

		} else {
			res.writeHead(200, { 'Content-Type': 'text/html'}); 
			// запис сторінки 
			res.write(data.toString());

		}
		res.end();
	});
});

app.get('/getBankList', apiHandler.getBankList);

app.post('/requestMortage', apiHandler.requestMortage);

app.listen(port, function () {
	console.log('app listening on port ' + port);
}); 

