// Variables for the game board, score and number of rows
var board;
var score = 0;
var rows = 4;
var columns = 4;

// Load the best score from localStorage
var bestScore = Number(localStorage.getItem("bestScore")) || 0;

// Track the number of successful moves
var moves = 0;

// Load previously unlocked achievements
var achievements = JSON.parse(
    localStorage.getItem("achievements") || "[]"
);

// Run the setGame function when the webpage finishes loading
window.onload = function(){
    setGame();
}

/**
 * Initialises the 2048 game board.
 * Creates the HTML tiles and adds two starting tiles.
 * @returns {void}
 */
function setGame() {
board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
    ]

    // board = [
    //     [2, 2, 2, 2],
    //     [2, 2, 2, 2],
    //     [4, 4, 8, 8],
    //     [4, 4, 8, 8],
    // ]

    // Loop through each row
    for(let r = 0; r < rows; r++ ) {

        // Loop through each column
        for(let c =0; c < columns; c++) {
            
            // Create a new HTML div for each tile
            let tile = document.createElement("div");

            // Give each tile a unique ID based on its row and column
            tile.id = r.toString() + "-" + c.toString();

            // Get the number stored at the current board position
            let num = board[r][c];

            // Update the tile's number and appearance
            updateTile(tile, num);

            // Add the tile to the HTML game board
            document.getElementById("board").append(tile);
        }
    }

    setTwo();
    setTwo();

    // Display the game statistics when the game starts
    updateScorekeeper();

        // Display saved achievements when the game starts
    displayAchievements();
}
/**
 * Checks whether the game board contains an empty tile.
 * @returns {boolean} True if an empty tile exists, otherwise false.
 */
function hasEmptyTile(){
    for(let r = 0; r < rows; r++) {
        for(let c = 0; c < columns; c++) {
            if (board[r][c] == 0) {
                return true;
            }
        }
    }
    return false; // No empty tiles found
}

/**
 * Checks whether the player can make another move.
 * @returns {boolean} True if another move is possible, otherwise false.
 */
function hasMovesAvailable() {

    // Check whether the board has any empty tiles
    if (hasEmptyTile()) {
        return true;
    }

    // Loop through each tile on the board
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {

            // Check whether the tile to the right has the same number
            if (c < columns - 1 && board[r][c] == board[r][c + 1]) {
                return true;
            }

            // Check whether the tile below has the same number
            if (r < rows - 1 && board[r][c] == board[r + 1][c]) {
                return true;
            }
        }
    }

    // No empty tiles or possible merges remain
    return false;
}


/**
 * Checks whether the game has ended and displays a message.
 * @returns {void}
 */
function checkGameOver() {

    // Check whether the player has no moves remaining
    if (!hasMovesAvailable()) {

        // Display the Game Over message
        document.getElementById("game-over").innerText = "Game Over!";
    }
}


/**
 * Generates a new tile containing the number 2
 * at a random empty position on the board.
 * @returns {void}
 */
function setTwo(){
    if(!hasEmptyTile()) {
        return;
    }

    // Keep track of whether an empty tile has been found
    let found = false;

    // Keep searching until an empty tile is found
    while (!found) {
        let r = Math.floor(Math.random() * rows); // Generate a random row between 0 and 3
        let c = Math.floor(Math.random() * columns);  // Generate a random column between 0 and 3

         // Check if the selected tile is empty
        if(board[r][c] ==0) {

            // Add the number 2 to the empty position
            board[r][c] = 2;

            // Find the corresponding HTML tile using its row and column
            let tile = document.getElementById(r.toString() + "-" + c.toString());

            // Display the number 2 on the tile
            tile.innerText = "2";

             // Apply the CSS styling for a tile containing 2
            tile.classList.add("x2");

            // Restart the animation if this tile was previously animated
            tile.classList.remove("tile-new");
            void tile.offsetWidth;

            // Animate the newly generated tile
            tile.classList.add("tile-new");

            // Mark the tile as found to stop the while loop
            found = true;
        }
    }
}

/**
 * Updates an HTML tile's displayed number and CSS styling.
 * @param {HTMLElement} tile - The HTML tile to update.
 * @param {number} num - The number stored in the tile.
 * @returns {void}
 */
function updateTile(tile, num) {

    // Clear the tile's existing text
    tile.innerText = "";

    tile.classList.value = ""; //Clear the class list

    // Add the default tile class
    tile.classList.add("tile");

     // Only display a number if the tile is not empty
    if(num > 0) {
        tile.innerText = num;
        if(num <= 4096) {
            tile.classList.add("x"+num.toString());
        } else {
            tile.classList.add("x8192");
        }
    }
}

// Listen for keyboard input to move tiles
document.addEventListener("keyup", (e) => {
    if (e.code == "ArrowLeft") {
        slideLeft();
    }
    else if (e.code == "ArrowRight") {
        slideRight();
    }
    else if (e.code == "ArrowUp") {
        slideUp();
    }
    else if (e.code == "ArrowDown") {
        slideDown();
    }
    else {
        return; // Ignore keys that aren't arrow keys
    }

    
    // Generate a new tile after moving
    setTwo();

    // Update the score, best score and game progress
    updateScorekeeper();

        // Check whether achievements have been unlocked
    checkAchievements();

    // Check if the game has ended
    checkGameOver();
        
});


/**
 * Updates the game statistics and progress bar.
 * @returns {void}
 */
function updateScorekeeper() {

    // Update the current score
    document.getElementById("score").innerText = score;

    // Save the best score if the current score is higher
    if (score > bestScore) {
        bestScore = score;
        localStorage.setItem("bestScore", bestScore);
    }

    // Display the best score and number of moves
    document.getElementById("best-score").innerText = bestScore;
    document.getElementById("moves").innerText = moves;

    // Find the highest numbered tile on the board
    let highestTile = Math.max(...board.flat());

    // Calculate progress based on tile levels
    let progress = Math.min(100, (Math.log2(highestTile) / 11) * 100);

    // Update the highest tile display
    document.getElementById("highest-tile").innerText = highestTile;

    // Update the progress bar
    document.getElementById("progress-bar").style.width = progress + "%";

    // Display the percentage
    document.getElementById("progress-text").innerText = progress.toFixed(1) + "%";
}


/**
 * Removes all zero values from a row.
 * @param {number[]} row - The row containing tile values.
 * @returns {number[]} A new array without zero values.
 */
function filterZero(row) {
    return row.filter(num => num !=0); //create a new array without zero
}

/**
 * Slides tiles towards the start of an array,
 * merges matching numbers and updates the score.
 * @param {number[]} row - The row or column to slide.
 * @returns {number[]} The updated array after sliding.
 */
function slide(row) {
    row = filterZero(row); //Get rid of zeroes

    //slide
    for(let i =0; i< row.length; i++) {
        //check every 2
        if(row[i] == row[i+1]) {
            row[i] *= 2;
            row[i+1] = 0;
            score += row[i]
        }
    }

    row = filterZero(row);

    //Add zeroes
    while(row.length < columns) {
        row.push(0);
    }

    // Update the score displayed on the webpage
    document.getElementById("score").innerText = score;

    return row;
}

/**
 * Moves all tiles to the left and merges matching values.
 * Updates the board array and HTML tiles.
 * @returns {void}
 */
function slideLeft() {
    for(let r = 0; r < rows; r++) {
        let row = board[r];
        row = slide(row);
        board[r] = row;

        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile,num);
        }
    }
}

/**
 * Moves all tiles to the right and merges matching values.
 * Reverses each row before and after sliding.
 * @returns {void}
 */
function slideRight() {
    for(let r = 0; r < rows; r++) {
        let row = board[r];
        row.reverse();
        row = slide(row);
        row.reverse();
        board[r] = row;

        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile,num);
        }
    }
}

/**
 * Moves all tiles upwards and merges matching values.
 * Processes each column from top to bottom.
 * @returns {void}
 */
function slideUp() {
    // Loop through each column
    for (let c = 0; c < columns; c++) {

        // Get the values from the current column
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];

        // Slide and merge tiles upwards
        row = slide(row);

        // Update the board with the new values
        for (let r = 0; r < rows; r++) {
            board[r][c] = row[r];

            // Find the tile on the webpage
            let tile = document.getElementById(r.toString() + "-" + c.toString());

            // Get the updated number
            let num = board[r][c];

            // Update the tile's appearance
            updateTile(tile, num);
        }
    }
}

/**
 * Moves all tiles downwards and merges matching values.
 * Reverses each column before and after sliding.
 * @returns {void}
 */
function slideDown() {

    // Loop through each column
    for (let c = 0; c < columns; c++) {

        // Get the values from the current column
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];

        // Reverse the column so tiles can slide down
        row.reverse();

        // Slide and merge the tiles
        row = slide(row); 

        // Reverse the column back to its original direction
        row.reverse(); 
        // board[0][c] = row[0];
        // board[1][c] = row[1];
        // board[2][c] = row[2];
        // board[3][c] = row[3];

        // Update the board with the new values
        for (let r = 0; r < rows; r++) {
            board[r][c] = row[r];

            // Find the corresponding HTML tile
            let tile = document.getElementById(r.toString() + "-" + c.toString());

            // Get the updated number
            let num = board[r][c];

            // Update the tile's appearance
            updateTile(tile,num);
        }
    }
}

/**
 * Restarts the 2048 game.
 * Resets the score and creates a new board.
 * @returns {void}
 */
function restartGame() {

    // Reset the score and number of moves
    score = 0;
    moves = 0;

    // Update the displayed score
    document.getElementById("score").innerText = score;

    // Remove the Game Over message
    document.getElementById("game-over").innerText = "";

    // Clear the existing tiles
    document.getElementById("board").innerHTML = "";

    // Initialise a new game
    setGame();
}


/**
 * Unlocks an achievement and saves it to localStorage.
 * @param {string} id - The achievement ID.
 * @returns {void}
 */
function unlockAchievement(id) {

    // Check if the achievement is already unlocked
    if (achievements.includes(id)) {
        return;
    }

    // Add the achievement to the unlocked list
    achievements.push(id);

    // Save achievements so they remain after refreshing
    localStorage.setItem("achievements", JSON.stringify(achievements));

    // Update the achievements display
    displayAchievements();
}

/**
 * Checks whether the player has earned any achievements.
 * @returns {void}
 */
function checkAchievements() {

    // Find the highest numbered tile on the board
    let highestTile = Math.max(...board.flat());

    // Unlock First Merge when the player scores points
    if (score > 0) {
        unlockAchievement("first");
    }

    // Unlock Getting Started when reaching tile 128
    if (highestTile >= 128) {
        unlockAchievement("128");
    }

    // Unlock Halfway There when reaching tile 1024
    if (highestTile >= 1024) {
        unlockAchievement("1024");
    }

    // Unlock 2048 Champion when reaching tile 2048
    if (highestTile >= 2048) {
        unlockAchievement("2048");
    }
}

/**
 * Updates the appearance of unlocked achievements.
 * @returns {void}
 */
function displayAchievements() {

    // Store all achievement IDs in an array
    let ids = ["first", "128", "1024", "2048"];

    // Loop through each achievement
    ids.forEach(id => {

        // Find the achievement card in the HTML
        let element = document.getElementById("achievement-" + id);

        // Check whether the achievement is unlocked
        if (achievements.includes(id)) {

            // Apply the unlocked CSS styling
            element.classList.add("unlocked");

            // Change the status text
            element.querySelector("span").innerText = "Unlocked";
        }
    });

    // Update the total number of unlocked achievements
    document.getElementById("achievement-count").innerText =
        achievements.length + " / 4 unlocked";
}
