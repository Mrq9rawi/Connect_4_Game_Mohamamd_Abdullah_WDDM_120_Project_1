const gameBoard = document.getElementById("game-board");
const audio = document.getElementById("sound-effect");
const startButton = document.querySelector("main .game .container .start-game-button");
const restartButton = document.querySelector("main .game .container .restart-game-button");
const gameContainer = document.querySelector("main .game .container");
const placeholder = document.querySelector("main .game .container .placeholder");

let redPlayer = "red";
let yellowPlayer = "yellow";
let columns = 7;
let rows = 6;
let redPlayerCoords = [];
let yellowPlayerCoords = [];
let currentPlayer = redPlayer;


startButton.addEventListener("click", createGame);
restartButton.addEventListener("click", () => {
	if (gameBoard.classList.contains("started")) { gameOver("restart"); }
});

function createGame() {
	if (!gameBoard.classList.contains("started")) {
		placeholder.style.display = "none";
		startButton.style.cursor = "not-allowed";
		gameBoard.classList.add("started");
		let playerTurnDiv = document.createElement("div");
		playerTurnDiv.classList.add("player-turn");
		playerTurnDiv.innerHTML = "It Is <span class='current-player'></span> Turn";
		gameContainer.prepend(playerTurnDiv);
		for (let r = 0; r < rows; r++) {
			for (let c = 0; c < columns; c++) {
				let tile = document.createElement("div");
				tile.classList.add("tile");
				tile.id = `${r.toString()}-${c.toString()}`;
				tile.addEventListener("click", addCoord);
				gameBoard.appendChild(tile);
			}
		}
		switchPlayer("Red Player", "red");
	}

}

function addCoord() {
	let parentNodes = gameBoard.childNodes;


	let coord = document.createElement("div");
	coord.classList.add("coord");
	let chosenTile = this;
	if (!this.classList.contains("used")) {
		parentNodes.forEach((tile, index) => {
			let nextTileIndex = index + 7;
			if (tile === chosenTile) {
				for (let t = 0; t < rows - 1; t++) {
					if (index >= 35) {
						chosenTile.classList.add("used");
						chosenTile.append(coord);
						placeCoord(coord, chosenTile.id);
						break;
					} else if (chosenTile.parentNode.childNodes[nextTileIndex].classList.contains("used")) {
						let nextTile = chosenTile.parentNode.childNodes[nextTileIndex - 7];
						placeCoord(coord, nextTile.id);
						nextTile.classList.add("used");
						nextTile.append(coord);
						break;
					} else {
						if (nextTileIndex <= 34) {
							nextTileIndex += 7;
						} else {
							let nextTile = chosenTile.parentNode.childNodes[nextTileIndex];
							nextTile.classList.add("used");
							nextTile.append(coord);
							placeCoord(coord, nextTile.id);
							break;
						}
					}
				}
			}
		});
	}


	let tilesUsed = 0;

	parentNodes.forEach((tile) => {
		if (tile.classList.contains("used")) {
			tilesUsed++;
		}
		if (tilesUsed == 42) {
			gameOver("tie");

		}
	});

	audio.play();
}

function placeCoord(coord, tileId) {
	let arrayToUse = [];
	if (currentPlayer == redPlayer) {
		coord.classList.add("red");
		redPlayerCoords.push(tileId);
		currentPlayer = yellowPlayer;
		arrayToUse = redPlayerCoords;
		switchPlayer("Yellow Player", "yellow");
	} else {
		coord.classList.add("yellow");
		yellowPlayerCoords.push(tileId);
		currentPlayer = redPlayer;
		arrayToUse = yellowPlayerCoords;
		switchPlayer("Red Player", "red");
	}
	checkWinner(tileId, arrayToUse);
}

function switchPlayer(player, color) {
	const currentPlayerSpan = document.querySelector("main .game .container .current-player");

	currentPlayerSpan.textContent = player;
	currentPlayerSpan.classList.remove("red");
	currentPlayerSpan.classList.remove("yellow");
	currentPlayerSpan.classList.add(color);
}

function checkWinner(tileId, player) {
	let rowNumber = tileId.charAt(0);
	let columnNumber = tileId.charAt(2);


	// Check horizontally
	if (
		player.includes(`${rowNumber}-${+columnNumber - 1}`)
		&& player.includes(`${rowNumber}-${+columnNumber - 2}`)
		&& player.includes(`${rowNumber}-${+columnNumber - 3}`)
		|| player.includes(`${rowNumber}-${+columnNumber + 1}`)
		&& player.includes(`${rowNumber}-${+columnNumber + 2}`)
		&& player.includes(`${rowNumber}-${+columnNumber + 3}`)
		|| player.includes(`${rowNumber}-${+columnNumber - 1}`)
		&& player.includes(`${rowNumber}-${+columnNumber + 1}`)
		&& player.includes(`${rowNumber}-${+columnNumber + 2}`)
		|| player.includes(`${rowNumber}-${+columnNumber + 1}`)
		&& player.includes(`${rowNumber}-${+columnNumber - 1}`)
		&& player.includes(`${rowNumber}-${+columnNumber - 2}`)
	) {
		gameOver();
	}

	// Check vertically
	if (
		player.includes(`${+rowNumber - 1}-${columnNumber}`)
		&& player.includes(`${+rowNumber - 2}-${columnNumber}`)
		&& player.includes(`${+rowNumber - 3}-${columnNumber}`)
		|| player.includes(`${+rowNumber + 1}-${columnNumber}`)
		&& player.includes(`${+rowNumber + 2}-${columnNumber}`)
		&& player.includes(`${+rowNumber + 3}-${columnNumber}`)
		|| player.includes(`${+rowNumber - 1}-${columnNumber}`)
		&& player.includes(`${+rowNumber + 1}-${columnNumber}`)
		&& player.includes(`${+rowNumber + 2}-${columnNumber}`)
		|| player.includes(`${+rowNumber + 1}-${columnNumber}`)
		&& player.includes(`${+rowNumber - 1}-${columnNumber}`)
		&& player.includes(`${+rowNumber - 2}-${columnNumber}`)
	) {
		gameOver();
	}

	// Check diagonally
	if (
		player.includes(`${+rowNumber - 1}-${+columnNumber - 1}`)
		&& player.includes(`${+rowNumber - 2}-${+columnNumber - 1}`)
		&& player.includes(`${+rowNumber - 3}-${+columnNumber - 3}`)
		|| player.includes(`${+rowNumber + 1}-${+columnNumber + 1}`)
		&& player.includes(`${+rowNumber + 2}-${+columnNumber + 2}`)
		&& player.includes(`${+rowNumber + 3}-${+columnNumber + 3}`)
		|| player.includes(`${+rowNumber - 1}-${+columnNumber - 1}`)
		&& player.includes(`${+rowNumber + 1}-${+columnNumber + 1}`)
		&& player.includes(`${+rowNumber + 2}-${+columnNumber + 2}`)
		|| player.includes(`${+rowNumber + 1}-${+columnNumber + 1}`)
		&& player.includes(`${+rowNumber - 1}-${+columnNumber - 1}`)
		&& player.includes(`${+rowNumber - 2}-${+columnNumber - 2}`)
		|| player.includes(`${+rowNumber - 1}-${+columnNumber + 1}`)
		&& player.includes(`${+rowNumber - 2}-${+columnNumber + 1}`)
		&& player.includes(`${+rowNumber - 3}-${+columnNumber + 3}`)
		|| player.includes(`${+rowNumber + 1}-${+columnNumber - 1}`)
		&& player.includes(`${+rowNumber + 2}-${+columnNumber - 2}`)
		&& player.includes(`${+rowNumber + 3}-${+columnNumber - 3}`)
		|| player.includes(`${+rowNumber - 1}-${+columnNumber + 1}`)
		&& player.includes(`${+rowNumber + 1}-${+columnNumber - 1}`)
		&& player.includes(`${+rowNumber + 2}-${+columnNumber - 2}`)
		|| player.includes(`${+rowNumber + 1}-${+columnNumber - 1}`)
		&& player.includes(`${+rowNumber - 1}-${+columnNumber + 1}`)
		&& player.includes(`${+rowNumber - 2}-${+columnNumber + 2}`)
	) {
		gameOver();
	}

}


function gameOver(state) {

	let winnerDiv = document.createElement("div");
	let overlayDiv = document.createElement("div");
	let contentDiv = document.createElement("div");
	let crossMarkDiv = document.createElement("div");
	let winnerTextP = document.createElement("p");

	overlayDiv.addEventListener("click", removeWinnerDiv);
	crossMarkDiv.addEventListener("click", removeWinnerDiv);

	winnerDiv.classList.add("winner");
	overlayDiv.classList.add("overlay");
	contentDiv.classList.add("content");
	crossMarkDiv.classList.add("cross-mark");
	winnerTextP.classList.add("text");
	if (currentPlayer == redPlayer && !state) {
		winnerTextP.textContent = "The Winner Is YELLOW Player";
	} else if (currentPlayer == yellowPlayer && !state) {
		winnerTextP.textContent = "The Winner Is RED Player";
	} else if (state == "tie") {
		winnerTextP.textContent = "It Is A Draw";
	};

	if (state !== "restart") {
		gameContainer.append(winnerDiv);
		winnerDiv.append(overlayDiv);
		winnerDiv.append(contentDiv);
		contentDiv.append(crossMarkDiv);
		contentDiv.append(winnerTextP);
	}

	function removeWinnerDiv() {
		winnerDiv.remove();
	}

	placeholder.style.display = "block";

	gameBoard.classList.remove("started");
	startButton.style.cursor = "pointer";
	const tiles = document.querySelectorAll("main .container .game-board .tile");
	tiles.forEach((tile) => {
		tile.remove();
	});
	document.querySelector("main .game .container .player-turn").remove();
	currentPlayer = redPlayer;
	redPlayerCoords = [];
	yellowPlayerCoords = [];
};

