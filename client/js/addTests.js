let $content = document.getElementById('content');
let $testTitle = document.getElementById('testTitle');
let currentQuestion;
let pkg = {};


start();



function start() {
	let tt = $testTitle.value;

	if (!tt) {
		$testTitle.classList.add('error');
		return;
	} else $testTitle.classList.remove('error');

	
	pkg = {
		questionCount: 0,
		title: tt,
		answers: []
	};

	$content.innerHTML = tmpl('test-block', pkg);
}



function saveData() {
	console.log('save');
	pkg.test = test;

	// $.ajax({
	// 	url: `/api/tests/${test.id}/check`,
	// 	type: 'POST',
	// 	dataType: 'json',
	// 	data: pkg,
	// 	success: d => {
	// 		console.log(d);
	// 	}
	// });
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




