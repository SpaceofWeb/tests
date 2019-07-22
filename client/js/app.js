let $content = document.getElementById('content');
let $firstName = document.getElementById('firstName');
let $lastName = document.getElementById('lastName');
let $tests = document.getElementById('tests');
let test;
let currentQuestion;
let pkg = {};


$content.innerHTML = tmpl('test-block-empty', {});
getTestList();


function getTestList() {
	$.ajax({
		url: '/api/tests.get',
		type: 'GET',
		dataType: 'json',
		success: d => {
			let h = '';
			for (let i=0; i < d.length; i++) {
				h += `<option value="${i}">${d[i]}</option>`;
			}

			$tests.innerHTML = h;
		}
	});
}



function getTest(t) {
	$.ajax({
		url: `/api/tests/${t}`,
		type: 'GET',
		dataType: 'json',
		success: d => {
			test = d;
			changeQuestion(1);
		}
	});
}



function start() {
	let fn = $firstName.value;
	let ln = $lastName.value;
	let t = parseInt($tests.value);
	let err = false;


	if (!fn) {
		$firstName.classList.add('error');
		err = true;
	} else $firstName.classList.remove('error');

	if (!ln) {
		$lastName.classList.add('error');
		err = true;
	} else $lastName.classList.remove('error');

	if (isNaN(t) || t === -1) {
		$tests.classList.add('error');
		err = true;
	} else $tests.classList.remove('error');


	if (err) return;
	
	pkg = {
		firstName: fn,
		lastName: ln,
		test: t
	};
	getTest(t);
}



function endQuiz() {
	pkg.test = test;

	$.ajax({
		url: `/api/tests/${test.id}/check`,
		type: 'POST',
		dataType: 'json',
		data: pkg,
		success: d => {
			console.log(d);
		}
	});
}



function getQuestion(n) {
	if (n < 1 || n > test.items.length) return false;

	currentQuestion = n--;
	let q = test.items[n];

	let selected = parseInt(q.selected);
	selected = (!isNaN(selected) && selected >= 0) ? selected : selected = -1;

	let o = {
		questionCount: test.items.length,
		currentQuestion: currentQuestion,
		selected: selected,
		question: {
			title: q.question,
			answers: q.answers
		}
	};
	return o;
}


function changeQuestion(n) {
	let d = getQuestion(n);

	if (d !== false) $content.innerHTML = tmpl('test-block', d);
}


function selectQuestion(q, n) {
	test.items[--q].selected = n;
}




