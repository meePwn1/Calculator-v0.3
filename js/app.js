const calculator = document.querySelector('.calculator');
let history = [];
let allHistory = [];
let tempNumber = '0';
let operationType = '';
const actions = ['/', '*', '-', '+'];

//Событие клавиатуры
document.addEventListener('keyup', e => {
	let data = '';
	if (e.code === 'Numpad1' || e.code === 'Digit1') {
		data = '1';
	}
	if (e.code === 'Numpad2' || e.code === 'Digit2') {
		data = '2';
	}
	if (e.code === 'Numpad3' || e.code === 'Digit3') {
		data = '3';
	}
	if (e.code === 'Numpad4' || e.code === 'Digit4') {
		data = '4';
	}
	if (e.code === 'Numpad5' || e.code === 'Digit5') {
		data = '5';
	}
	if (e.code === 'Numpad6' || e.code === 'Digit6') {
		data = '6';
	}
	if (e.code === 'Numpad7' || e.code === 'Digit7') {
		data = '7';
	}
	if (e.code === 'Numpad8' || e.code === 'Digit8') {
		data = '8';
	}
	if (e.code === 'Numpad9' || e.code === 'Digit9') {
		data = '9';
	}
	if (e.code === 'Numpad0' || e.code === 'Digit0') {
		data = '0';
	}
	if (e.code === 'NumpadAdd') {
		data = '+';
	}
	if (e.code === 'NumpadSubtract') {
		data = '-';
	}
	if (e.code === 'NumpadMultiply') {
		data = '*';
	}
	if (e.code === 'NumpadDivide') {
		data = '/';
	}
	if (e.code === 'Equal' || e.code === 'Enter' || e.code === 'NumpadEnter') {
		data = '=';
	}
	if (e.code === 'Backspace') {
		data = 'delete';
	}
	operation(data);
	renderHistory(history);
	if (data !== '=') {
		renderTotal(tempNumber);
	}
})

calculator.addEventListener('click', function (e) {
	const target = e.target;

	//Переключаем тему калькулятора
	if (target.closest('.theme-calculator')) {
		target.closest('.theme-calculator').classList.toggle('dark');
		calculator.classList.toggle('calculator__light');
		document.body.classList.toggle('dark');
	}

	// Открытие/Скрытие панель истории
	if (target.dataset.type === 'history') {
		calculator.querySelector('.history-block-calculator').classList.add('active')
	} else if (target.classList.contains('history-block-calculator__btn')) {
		calculator.querySelector('.history-block-calculator').classList.remove('active')
	}

	//Функционал кнопок
	if (target.classList.contains('actions-calculator__col')) {
		const data = target.dataset.type;
		operation(data);
		renderHistory(history);
		if (data !== '=') {
			renderTotal(tempNumber);
		}
	}
	// Меняем clear на clearAll и обратно;
	if (target.dataset.type === 'clear') {
		target.dataset.type = 'clearAll';
		target.innerHTML = 'CA';
	} else if (target.dataset.type === 'clearAll') {
		target.dataset.type = 'clear';
		target.innerHTML = 'C';
	}
})

function operation(data) {
	//Работа с числами
	if (data >= 0) {
		operationType = 'number';
		tempNumber = tempNumber === '0' ? data : tempNumber += data;
		// Работа с плавающей точкой
	} else if (data === 'float') {
		operationType = 'number';
		if (!/\./.test(tempNumber)) {
			tempNumber.length === 0 ? tempNumber += '0.' : tempNumber += '.';
		}
		// Backspace
	} else if (data === 'delete' && operationType === 'number') {
		tempNumber = tempNumber.slice(0, -1);
		tempNumber = tempNumber.length === 0 ? '0' : tempNumber;

		// +, - , *, /
	} else if (actions.includes(data)) {
		operationType = data;
		tempNumber = String(parseFloat(tempNumber));
		tempNumber === '0' ? history.splice(-1, 1, operationType) : history.push(tempNumber, operationType);
		//history.push(tempNumber, operationType)
		tempNumber = `0`;
		// Равно
	} else if (data === '=') {
		calculate(history);
		// Очистка
	} else if (data === 'clear') {
		if (history.length > 0) {
			history.push(tempNumber);
		}
		if (history.length > 0) {
			allHistory.push(history);
		}
		addHistory(allHistory);
		tempNumber = '0';
	} else if (data === 'clearAll') {
		clearAllHistory();
	}
}
function renderHistory(value) {
	const historyBlock = calculator.querySelector('.calculator__history');
	let htmlElements = ``;

	for (const item of value) {
		if (item >= 0) {
			htmlElements += `<span>${item}</span>`
		} else if (actions.includes(item)) {
			htmlElements += `&nbsp;<strong>${item}</strong>&nbsp;`
		}
	}

	historyBlock.innerHTML = htmlElements;
}

function renderTotal(value) {
	const totalBlock = calculator.querySelector('.calculator__total');
	if (history.length > 3 && tempNumber === '0') {
		allHistory.concat(history);
		let newHistory = history.slice(0, -1);
		const result = eval(newHistory.join(' '));
		if (isNaN(result)) {
			totalBlock.innerHTML = 'Ошибка';
			tempNumber = '0'
			history = []
		} else if (!isFinite(result)) {
			totalBlock.innerHTML = 'Бесконечность';
			tempNumber = '0'
			history = []
		} else {
			totalBlock.innerHTML = result;
		}

	} else {
		totalBlock.innerHTML = value;
	}
}

function calculate(historyArray) {
	const totalBlock = calculator.querySelector('.calculator__total');
	historyArray.push(tempNumber);
	let result = eval(historyArray.join(' '));
	if (isNaN(result)) {
		totalBlock.innerHTML = 'Ошибка';
		result = '0';
	} else if (!isFinite(result)) {
		totalBlock.innerHTML = 'Бесконечность';
		result = '0';
	} else {
		totalBlock.innerHTML = `${result}`;
	}
	tempNumber = `${result}`
	allHistory.push(historyArray);
	addHistory(allHistory);
	history = [];
}

function addHistory(value) {
	const allHistoryBlock = document.querySelector('.history-block-calculator');
	let htmlElements = '';
	if (value.length) {
		value.forEach(array => {
			if (array.length > 1) {
				let result = eval(array.join(' '));
				for (let item of array) {
					if (item >= 0) {
						htmlElements += `<span>${item}</span>`
					} else {
						htmlElements += `&nbsp;<strong>${item}</strong>&nbsp;`
					}
				}
				allHistoryBlock.insertAdjacentHTML('beforeend', `<div class="history-block-calculator__wrapper">
				<div class="history-block-calculator__history">
					${htmlElements};
				</div>
				<div class="history-block-calculator__total">${result}</div>
			</div>`)
			}
		})
	}
	allHistory = [];
	history = [];
}

function clearAllHistory() {
	let history = document.querySelector('.history-block-calculator');
	let allHistoryBlock = history.querySelectorAll('.history-block-calculator__wrapper');
	allHistoryBlock.forEach(item => {
		item.remove();
	})
	tempNumber = '0'
	allHistory = [];
}