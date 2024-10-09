import './style.scss'
import data from './data'
import data5 from './data5'
import data10 from './data10'
import myAudioResource from './assets/1.mp3';
import audioWin from './assets/2.mp3';
import backgroundJapanLight from './assets/japan.jpg';
import backgroundJapanNight from './assets/japanNight.jpg';
let body = document.querySelector('body');
let name = ['deer', 'rabbit', 'umbrella', 'elephant', 'bear'];
let name5 = ['dog', 'castle', 'smile', 'dinosaur', 'mushroom'];
let name10 = ['clown', 'turtle&sun', 'man', 'cat', 'hare'];
let count = 0;
let resultsGames = [];
let isFirstClick = true;
let themeLight = true;
let gradient;


//функция создания добавления элемента
function createElement(parent, classElement, element) {
	let child = document.createElement(element);
	child.classList.add(classElement);
	parent.append(child);
	return child;
}

//создаем контейнер и меню кнопок
let container = createElement(body, 'container', 'div');
let nav = createElement(container, 'nav', 'nav');

// добавляем кнопку к списку кнопок
function addButton(text) {
	let li = createElement(nav, 'item', 'li');
	let button = createElement(li, 'button', 'button');
	button.innerHTML = text;
	button.dataset.name = text;
}

//добавляем все кнопки
addButton('theme');
addButton('random game');
addButton('solution');
addButton('results');
addButton('save');
addButton('reset');
addButton('continue');

//добавляем  время
let timeMinutes = 0;
let timeSeconds = 0;
let intervalID;
let s;
let game = createElement(container, 'game', 'div');
let time = createElement(game, 'time', 'div');
time.innerHTML = `time: ${timeMinutes} : ${timeSeconds} `;

// считаем и записываем время
function minutesSeconds() {
	window.clearInterval(intervalID);
	s = 0; timeMinutes = 0;
	intervalID = setInterval(timeCount, 1000);
	function timeCount() {
		timeSeconds = s;
		if (s >= 60) {
			timeMinutes = Math.floor(s / 60);
			timeSeconds = s % 60;
		}
		time.innerHTML = `time: ${timeMinutes} : ${timeSeconds} `;
		s++;
	}
	intervalID;
}



//добавляем аудио
const audio = new Audio(myAudioResource);
function music() {
	audio.play();
}
const audioWinPlay = new Audio(audioWin);
function musicWin() {
	audioWinPlay.play();
}


let arrayGameAll = [];
let sizeDefineGame;
let indexArrayGame;
//опеределяем матрицу игры
function defineArrayGame(size, index) {
	arrayGame = [];
	arraySquare = [];
	let defineData;
	switch (size) {
		case 5: defineData = data5; break;
		case 10: defineData = data10; break;
		case 15: defineData = data; break;
	}
	for (let i = 0; i < defineData.length; i++) {
		arrayGameAll[i] = defineData[i].split('\n').map(el => el.split(''));
	}
	sizeDefineGame = size;
	indexArrayGame = index;
	return arrayGameAll[index];
}


//матрица нулевая 
let arrayGameNull = Array.from({ length: data[0].length }, () => Array.from({ length: data[0].length }, () => 0));
let arrayGame = arrayGameNull;

// матрица подсказок 
function matrixHints(array) {
	let arrayHints = []
	for (let i = 0; i < array.length; i++) {
		let arr = array[i].join('').split('0').filter(el => el !== '').map(el => el.length);
		arrayHints[i] = Array.from({ length: 5 }, () => 0).map((el, index) => {
			let elementHint = arr[arr.length - index - 1];
			if (elementHint) { return elementHint; } else { return el; }
		}).reverse();
	}
	return arrayHints;
}

function matrixToTransporte(array) {
	let arrayTranspote = [];
	for (let i = 0; i < array.length; i++) {
		arrayTranspote[i] = new Array(array.length);
	}
	for (let i = 0; i < array.length; i++) {
		for (let j = 0; j < array.length; j++) {
			arrayTranspote[j][i] = array[i][j];
		}
	}
	return arrayTranspote;
}
//выравнивание текста по ячейке
function textAlign(text, sizeSquare, i, j) {
	ctx.font = "20px Raleway";
	ctx.fillStyle = "green";
	//  выравнивание по центру квадрата
	let x = sizeSquare * i;
	let y = sizeSquare * j;
	let width = sizeSquare;
	let height = sizeSquare;
	let textWidth = ctx.measureText(text).width;
	let textXY = {};
	textXY.x = x + (width - textWidth) / 2;
	textXY.y = y + (height / 2) + 8;
	return textXY;
}

function drawLines(size) {
	ctx.lineWidth = 3;
	ctx.strokeStyle = 'red';
	ctx.strokeRect(0, 0, canvas.width, canvas.height);
	for (let i = 0; i < sizeArea; i++) {
		for (let j = 0; j < sizeArea; j++) {
			if (i % 5 == 0 && j % 5 == 0) {
				ctx.beginPath();
				ctx.moveTo(size * i, size * j);
				ctx.lineTo(size * i * 5, size * j);
				ctx.stroke();
				ctx.beginPath();
				ctx.moveTo(size * i, size * j);
				ctx.lineTo(size * i, size * j * 5);
				ctx.stroke();
			}
			if (i < 5 && j % 5 == 0) {
				ctx.beginPath();
				ctx.moveTo(0, size * j);
				ctx.lineTo(size * 5, size * j);
				ctx.stroke();
			}
			if (j < 5 && i % 5 == 0) {
				ctx.beginPath();
				ctx.moveTo(size * i, 0);
				ctx.lineTo(size * i, size * 5);
				ctx.stroke();
			}
		}
	}
}



function drawArea(sizeArea, array) {
	let matrixTopArray = matrixHints(matrixToTransporte(array));
	let matrixLeftArray = matrixHints(array);
	for (let i = 5; i < sizeArea; i++) {
		for (let j = 0; j < 5; j++) {
			ctx.strokeStyle = "rgba(0, 0, 0, 0)";
			ctx.strokeRect(sizeSquare * i, sizeSquare * j, sizeSquare, sizeSquare);
			if (matrixTopArray[i - 5][j] !== 0) {
				let text = matrixTopArray[i - 5][j];
				let textXY = textAlign(text, sizeSquare, i, j);
				ctx.fillText(text, textXY.x, textXY.y);
			}
		}
		ctx.lineWidth = 0.2;
		ctx.strokeStyle = 'green';
		ctx.strokeRect(sizeSquare * i, 0, sizeSquare, sizeSquare * 5);
	}
	for (let i = 0; i < 5; i++) {
		for (let j = 5; j < sizeArea; j++) {
			ctx.strokeStyle = "rgba(0, 0, 0, 0)";
			ctx.strokeRect(sizeSquare * i, sizeSquare * j, sizeSquare, sizeSquare);
			if (matrixLeftArray[j - 5][i] !== 0) {
				let text = matrixLeftArray[j - 5][i];
				let textXYZ = textAlign(text, sizeSquare, i, j);
				ctx.fillText(text, textXYZ.x, textXYZ.y);
			}
			ctx.lineWidth = 0.2;
			ctx.strokeStyle = 'green';
			ctx.strokeRect(0, sizeSquare * j, sizeSquare * 5, sizeSquare);
		}
	}
	for (let i = 5; i < sizeArea; i++) {
		arraySquare[i - 5] = [];
		for (let j = 5; j < sizeArea; j++) {
			ctx.lineWidth = 0.2;
			ctx.strokeStyle = 'green';
			ctx.strokeRect(sizeSquare * i, sizeSquare * j, sizeSquare, sizeSquare);
			let square = {};
			square.x = sizeSquare * i;
			square.y = sizeSquare * j;
			square.size = sizeSquare;
			square.box = false;
			square.cross = false;
			arraySquare[i - 5].push(square);
		}
	}
	drawLines(sizeSquare);
}

//моздаем поверхность canvas
let canvas = createElement(container, 'canvas', 'canvas');
canvas.id = 'myCanvas';
let arraySquare = [];
let ctx = canvas.getContext('2d');
canvas.width = '490';
canvas.height = '490';
let sizeArea;
let sizeSquare;
let sizeGame = 5;
createCanvas(sizeGame, arrayGame);

function createCanvas(size, array) {
	isFirstClick = true;
	arraySquare = [];
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.strokeStyle = 'red';
	sizeArea = size + 5;
	sizeSquare = canvas.width / sizeArea;
	ctx.strokeRect(0, 0, canvas.width / sizeArea * 5, canvas.width / sizeArea * 5);
	ctx.lineWidth = 2;
	ctx.strokeRect(0, 0, canvas.width, canvas.width);
	drawArea(sizeArea, array);
}


// добавляем возможные размеры
let frameSize = createElement(container, 'frame-size', 'div');
frameSize.innerHTML = `level:`

let span5 = createElement(frameSize, 'size-canvas', 'span');
span5.dataset.sizeCanvas = 5;
let span10 = createElement(frameSize, 'size-canvas', 'span');
span10.dataset.sizeCanvas = 10;
let span15 = createElement(frameSize, 'size-canvas', 'span');
span15.dataset.sizeCanvas = 15;

span5.innerHTML = `easy`;
span10.innerHTML = `medium`;
span15.innerHTML = `hard`;
//
let arraySizes = document.querySelectorAll('.size-canvas');
let nameNono = createElement(container, 'names', 'div');

//рисуем поверхность игры
arraySizes.forEach(el => el.addEventListener('click', (event) => {
	let nameNonoArray = [];
	sizeGame = Number(el.dataset.sizeCanvas);
	switch (sizeGame) {
		case 5: nameNonoArray = name5; break;
		case 10: nameNonoArray = name10; break;
		case 15: nameNonoArray = name; break;
	}
	nameNono.replaceChildren();

	nameNonoArray.forEach((ell, index) => {
		let item = createElement(nameNono, 'names__item', 'div');
		item.innerHTML = ell;
		item.addEventListener('click', () => {
			arrayGame = defineArrayGame(sizeGame, index);
			createCanvas(sizeGame, arrayGame);
		})
	})
}));


// Функция для проверки попадания точки в квадрат
function isInsideSquare(mouseXY, square) {
	return mouseXY.x > square.x &&
		mouseXY.x < square.x + square.size &&
		mouseXY.y > square.y &&
		mouseXY.y < square.y + square.size;
}

//координаты мыши
function mouseCoords(event) {
	const rect = canvas.getBoundingClientRect();
	const scaleX = canvas.width / rect.width;
	const scaleY = canvas.height / rect.height;
	const mouse = {};
	mouse.x = (event.clientX - rect.left) * scaleX;
	mouse.y = (event.clientY - rect.top) * scaleY;
	return mouse;
}

function drawRectFull(square) {
	ctx.lineWidth = 2;
	ctx.fillStyle = 'white';
	ctx.fillRect(square.x, square.y, square.size, square.size);
	ctx.fillStyle = 'green';
	ctx.fillRect(square.x, square.y, square.size, square.size);
	ctx.strokeStyle = 'white';
	ctx.strokeRect(square.x, square.y, square.size, square.size);
	drawLines(sizeSquare);
}

function drawRectX(square) {
	ctx.lineWidth = 2;
	ctx.fillStyle = 'white';
	ctx.fillRect(square.x, square.y, square.size, square.size);
	ctx.fillStyle = 'green';
	ctx.strokeStyle = 'green';
	ctx.beginPath();
	ctx.moveTo(square.x, square.y);
	ctx.lineTo(square.x + square.size, square.y + square.size);
	ctx.moveTo(square.x, square.y + square.size);
	ctx.lineTo(square.x + square.size, square.y);
	ctx.stroke();
	ctx.lineWidth = 0.2;
	ctx.strokeStyle = 'green';
	ctx.strokeRect(square.x, square.y, square.size, square.size);
	drawLines(sizeSquare);
}
function drawRectClear(square) {
	ctx.fillStyle = 'white';
	ctx.fillRect(square.x, square.y, square.size, square.size);
	ctx.lineWidth = 0.2;
	ctx.strokeStyle = 'green';
	ctx.strokeRect(square.x, square.y, square.size, square.size);
	drawLines(sizeSquare);
}

canvas.addEventListener('contextmenu', function (event) {
	event.preventDefault();
});

canvas.addEventListener('mousedown', (event) => {
	event.preventDefault();
	event.stopPropagation();

	let mouseXY = mouseCoords(event);
	for (let i = 0; i < arraySquare.length; i++) {
		for (let j = 0; j < arraySquare.length; j++) {
			if (isInsideSquare(mouseXY, arraySquare[i][j])) {
				if (isFirstClick) { minutesSeconds(); isFirstClick = false; }
				music();
				let squareClick = arraySquare[i][j];
				if (event.button === 0 && !squareClick.box) {
					drawRectFull(squareClick);
					squareClick.box = true;
				}
				else if (event.button === 0 && squareClick.cross) {
					drawRectFull(squareClick);
					squareClick.box = true;
					squareClick.cross = false;
				}
				else if (event.button === 2 && !squareClick.cross) {
					drawRectX(squareClick);
					squareClick.cross = true;
				}
				else if (event.button === 0 && squareClick.box) {
					drawRectClear(squareClick);
					squareClick.box = false;
				}
				else if (event.button === 2 && squareClick.cross) {
					drawRectClear(squareClick);
					squareClick.box = false;
					squareClick.cross = false;
				}

			}
		}
	}
	if (checkGame(arrayGame, arraySquare) && (!checkNull(arrayGame))) {
		modalWindowFun();
		musicWin();
		let result = {};
		result.id = count;
		result.times = time.innerHTML;
		let level; let nameArrayDifine;
		switch (arrayGame.length) {
			case 5: level = "easy"; nameArrayDifine = name5; break;
			case 10: level = "medium"; nameArrayDifine = name10; break;
			case 15: level = "hard"; nameArrayDifine = name; break;
		}
		result.level = level;
		result.name = nameArrayDifine[indexArrayGame];
		if (count > 5) { resultsGames.shift(); }
		resultsGames.push(result);
		count++;
		setLocalStorageResults(resultsGames);
	}
})

function checkGame(array, arraySquare) {
	let check = true;
	for (let i = 0; i < arraySquare.length; i++) {
		for (let j = 0; j < arraySquare.length; j++) {
			if (Number(array[i][j]) == 1) { if (!arraySquare[j][i].box) { check = false; break; } }
			if (Number(array[i][j]) == 0) { if (arraySquare[j][i].box) { check = false; break; } }
		}
		if (check == false) break;
	}
	return check;
}

nav.addEventListener('click', (event) => {
	event.preventDefault();
	event.stopPropagation();
	window.clearInterval(intervalID); isFirstClick = true;
	time.innerHTML = `time: 0 : 0 `;
	if (event.target.dataset.name === 'solution') {
		for (let i = 0; i < arraySquare.length; i++) {
			for (let j = 0; j < arraySquare.length; j++) {
				ctx.fillStyle = 'white';
				ctx.fillRect(arraySquare[j][i].x, arraySquare[j][i].y, arraySquare[j][i].size, arraySquare[j][i].size);
				ctx.fillStyle = 'green';
				if (Number(arrayGame[i][j]) === 1) {
					ctx.fillRect(arraySquare[j][i].x, arraySquare[j][i].y, arraySquare[j][i].size, arraySquare[j][i].size);
					ctx.strokeStyle = 'white';
					ctx.strokeRect(arraySquare[j][i].x, arraySquare[j][i].y, arraySquare[j][i].size, arraySquare[j][i].size);
					drawLines(sizeSquare);
				}
				else {
					ctx.strokeStyle = 'green';
					ctx.strokeRect(arraySquare[j][i].x, arraySquare[j][i].y, arraySquare[j][i].size, arraySquare[j][i].size);
					drawLines(sizeSquare);
				}
			}
		}
	}
	if (event.target.dataset.name === 'reset') {
		createCanvas(sizeGame, arrayGameNull);
	}
	if (event.target.dataset.name === 'random game') {
		createCanvas(sizeGame, arrayGameNull);
		const numbers = [5, 10, 15];
		const randomIndex = Math.floor(Math.random() * numbers.length);
		const sizeRandom = numbers[randomIndex];
		let indexRandom = Math.floor(Math.random() * 5);
		arrayGame = defineArrayGame(sizeRandom, indexRandom);
		createCanvas(sizeRandom, arrayGame);
	}
	if (event.target.dataset.name === 'save') {
		setLocalStorage(arrayGame, arraySquare);
	}
	if (event.target.dataset.name === 'continue') {
		arrayGame = [];
		arrayGame = getLocalStorageMain();
		createCanvas(arrayGame[0].length, arrayGame);
		arraySquare = [];
		arraySquare = getLocalStoragePlay();
		drawSaveGame(arraySquare);
	}
	if (event.target.dataset.name === 'results') {
		let modalWindow = createElement(container, 'modal-window', 'div');
		let blackCover = createElement(modalWindow, "black-cover", 'div');
		const modal = createElement(modalWindow, "modal", 'div');
		//cоздаем список результатов
		let listResults;
		listResults = createElement(modal, 'results', 'ol');
		let listResultsFind = document.querySelector('.results');
		for (let i = 0; i < 5; i++) {
			listResults[i] = createElement(listResults, 'result', 'li');
		}
		let listfromStorage = getLocalStorageResults();
		listfromStorage.sort((a, b) => b.time - a.time);
		if (listfromStorage) {
			for (let i = 0; i < listfromStorage.length; i++) {
				listResults[i].innerHTML = `game   
			 ${listfromStorage[i].name} ${listfromStorage[i].level} ${listfromStorage[i].times} `;
			}
		}

		let button = createElement(modal, 'button-modal', 'button');
		button.innerHTML = `close`;
		let gameNewButton = document.querySelector('.button-modal');
		gameNewButton.addEventListener('click', () => {
			modalWindow.replaceChildren();

		});

	}
	if (event.target.dataset.name === 'theme' && themeLight) {
		themeLight = false;
		gradient = 'linear-gradient(to right, rgba(0, 0, 0, 0.8) 0 100%)';
		document.body.style.background = `${gradient}, url(${backgroundJapanNight})`;
		document.body.style.backgroundRepeat = 'no-repeat';
		document.body.style.backgroundPosition = 'center';
		document.body.style.backgroundSize = 'cover';
		document.body.style.color = "white";

	} else if (event.target.dataset.name === 'theme' && !themeLight) {
		themeLight = true;
		gradient = 'linear-gradient(to right, rgba(255, 255, 255, 0.8) 0 100%)';
		document.body.style.background = `${gradient}, url(${backgroundJapanLight})`;
		document.body.style.backgroundRepeat = 'no-repeat';
		document.body.style.backgroundPosition = 'center';
		document.body.style.backgroundSize = 'cover';
		document.body.style.color = "black";
	}



})
function setLocalStorage(arrayMain, arrayPlay) {
	localStorage.removeItem('arrayMain');
	localStorage.removeItem('arrayPlay');
	localStorage['arrayMain'] = JSON.stringify(arrayMain);
	localStorage['arrayPlay'] = JSON.stringify(arrayPlay);
}

function getLocalStorageMain() {
	let array = [];
	if (localStorage['arrayMain']) {
		array = JSON.parse(localStorage['arrayMain']);
		return array;
	}
}
function getLocalStoragePlay() {
	let array = [];
	if (localStorage['arrayPlay']) {
		array = JSON.parse(localStorage['arrayPlay']);
		return array;
	}
}
function drawSaveGame(arr) {
	for (let i = 0; i < arr.length; i++) {
		for (let j = 0; j < arr.length; j++) {
			if (arr[i][j].box) {
				drawRectFull(arr[i][j]);
			}
			else if (arr[i][j].cross) {
				drawRectX(arr[i][j]);
			}
		}
	}
}
//сохранить десять последних результатов

function setLocalStorageResults(results) {
	localStorage['results'] = JSON.stringify(results);
}




function modalWindowFun() {
	let modalWindow = createElement(container, 'modal-window', 'div');
	let blackCover = createElement(modalWindow, "black-cover", 'div');
	const modal = createElement(modalWindow, "modal", 'div');
	const greetingMessage = `<div>Great! You solved the nonogram! Your time: ${timeMinutes} : ${timeSeconds}</div>`;
	modal.innerHTML = `${greetingMessage}
	<button class="button-modal">close</button>`;
	let gameNewButton = document.querySelector('.button-modal');
	gameNewButton.addEventListener('click', () => {
		modalWindow.replaceChildren();
		window.clearInterval(intervalID); isFirstClick = true;
		time.innerHTML = `time: 0 : 0 `;
	});

}




function getLocalStorageResults() {
	if (localStorage['results']) {
		let results = JSON.parse(localStorage['results']);
		return results;
	}
}
function checkNull(array) {
	let check = true;
	for (let i = 0; i < array.length; i++) {
		for (let j = 0; j < array.length; j++) {
			if (Number(array[i][j]) !== 0) { check = false; break; }
		}
		if (check == false) break;
	}
	return check;
}
