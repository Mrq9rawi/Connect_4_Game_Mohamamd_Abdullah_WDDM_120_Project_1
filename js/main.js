// Get All Important Elements
const gameBoard = document.getElementById("game-board");
const audio = document.getElementById("sound-effect");
const startButton = document.querySelector("main .game .container .start-game-button");
const restartButton = document.querySelector("main .game .container .restart-game-button");
const gameContainer = document.querySelector("main .game .container");
const placeholder = document.querySelector("main .game .container .placeholder");

// Declare Important Variables
let redPlayer = "red";
let yellowPlayer = "yellow";
let columns = 7;
let rows = 6;
let redPlayerCoords = [];
let yellowPlayerCoords = [];
let currentPlayer = redPlayer;
let firstToPlay;

// Add Choose Player Option
function addChoosePlayer() {
	// Create Elements
	let choosePlayerDiv = document.createElement("div");
	let choosePlayerH1 = document.createElement("h1");
	let choosePlayerRed = document.createElement("div");
	let choosePlayerYellow = document.createElement("div");
// Add Classes And Text
	choosePlayerDiv.classList.add("choose-player");
	choosePlayerRed.classList.add("coord");
	choosePlayerRed.classList.add("red");
	choosePlayerYellow.classList.add("coord");
	choosePlayerYellow.classList.add("yellow");
	// Add Functionality To The Buttons
	choosePlayerRed.addEventListener("click", () => {
		currentPlayer = redPlayer;
		firstToPlay = redPlayer;
		choosePlayerYellow.classList.remove("chosen");
		choosePlayerRed.classList.add("chosen");
	});
	choosePlayerYellow.addEventListener("click", () => {
		currentPlayer = yellowPlayer;
		firstToPlay = yellowPlayer;
		choosePlayerRed.classList.remove("chosen");
		choosePlayerYellow.classList.add("chosen");
	});
	choosePlayerH1.textContent = "Choose The First Player";

// Add Elements
	gameBoard.append(choosePlayerDiv);
	choosePlayerDiv.append(choosePlayerH1);
	choosePlayerDiv.append(choosePlayerRed);
	choosePlayerDiv.append(choosePlayerYellow);
}

// Call The Function
addChoosePlayer();

// Start Game Button And Reset Game
startButton.addEventListener("click", createGame);
restartButton.addEventListener("click", () => {
	if (gameBoard.classList.contains("started")) {
		gameOver("restart");
		createGame();
	}
});

// Create Game Function
function createGame() {
	// Check To Make Sure Game Hasn't Started Yet
	if (!gameBoard.classList.contains("started")) {
		// Check If There Is The Option To Choose A Player
		const choosePlayerDiv = document.querySelector("main .game  .container .game-board .choose-player");
		if (choosePlayerDiv) {
			choosePlayerDiv.remove();
		}
		// Remove Placeholder Div (Design Issue)
		placeholder.style.display = "none";
		// Make The Start Game Button Not Allowed On Hover
		startButton.style.cursor = "not-allowed";
		// Add Class Started To The Game Div
		gameBoard.classList.add("started");
		// Make A Player Turn Indicator
		let playerTurnDiv = document.createElement("div");
		playerTurnDiv.classList.add("player-turn");
		playerTurnDiv.innerHTML = "It Is <span class='current-player'></span> Turn";
		gameContainer.prepend(playerTurnDiv);
		// Create Game Tiles
		for (let r = 0; r < rows; r++) {
			for (let c = 0; c < columns; c++) {
				let tile = document.createElement("div");
				tile.classList.add("tile");
				// Add Id To Each Tile
				tile.id = `${r.toString()}-${c.toString()}`;
				// Add Click Event On Tiles
				tile.addEventListener("click", addCoord);
				gameBoard.appendChild(tile);
			}
		}
		// Select The Player To Play First (A function to be added in the future)
		currentPlayer == redPlayer ? switchPlayer("Red Player", "red") : switchPlayer("Yellow Player", "yellow");
	}
}

function addCoord() {
	// Store All Tiles In A Variable
	let parentNodes = gameBoard.childNodes;
	// Create A Coord
	let coord = document.createElement("div");
	coord.classList.add("coord");
	// Store The Chosen Tile In A Variable
	let chosenTile = this;
	// Check Where To Insert The Coord
	if (!this.classList.contains("used")) {
		parentNodes.forEach((tile, index) => {
			// Find Chosen Tile
			if (tile === chosenTile) {
				// Store The The Index Of The Tile Beneath The Chosen Tile in A Variable
				let nextTileIndex = index + 7;
				// Check All Rows To Find The First Empty Tile
				for (let t = 0; t < rows - 1; t++) {
					// Check If the Chosen Tile Is the Last Tile In The Column
					if (index >= 35) {
						// Insert Coord
						chosenTile.classList.add("used");
						chosenTile.append(coord);
						placeCoord(coord, chosenTile.id);
						// Break The Loop
						break;
						// Check If The Tile Beneath Empty Or Not
					} else if (chosenTile.parentNode.childNodes[nextTileIndex].classList.contains("used")) {
						// Store The Value Of The Tile To Use
						let nextTile = chosenTile.parentNode.childNodes[nextTileIndex - 7];
						// Insert Coord
						placeCoord(coord, nextTile.id);
						nextTile.classList.add("used");
						nextTile.append(coord);
						// Break The Loop
						break;
						// Change The Index If The Tile Beneath Is Not Used
					} else {
						// Check to Make Sure This is Not The Last Row
						if (nextTileIndex <= 34) {
							// Increase The Index
							nextTileIndex += 7;
						} else {
							// Store The Value Of The Tile To Use
							let nextTile = chosenTile.parentNode.childNodes[nextTileIndex];
							// Insert Coord In The Las Row
							nextTile.classList.add("used");
							nextTile.append(coord);
							placeCoord(coord, nextTile.id);
							// Break The Loop
							break;
						}
					}
				}
			}
		});
	}
	// Check How Many Tiles Have Been Used
	let tilesUsed = 0;
	parentNodes.forEach((tile) => {
		if (tile.classList.contains("used")) {
			tilesUsed++;
		}
		// If All Tiles Used End Game As Tie
		if (tilesUsed == 42) {
			gameOver("tie");
		}
	});
	// Play Audio At The End
	audio.play();
}

function placeCoord(coord, tileId) {
	// Declare The Array That We Will Pass For The Checking Winner Function
	let arrayToUse = [];
	// Check which Player Is Playing
	if (currentPlayer == redPlayer) {
		// Define A Class For The Coord's Player
		coord.classList.add("red");
		// Push Tile Id To The Array
		redPlayerCoords.push(tileId);
		// Change Current Player
		currentPlayer = yellowPlayer;
		// Change The Array To Check To Red
		arrayToUse = redPlayerCoords;
		// Switch Player's Turn Indicator
		switchPlayer("Yellow Player", "yellow");
	} else {
		// Define A Class For The Coord's Player
		coord.classList.add("yellow");
		// Push Tile Id To The Array
		yellowPlayerCoords.push(tileId);
		// Change Current Player
		currentPlayer = redPlayer;
		// Change The Array To Check To Yellow
		arrayToUse = yellowPlayerCoords;
		// Switch Player's Turn Indicator
		switchPlayer("Red Player", "red");
	}
	// Check The Winner After Each Placement
	checkWinner(tileId, arrayToUse);
}

function switchPlayer(player, color) {
	// Get The Span Indicator In The Function To make Sure Game Has Started
	const currentPlayerSpan = document.querySelector("main .game .container .current-player");
	// update Value
	currentPlayerSpan.textContent = player;
	currentPlayerSpan.classList.remove("red");
	currentPlayerSpan.classList.remove("yellow");
	currentPlayerSpan.classList.add(color);
}

function checkWinner(tileId, player) {
	// Store Row And Column Values
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
		// End Game And Declare A winner If True
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
		// End Game And Declare A winner If True
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
		// End Game And Declare A winner If True
		gameOver();
	}
}

function gameOver(state) {
	// Create Winner Indicator
	let winnerDiv = document.createElement("div");
	let overlayDiv = document.createElement("div");
	let contentDiv = document.createElement("div");
	let crossMarkDiv = document.createElement("div");
	let winnerTextP = document.createElement("p");
	let replayButton = document.createElement("button");
	// Add Events To Elements
	overlayDiv.addEventListener("click", removeWinnerDiv);
	crossMarkDiv.addEventListener("click", removeWinnerDiv);
	// Add Classes To The Elements
	winnerDiv.classList.add("winner");
	overlayDiv.classList.add("overlay");
	contentDiv.classList.add("content");
	crossMarkDiv.classList.add("cross-mark");
	winnerTextP.classList.add("text");
	// Check The state Of The Game
	if (currentPlayer == redPlayer && !state) {
		// The Player Is Always Opposite To The Winner Since The Player Changes Before Checking The Winner
		winnerTextP.textContent = "The Winner Is YELLOW Player";
	} else if (currentPlayer == yellowPlayer && !state) {
		winnerTextP.textContent = "The Winner Is RED Player";
		// Check If It Is A Tie Or Not
	} else if (state == "tie") {
		winnerTextP.textContent = "It Is A Draw";
	};
	replayButton.textContent = "Replay?";
	// Add Functionality To Replay Button
	replayButton.addEventListener("click", () => {
		removeWinnerDiv();
		createGame();
	});
	// Add All Elements To The Document If The State Is Not Restart
	if (state !== "restart") {
		gameContainer.append(winnerDiv);
		winnerDiv.append(overlayDiv);
		winnerDiv.append(contentDiv);
		contentDiv.append(crossMarkDiv);
		contentDiv.append(winnerTextP);
		contentDiv.append(replayButton);
	}
	// Remove The Winner Indicator
	function removeWinnerDiv() {
		winnerDiv.remove();
	}
	// Add Placeholder Div (Design Issue)
	placeholder.style.display = "block";
	// Change The State Of The game
	gameBoard.classList.remove("started");
	// Make The Pointer Of Start Game Button Pointer
	startButton.style.cursor = "pointer";
	// Get All Tiles
	const tiles = document.querySelectorAll("main .container .game-board .tile");
	tiles.forEach((tile) => {
		// Remove All Tiles To Clear The Game
		// (Can Be Replaced By Just Recreating The Game Or Removing All Coords And Deleting Classes From Used Tiles)
		tile.remove();
	});
	// Remove Current Player Indicator
	document.querySelector("main .game .container .player-turn").remove();
	// Reset Player Turn
	currentPlayer = firstToPlay;
	// Clear Both Players Arrays
	redPlayerCoords = [];
	yellowPlayerCoords = [];
};

