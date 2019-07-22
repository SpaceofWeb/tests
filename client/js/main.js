let answers = [];
let currentTest, currentQuestion = -1;



$.ajax({
	url: '/api/tests.get',
	type: 'GET',
	dataType: 'json',
	success: data => {
		// let html = '<option value="-1">select</option>';
		let html = '';

		for (let i = 0; i < data.length; i++) {
			html += `<option value="${i}">${data[i]}</option>`;
		}

		$('#testType').html(html);
		getTest(parseInt($('#testType').val()));
	}
});




$('#testType').on('change', e => {
	getTest(parseInt(e.currentTarget.value));
});




function getTest(id) {
	$.ajax({
		url: `/api/tests/${id}`,
		type: 'GET',
		dataType: 'json',
		success: data => {
			currentQuestion = -1;
			currentTest = null;
			setTest(data);
		}
	});
}



function setTest(test) {
	let h = `<h2>${test.title}</h2><div id="question"></div>`;

	currentTest = test;

	$('#tests').html(h);

	nextQuestion();
}




function nextQuestion() {
	console.log(currentTest);
	if (++currentQuestion >= currentTest.items.length) {
		endQuiz();
		return;
	}


	let t = currentTest.items[currentQuestion];


	let h = `
		<h4>${t.question}</h4>
		<small>Difficult: ${t.diff}</small>

		<div id="answers">
			<label>
				<input type="radio" name="a" value="1"> <span>${t.answers[0]}</span><br>
			</label>
			<label>
				<input type="radio" name="a" value="2"> <span>${t.answers[1]}</span><br>
			</label>
			<label>
				<input type="radio" name="a" value="3"> <span>${t.answers[2]}</span><br>
			</label>
			<label>
				<input type="radio" name="a" value="4"> <span>${t.answers[3]}</span><br>
			</label>
		</div><br>
		<input type="button" onclick="getData();" value="next">`;


	$('#question').html(h);
}



function getData() {
	let id = parseInt($('#answers>input:checked').val());

	id = isNaN(id) ? -1 : id;

	answers.push({
		q: currentQuestion,
		a: id
	});

	nextQuestion();
}



function endQuiz() {
	let id = currentTest.id;

	$.ajax({
		url: `/api/tests/${id}/check`,
		type: 'POST',
		dataType: 'json',
		data: {'answers': answers, 'name': $('#name').val()},
		error: err => console.error('err', err),
		success: data => {
			console.log(data);
		}
	});
}



