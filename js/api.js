// підключення до бази данних 
const connection = require('./config');
const mssql = require('mssql');
//const path  = require('path');

module.exports = {
	// завантаження банківського списку
	loadBankList: function (req, res) {

		let request = new mssql.Request(connection);

		let queryText = `Select o.id, o.bankName, o.maxLoan, o.minPayment, o.rate, o.termLoan ,ISNULL(m.offerId,0) as isRequested From Offer o
						Left Join Mortage m On o.id = m.offerId 
		  				Order By o.bankName, o.id`;

		request.query(queryText, function (err, rows) {

			if (err) console.log(err);
			res.send(JSON.stringify(rows.recordset));
		});

	},


	//Редагування
	editBank: function (req, res) {

		let ps = new mssql.PreparedStatement(connection);

		let inserts = {
			id: parseInt(req.params.id)
		}
		/* // Оптимізувати таблицю Offer 
		let queryText = `Select o.id id, b.name bankName, o.maxLoan maxLoan, o.termLoan termLoan, o.rate rate From Offer o
							Left join Bank b on o.bankId = b.id
							Where o.id = @id`;
		*/

		let queryText = `Select * From Offer Where id = @id`;

		ps.input('id', mssql.Int);

		ps.prepare(queryText, function (err) {
			if (err) console.log(err);

			ps.execute(inserts, function (err, rows) {

				if (err) console.log(err);

				console.log('GET ' + req.url);
				res.json(rows['recordset'][0]);
				ps.unprepare();

			});
		});
	},
	//Видалення
	removeBank: function (req, res) {

		let ps = new mssql.PreparedStatement(connection);

		let inserts = {
			id: parseInt(req.params.id)
		}

		let queryText = `Delete From Offer
                            Where id = @id`;


		ps.input('id', mssql.Int);

		ps.prepare(queryText, function (err) {
			if (err) console.log(err);

			ps.execute(inserts, function (err, rows) {

				if (err) console.log(err);
				res.status(200).send('Bank offer has deleted');
				ps.unprepare();

			});
		});
	},

	//Видалення
	SaveBank: function (req, res) {

		const ps = new mssql.PreparedStatement(connection);

		let data = req.body;

		let inserts = {
			name: data.bankName,
			rate: data.rate,
			maxLoan: data.maxLoan,
			termLoan: data.termLoan,
			get minPayment() {
				return Math.floor((data.maxLoan * data.rate) / 100);
			},
			id: data.id
		}

		ps.input('name', mssql.Text);
		ps.input('maxLoan', mssql.Int);
		ps.input('termLoan', mssql.Int);
		ps.input('minPayment', mssql.Int);
		ps.input('rate', mssql.Int);
		ps.input('id', mssql.Int);

		if (data.id) {

			ps.prepare('UPDATE Offer SET bankName=@name, rate=@rate, maxLoan=@maxLoan, termLoan=@termLoan, minPayment=@minPayment  WHERE id=@id', function (err) {
				if (err) console.log(err);

				ps.execute(inserts, function (err, rows) {
					if (err) console.log(err);

					console.log('PUT ' + req.url);
					res.status(200).send('Offer updated');
					ps.unprepare();
				});
			});


		} else {
			ps.prepare(`INSERT INTO Offer(bankName, rate, maxLoan, termLoan, minPayment) 
						Values(@name, @rate, @maxLoan, @termLoan, @minPayment)`, function (err) {
				if (err) console.log(err);

				ps.execute(inserts, function (err, rows) {
					if (err) console.log(err);

					console.log('PUT ' + req.url);
					res.status(200).send('Offer set');
					ps.unprepare();
				});
			});
		}

	},

	// Cторінка calculate.html
	loadBankOffer: function (req, res) {

		let ps = new mssql.PreparedStatement(connection);

		let inserts = {
			id: parseInt(req.params.id)
		}

		const queryText = `Select o.bankName, o.maxLoan, o.termLoan, o.rate,
								ISNULL(m.loan, o.maxLoan) as loan,
								ISNULL(m.initialLoan, o.maxLoan) as initialLoan,
								ISNULL(m.downPayment, o.minPayment) as downPayment,
								ISNULL(m.payPerMonth, IIF(o.termLoan=0,0,(o.maxLoan-o.minPayment)/o.termLoan)) as payPerMonth,
								ISNULL(m.offerId, 0) as isRequested
								From Offer as o
								Left Join Mortage m ON o.id = m.offerId 
								Where o.id = @id`;

		ps.input('id', mssql.Int);

		ps.prepare(queryText, function (err) {
			if (err) console.log(err);

			ps.execute(inserts, function (err, rows) {

				if (err) console.log(err);
				res.json(rows['recordset'][0]);
				ps.unprepare();

			});
		});
	},

	getBankList: function (req, res) {

		let request = new mssql.Request(connection);

		let queryText = `Select bankName, id From Offer Order by bankName`;

		request.query(queryText, function (err, rows) {

			if (err) console.log(err);
			res.send(JSON.stringify(rows.recordset));
		});

	},

	requestMortage: function (req, res) {

		const ps = new mssql.PreparedStatement(connection);
		
		let data = req.body;	
		let inserts = {
			offerId: data.id,
			loan: data.loan,
			downPayment: data.minPayment,
			payPerMonth: data.monthPay,
			initialLoan: data.loan
		}

		ps.input('loan', mssql.Int);
		ps.input('downPayment', mssql.Int);
		ps.input('payPerMonth', mssql.Int);
		ps.input('initialLoan', mssql.Int);
		ps.input('offerId', mssql.Int);


		ps.prepare(`INSERT INTO Mortage(offerId, downPayment, payPerMonth, initialLoan, loan) 
						Values(@offerId, @downPayment, @payPerMonth, @initialLoan, @loan)`, function (err) {
			if (err) console.log(err);

			ps.execute(inserts, function (err, rows) {
				if (err) console.log(err);
				res.status(200).send('Mortage set');
				ps.unprepare();
			});
		});
	}




}

