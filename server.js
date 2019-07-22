const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');


const port = 3000;
const app = express();


app.use(bodyParser.urlencoded({'extended': 'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({type: 'application/vnd.api+json'}));


// app.use('/client', express.static(path.join(__dirname, 'client')))
app.use(express.static(path.join(__dirname, 'client')));




app.use(require('cors')());


// app.use('/api/rooms', require('./app/middleware/isLogged'));
// app.use('/api/devices', require('./app/middleware/isLogged'));
// app.use('/api/macros', require('./app/middleware/isLogged'));


// // app.use('/auth', require('./app/routes/auth'));
// app.use('/api', require('./app/routes/api/auth'));



let tests = [];
let testsDir = path.join(__dirname, 'tests');


fs.readdir(testsDir, (err, files) => {
	if (err) throw err;

	for (let i = 0; i < files.length; i++) {
		let f = files[i];

		fs.readFile(`${testsDir}/${f}`, 'utf8', (err1, data) => {
			if (err1) throw err1;

			let d = JSON.parse(data);
			d.id = i;

			tests.push(d);
		});
	}
});





////////////////////////////////
// API: TESTING FUNCTIONALITY //
////////////////////////////////

app.get('/api/tests.get', (req, res) => {
	let a = [];
	for (let t of tests) {
		a.push(t.title);
	}

	res.json(a);
});



app.get('/api/tests/:id', (req, res) => {
	let id = req.params.id;
	let test = tests[id];
	let t = {
		'id': id,
		'title': test.title,
		'items': []
	};

	for (let i of test.items) {
		t.items.push({
			'title': i.title,
			'answers': i.answers
		});
	}

	res.json(t);
});



app.post('/api/tests/:id/check', (req, res) => {
	let id = req.params.id;
	let data = req.body;
	console.log(data);

	let ctItems = tests[id].items;

	let item = {
		'test': tests[id].title,
		'firstName': data.firstName,
		'lastName': data.lastName,
		'rightAnswers': 0,
		'answers': []
	};


	let answers = data.test.items;
	for (let i=0; i < answers.length; i++) {
		let s = parseInt(answers[i].selected);
		s = (!isNaN(s) && s >= 0) ? s : -1;

		if (ctItems[i].right === s) item.rightAnswers++;

		item.answers[i] = {
			'right': ctItems[i].right,
			'selected': s
		};
	}


	addUser(item);
	res.json({});
});




function addUser(item) {
	fs.readFile(path.join(__dirname, 'answers.json'), (err, data) => {
		if (err) throw err;

		try {
			data = JSON.parse(data);
		} catch {
			data = [];
		}

		if (data.length > 50) data.shift();

		data.push(item);
		data = JSON.stringify(data);

		fs.writeFile(path.join(__dirname, 'answers.json'), data, err1 => {
			if (err1) throw err1;
		});
	});
}




//////////////////////////////////
// API: ADD TESTS FUNCTIONALITY //
//////////////////////////////////

app.post('/api/tests/', (req, res) => {
	let data = req.body;
	console.log(data);


	res.json({});
});




// server up

app.get('/', (req, res) => {
	res.send('main teil');
});


app.listen(port, () => {
	console.log(`Server running on port: ${port}`);
});
