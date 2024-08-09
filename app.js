const draggables = document.querySelectorAll('.draggable');
const dropzones = document.querySelectorAll('.dropzone');
const pageGame = document.getElementById('page-game');
const messageElement = document.getElementById('message');

let isMoving = false;
let initialPlayerX = 0;
let initialPlayerY = 0;
let gameRunning = true;
let currentElement = null;
let initialPositions = new Map();
let points = 0;

document.addEventListener('DOMContentLoaded', () => {
	draggables.forEach((draggable) => {
		initialPositions.set(draggable.id, {
			left: draggable.offsetLeft,
			top: draggable.offsetTop,
		});

		draggable.addEventListener('mousedown', (event) => {
			startDragging(event, draggable);
		});

		draggable.addEventListener('touchstart', (event) => {
			startDragging(event, draggable);
		});
	});

	document.addEventListener('mouseup', () => {
		stopDragging();
	});

	document.addEventListener('touchend', () => {
		stopDragging();
	});

	document.addEventListener('mousemove', (event) => {
		movePlayer(event);
	});

	document.addEventListener('touchmove', (event) => {
		movePlayer(event);
	});
});

function startDragging(event, element) {
	isMoving = true;

	currentElement = element;
	currentElement.classList.remove('animate');

	initialPlayerX =
		(event.type === 'touchstart' ? event.touches[0].clientX : event.clientX) -
		element.offsetLeft;
	initialPlayerY =
		(event.type === 'touchstart' ? event.touches[0].clientY : event.clientY) -
		element.offsetTop;
}

function stopDragging() {
	if (currentElement) {
		const initialPos = initialPositions.get(currentElement.id);

		const isColliding = Array.from(dropzones).some((dropzone) => {
			return (
				isElementOverlapping(currentElement, dropzone) &&
				dropzone.dataset.value === currentElement.dataset.value
			);
		});

		if (isColliding) {
			currentElement.remove();
			points += 1;
			verifyGame();
		} else {
			currentElement.classList.add('animate');
			currentElement.style.left = `${initialPos.left}px`;
			currentElement.style.top = `${initialPos.top}px`;
		}
	}
	isMoving = false;
	currentElement = null;
}

function movePlayer(event) {
	if (isMoving && gameRunning && currentElement) {
		let posX;
		let posY;
		if (event.type === 'touchmove') {
			posX = event.touches[0].clientX;
			posY = event.touches[0].clientY;
		} else if (event.type === 'mousemove') {
			posX = event.clientX;
			posY = event.clientY;
		}

		let newPosX = posX - initialPlayerX;
		let newPosY = posY - initialPlayerY;

		currentElement.style.left = `${newPosX}px`;
		currentElement.style.top = `${newPosY}px`;
	}
}

function isElementOverlapping(el1, el2) {
	const rect1 = el1.getBoundingClientRect();
	const rect2 = el2.getBoundingClientRect();

	return !(
		rect1.right < rect2.left ||
		rect1.left > rect2.right ||
		rect1.bottom < rect2.top ||
		rect1.top > rect2.bottom
	);
}

function verifyGame() {
	if (points === 9) {
		gameRunning = false;
		messageElement.innerText = 'Fim do jogo!';
	}
}
