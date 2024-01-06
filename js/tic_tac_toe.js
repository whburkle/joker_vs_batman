/* Joker vs Batman: Tic-Tac-Toe */

/* ---------------------------------------- GLOBALS */
// --- Arrays, booleans, vars, and objects
let gameboard = [
  ['','',''],
  ['','',''],
  ['','','']
];

let game_pieces = [
	['', ''],
	['', '']
];

let NUM_ROWS = null;
let NUM_COLS = null;

let winner = null; // N equals "no winner"

let timer_status = false; // boolean: Status of the timer state
let timer_obj = null; // set/clear Interval
let auto_click_obj = null; // set/clear Interval
let seconds_count = 0;
let cached_seconds_count = null;
let cached_time = null;

let row = null;
let col = null;
let row_override = null;
let col_override = null;

let computer_mode = true; // boolean: Player VS Computer
let challenge_mode = true; // boolean: Challenge Mode
let jokers_turn = true; // boolean: Player turn

// --- Containers, buttons, and images
let gui = undefined;
let game_settings = undefined;
let grid_items = undefined;
let menu_btn = undefined;
let footer = undefined;
let jokers_turn_icon = undefined;
let batmans_turn_icon = undefined;

let modal = undefined;
let modal_content = undefined;

let startup_options_container = undefined;
let play_mode_container = undefined;
let opt_pvp_btn = undefined;
let opt_pvc_btn = undefined;
let challenge_mode_container = undefined;
let opt_challenge_true_btn = undefined;
let opt_challenge_false_btn = undefined;
let play_now_btn = undefined;

let pause_game_container = undefined;
let pause_btn = undefined;
let restart_btn = undefined;

let game_over_container = undefined;
let winner_title_container = undefined;
let game_results_container = undefined;
let play_again_btn = undefined;
let joker_pic = undefined;
let joker_swirl = undefined;
let batman_pic = undefined;
let batman_swirl = undefined;
let catwoman_pic = undefined;
let catwoman_swirl = undefined;

let timer_container = undefined;



/* ---------------------------------------- Game timer functionality */
// --- Set the timer status to true and the rate of update to the timer object
function start_timer() {
	timer_status = true;
	timer_obj = setInterval(update_timer, 1000); // execute update_timer every 1000ms (1 second)
}

// --- Pause/resume game play, stops AND resets the timer as well as other ui elements, and saves the time of pause for reference
function pause_timer() {
	if (timer_status) {
		timer_status = false;
		clearInterval(timer_obj); // stop and clear the timer object
		cached_seconds_count = seconds_count;
		cached_time = timer_container.innerHTML;
		timer_container.innerHTML = `PAUSED: ${cached_time}`; // Set game timer to cached time while paused
		
		modal.style.backgroundColor = "rgba(0, 0, 0, 0.75)";
		modal.style.display = "flex";
		modal_content.style.display = "flex";
		pause_game_container.style.display = "flex";
		pause_btn.innerHTML = "Play";
 	}
	else { // Resume...
		timer_status = true;
		timer_container.innerHTML = "Resuming...";

		modal.style.backgroundColor = "rgba(0, 0, 0, 0.0)";
		modal.style.display = "none";
		modal_content.style.display = "none";
		pause_game_container.style.display = "none";
		pause_btn.innerHTML = "Pause";

		start_timer();
	}

	if (winner !== "N") {
		pause_game_container.style.display = "none";
		timer_container.style.letterSpacing = "2px";
		timer_container.style.lineHeight = "16px";
		timer_container.style.marginTop = "10px";
		timer_container.innerHTML = `GAME OVER!<br><span style="font-size: 8px">(Total Time: ${cached_time})</span>`;
	}
}

// --- Set, format, and update timer
function update_timer() { 

	if (cached_seconds_count) {
		seconds_count = cached_seconds_count;
		cached_seconds_count = null;
		cached_time = null;
	}

	seconds_count++;

	let hours = Math.floor(seconds_count / 60);

	let minutes = seconds_count % 60;
	let minutes_num = minutes.toString();
	
	if (minutes_num.trim().length < 2) {
		minutes = `0${minutes}`;
	}

	let hours_num = hours.toString();

	if (hours_num.trim().length < 2) {
  	hours = `0${hours}`; 
 	}

	timer_container.innerHTML = `${hours}:${minutes}`;
}



/* ---------------------------------------- Restart / Play again */
function restart_game() {
	// --- Arrays, booleans, vars, and objects
	clearInterval(timer_obj); // stop and clear the timer object

	gameboard = [
	  ['_','_','_'],
	  ['_','_','_'],
	  ['_','_','_']
	];

	winner = "N"; // N equals "no winner";

	timer_status = false;
	seconds_count = 0;
	cached_seconds_count = null;
	cached_time = null;
	
	jokers_turn = true;

	// --- Reset containers, buttons, and images
	menu_btn.style.display = "block";

	modal.style.backgroundColor = "rgba(0, 0, 0, 0.0)";
	modal.style.display = "none";
	modal_content.style.backgroundColor = "transparent";
	modal_content.style.display = "none";

	startup_options_container.style.display = "none";
	
	pause_game_container.style.display = "none";
	pause_btn.innerHTML = "Pause";

	game_over_container.style.display = "none";
	winner_title_container.innerHTML = "";
	joker_pic.style.display = "none";
	joker_swirl.style.display = "none";
	batman_pic.style.display = "none";
	batman_swirl.style.display = "none";
	catwoman_pic.style.display = "none";
	catwoman_swirl.style.display = "none";

	timer_container.innerHTML = "4,3,2,1 GO!";
	timer_container.style.marginTop = "-2px";
	timer_container.style.letterSpacing = "6px";
	timer_container.style.lineHeight = "16px";

	for(let grid_item of grid_items) {
		grid_item.querySelector("img").src = "img/placeholder.png";
		grid_item.querySelector("img").style.display = "none";
	}

	game_on();
}



/* ---------------------------------------- Test to see who won! */
function check_for_winner() {
	// --- Check rows for a winner, if they're equal and NOT empty then someone has won
	for(let i = 0; i < NUM_ROWS; i++) {
		if(gameboard[i][0] !== "_" && gameboard[i][0] === gameboard[i][1] && gameboard[i][1] === gameboard[i][2]) {
			winner = gameboard[i][0];
			break; // get out of the loop. We don't need anymore info, since someone has won
		}
	}

	// --- Check columns for a winner, if they're equal and NOT empty then someone has won
	for(let i = 0; i < NUM_COLS; i++) {
		if(gameboard[0][i] !== "_" && gameboard[0][i] === gameboard[1][i] && gameboard[1][i] === gameboard[2][i]) {
			winner = gameboard[0][i];
			break; // get out of the loop. We don't need anymore info, since someone has won
		}
	}

	// --- Check diagonals for a winner, if they're equal and NOT empty then someone has won
	if(gameboard[0][0] !== "_" && gameboard[0][0] === gameboard[1][1] && gameboard[1][1] === gameboard[2][2]) { 
		winner = gameboard[0][0];
	}

	if (gameboard[0][2] !== "_" && gameboard[0][2] === gameboard[1][1] && gameboard[1][1] === gameboard[2][0]) {
		winner = gameboard[0][2];
	}

	// --- Check for cat's game (tie) - it's when there's no winner, but the board is full
	if (gameboard[0].indexOf("_") == -1 && gameboard[1].indexOf("_") == -1 && gameboard[2].indexOf("_") == -1 && winner === "N") {
		winner = "C";
	}

	// --- If Joker wins display Joker's victory image
	if (winner === "J") {
		modal_content.style.backgroundColor = "rgba(0, 146, 69, 1.0)";

		game_over_container.getElementsByTagName("h4")[0].classList.add("joker");
		game_over_container.getElementsByTagName("h4")[1].classList.add("joker");
		game_over_container.getElementsByTagName("h4")[0].classList.remove("batman");
		game_over_container.getElementsByTagName("h4")[1].classList.remove("batman");
		game_over_container.getElementsByTagName("h4")[0].classList.remove("catwoman");
		game_over_container.getElementsByTagName("h4")[1].classList.remove("catwoman");

		winner_title_container.innerHTML = "Joker";
		winner_title_container.classList.add("joker");
		winner_title_container.classList.remove("batman");
		winner_title_container.classList.remove("catwoman");

		joker_pic.style.display = "inline";
		joker_pic.style.animation = "entrance 1s forwards ease-in-out";
		joker_swirl.style.display = "inline";
		joker_swirl.style.animation = "swirl 2s forwards ease-in-out";
		
		play_again_btn.classList.add("joker");
		play_again_btn.classList.remove("batman");
		play_again_btn.classList.remove("catwoman");

		game_results_container.classList.add("joker");
		game_results_container.classList.remove("batman");
		game_results_container.classList.remove("catwoman");
	}
	// --- If Batman wins display Batman's victory image
	else if (winner === "B"){
		modal_content.style.backgroundColor = "rgba(0, 0, 0, 1.0)";

		game_over_container.getElementsByTagName("h4")[0].classList.add("batman");
		game_over_container.getElementsByTagName("h4")[1].classList.add("batman");
		game_over_container.getElementsByTagName("h4")[0].classList.remove("joker");
		game_over_container.getElementsByTagName("h4")[1].classList.remove("joker");
		game_over_container.getElementsByTagName("h4")[0].classList.remove("catwoman");
		game_over_container.getElementsByTagName("h4")[1].classList.remove("catwoman");

		winner_title_container.innerHTML = "Batman";
		winner_title_container.classList.add("batman");
		winner_title_container.classList.remove("joker");
		winner_title_container.classList.remove("catwoman");

		batman_pic.style.display = "inline";
		batman_pic.style.animation = "entrance 1s forwards ease-in-out";
		batman_swirl.style.display = "inline";
		batman_swirl.style.animation = "swirl 2s forwards ease-in-out";
		
		play_again_btn.classList.add("batman");
		play_again_btn.classList.remove("joker");
		play_again_btn.classList.remove("catwoman");

		game_results_container.classList.add("batman");
		game_results_container.classList.remove("joker");
		game_results_container.classList.remove("catwoman");
	}
	// --- If Catwoman wins display Catwoman's victory image
	else if (winner === "C"){
		modal_content.style.backgroundColor = "rgba(180, 158, 76, 1.0)";

		game_over_container.getElementsByTagName("h4")[0].classList.add("catwoman");
		game_over_container.getElementsByTagName("h4")[1].classList.add("catwoman");
		game_over_container.getElementsByTagName("h4")[0].classList.remove("joker");
		game_over_container.getElementsByTagName("h4")[1].classList.remove("joker");
		game_over_container.getElementsByTagName("h4")[0].classList.remove("batman");
		game_over_container.getElementsByTagName("h4")[1].classList.remove("batman");

		winner_title_container.innerHTML = "Catwoman";
		winner_title_container.classList.add("catwoman");
		winner_title_container.classList.remove("joker");
		winner_title_container.classList.remove("batman");

		catwoman_pic.style.display = "inline";
		catwoman_pic.style.animation = "entrance 1s forwards ease-in-out";
		catwoman_swirl.style.display = "inline";
		catwoman_swirl.style.animation = "swirl 2s forwards ease-in-out";

		play_again_btn.classList.add("catwoman");
		play_again_btn.classList.remove("joker");
		play_again_btn.classList.remove("batman");

		game_results_container.classList.add("catwoman");
		game_results_container.classList.remove("joker");
		game_results_container.classList.remove("batman");
	}

	// --- If there's a winner, make any additional ui adjustments, display results, etc
	if (winner_title_container.innerHTML !== "" && winner !== "N") {
		menu_btn.style.display = "none";

		jokers_turn_icon.classList.remove("active");
		batmans_turn_icon.classList.remove("active");
		
		modal.style.display = "flex";
		modal.style.backgroundColor = "rgba(0, 0, 0, 0.75)";
		modal_content.style.display = "flex";
		
		game_over_container.style.display = "flex";
		
		game_results_container.innerHTML = `${gameboard[0]}<br>${gameboard[1]}<br>${gameboard[2]}`;

		timer_container.style.marginTop = "51px";
		
		pause_timer();
  }
  // --- If there's no winner or tie yet, move forward with game progress
	else {
		jokers_turn = !jokers_turn; // flip turn

		if (computer_mode && jokers_turn) {
			auto_click_obj = setInterval(computer_click, 500);
		}
	}
}



/* ---------------------------------------- Populate the respective cell with the correct player piece */
function set_image(row, col, player_piece) {
	let id_string = `cell_${row}_${col}`;
	let curr_image = document.querySelector(`#${id_string} img`);

	if (player_piece === "J") {
		curr_image.src = game_pieces[0][1];
		jokers_turn_icon.classList.remove("active");
		batmans_turn_icon.classList.add("active");
	}
	else {
		curr_image.src = game_pieces[1][1];
		jokers_turn_icon.classList.add("active");
		batmans_turn_icon.classList.remove("active");
	}

	curr_image.style.display = "block";

	check_for_winner();
}



/* ---------------------------------------- Computer attempts to win and block its opponent */
function calculate_next_move(game_piece) {
	let next_move = false; // boolean: Computer attempts to block opponent

	// --- Computer checks rows to locate a winning/blocking move to prevent opponent from winning
	for(let i = 0; i < NUM_ROWS; i++) {
		
	  if(gameboard[i][0] === game_piece || gameboard[i][1] === game_piece || gameboard[i][2] === game_piece ) {
			if(gameboard[i][0] === "_" && gameboard[i][1] === game_piece && gameboard[i][2] === game_piece) {
	    	next_move = true;
	    	row_override = i;
	    	col_override = 0;
	    	break;
	    }
	    
	    if(gameboard[i][1] === "_" && gameboard[i][0] === game_piece && gameboard[i][2] === game_piece) {
	    	next_move = true;
	    	row_override = i;
	    	col_override = 1;
	    	break;
	    }
	    
	    if(gameboard[i][2] === "_" && gameboard[i][0] === game_piece && gameboard[i][1] === game_piece) {
	    	next_move = true;
	    	row_override = i;
	    	col_override = 2;
	    	break;
	    }
	  }	
	}

	// --- Computer checks colums to locate a winning/blocking move to prevent opponent from winning
	if (!next_move) {
		for(let i = 0; i < NUM_COLS; i++) {
			
			if(gameboard[0][i] === game_piece || gameboard[1][i] === game_piece || gameboard[2][i] === game_piece ) {
				if(gameboard[0][i] === "_" && gameboard[1][i] === game_piece && gameboard[2][i] === game_piece) {
		    	next_move = true;
		    	row_override = 0;
		    	col_override = i;
		    	break;
		    }
		    
		    if(gameboard[1][i] === "_" && gameboard[0][i] === game_piece && gameboard[2][i] === game_piece) {
		    	next_move = true;
		    	row_override = 1;
		    	col_override = i;
		    	break;
		    }
		    
		    if(gameboard[2][i] === "_" && gameboard[0][i] === game_piece && gameboard[1][i] === game_piece) {
		    	next_move = true;
		    	row_override = 2;
		    	col_override = i;
		    	break;
		    }
		  }	
		}
	}


	// --- Computer checks diagonals to locate a winning/blocking move to prevent opponent from winning
	if (!next_move) {
		if(gameboard[0][0] === game_piece || gameboard[1][1] === game_piece || gameboard[2][2] === game_piece ) {

			if(gameboard[0][0] === "_" && gameboard[1][1] === game_piece && gameboard[2][2] === game_piece) {
				next_move = true;
	    	row_override = 0;
	    	col_override = 0;
	    }
	    
	    if(gameboard[1][1] === "_" && gameboard[0][0] === game_piece && gameboard[2][2] === game_piece) {
	    	next_move = true;
	    	row_override = 1;
	    	col_override = 1;
	    }
	    
	    if(gameboard[2][2] === "_" && gameboard[0][0] === game_piece && gameboard[1][1] === game_piece) {
	    	next_move = true;
	    	row_override = 2;
	    	col_override = 2;
	    }
		}
	}


	if (!next_move) {
		// --- Computer checks diagonals to locate a winning/blocking move to prevent opponent from winning
		if(gameboard[0][2] === game_piece || gameboard[1][1] === game_piece || gameboard[2][0] === game_piece ) {

			if(gameboard[0][2] === "_" && gameboard[1][1] === game_piece && gameboard[2][0] === game_piece) {
			next_move = true;
	    	row_override = 0;
	    	col_override = 2;
	    }
	    
	    if(gameboard[1][1] === "_" && gameboard[0][2] === game_piece && gameboard[2][0] === game_piece) {
	    	next_move = true;
	    	row_override = 1;
	    	col_override = 1;
	    }
	    
	    if(gameboard[2][0] === "_" && gameboard[0][2] === game_piece && gameboard[1][1] === game_piece) {
	    	next_move = true;
	    	row_override = 2;
	    	col_override = 0;
	    }
		}
	}

	if (next_move) {
		gameboard[row_override][col_override] = "J";
		set_image(row_override, col_override, "J");
	}
	else {
		if (game_piece === "J" && challenge_mode) {
			locate_blocking_move();
		}
		else {
			gameboard[row][col] = "J";
			set_image(row, col, "J");
		}
	}
}



/* ---------------------------------------- Computer attempts to make a winning move */
function locate_winning_move() {
	calculate_next_move("J");
}



/* ---------------------------------------- Computer attempts to block its opponent */
function locate_blocking_move() {
	calculate_next_move("B");
}



/* ---------------------------------------- Check for empty cells and select one at random to potentially use as a computer move */
function locate_empty_cells() {
	for (let i = 0; i < gameboard.length; i++) {
		const rows = Array.from(Array(gameboard.length).keys());
		const empty_cells = rows.filter((index) => gameboard[i][index] === "_");
		
		if (empty_cells && empty_cells.length >= 1) {
			col = empty_cells[Math.floor(Math.random() * empty_cells.length)];

			do {
			  row = Math.floor(Math.random() * gameboard.length);

			  if (gameboard[row][col] === "_") {
			  	//if (challenge_mode === true) {
			  		locate_winning_move();
			  	//}
			  	/*else {
						gameboard[row][col] = "J";
						set_image(row, col, "J");
					}*/
		
			    break;
			  }
			}
			while (gameboard[row][col] !== "_");

			break;
		}
	}
}



/* ---------------------------------------- On computer click, parse the current cell id to populate the respective gameboard array element with the correct players key */
function computer_click() {

	if (auto_click_obj) {
		clearInterval(auto_click_obj);  // stop and clear the auto click object
	}

	locate_empty_cells();
}



/* ---------------------------------------- On cell click, parse the current cells id to populate the respective gameboard array element with the correct players key */
function cell_click(obj) {
	if (obj.target.id) {
  	let grid_item_string = obj.target.id;
	  let grid_item_array = grid_item_string.split("_");
	  row = parseInt(grid_item_array[1]);
	  col = parseInt(grid_item_array[2]);

		if (gameboard[row][col] === "_") {
		  if (jokers_turn) { // Joker's turn
		    gameboard[row][col] = "J";
				set_image(row, col, "J");
		  }
		  else { // Batman's turn
		    gameboard[row][col] = "B";
				set_image(row, col, "B");
		  }
		}
	}
}



/* ---------------------------------------- Check play mode and begin game! */
function game_on() {
	let game_piece = null;

	for (game_piece of game_pieces) {
		game_piece = game_pieces[Math.floor(Math.random() * game_pieces.length)][0];
	}

	if (game_piece === "o") {
		jokers_turn = true;
		jokers_turn_icon.classList.add("active");
		batmans_turn_icon.classList.remove("active");
		
		if (computer_mode) {
			computer_click();
		}
	}
	else if (game_piece === "x") {
		jokers_turn = false;
		jokers_turn_icon.classList.remove("active");
		batmans_turn_icon.classList.add("active");
	}

	start_timer();
}



/* ---------------------------------------- After user selects play and challenge mode, startup and set ui for game play */
function game_startup() {
	let play_mode = null;
	let challenge_level = null;

	gui.style.maxHeight = "820px";

	if (computer_mode) {
		play_mode = "Player VS Computer";

		if (challenge_mode) {
			challenge_level = "Uneasy";
		}
		else {
			challenge_level = "Easy";
		}

		game_settings.innerHTML = `Play Mode: ${play_mode}<br>Challenge Mode: ${challenge_level}<br>[ <a href="javascript: location.reload();">CHANGE</a> ]`;
	}
	else {
		play_mode = "Player VS Player";

		game_settings.innerHTML = `Play Mode: ${play_mode}<br>[ <a href="javascript: location.reload();">CHANGE</a> ]`;
	}

	menu_btn.style.display = "block";
	footer.style.opacity = "1";

	modal.style.display = "none";
	modal_content.style.marginTop = "0px";

	startup_options_container.style.display = "none";

	timer_container.innerHTML = "4,3,2,1 GO!";

	for(let grid_item of grid_items) {
		grid_item.style.backgroundColor = "rgba(0, 0, 0, 0.0)";
	}

	game_on();
}



/* ---------------------------------------- Function to initiate any onload ui animations or states */
function gui_startup() {
	gui.classList.add("active");

	modal.classList.add("active");

	startup_options_container.classList.add("active");
	play_mode_container.classList.add("active");
	/*challenge_mode_container.classList.add("active");*/
}



/* ---------------------------------------- Add any necessary event listeners here */
function add_listeners() {
	opt_pvp_btn.addEventListener("click", function (){ computer_mode = false; challenge_mode = false; challenge_mode_container.classList.remove("active"); });
	opt_pvc_btn.addEventListener("click", function (){ computer_mode = true; challenge_mode_container.classList.add("active"); });
	opt_challenge_true_btn.addEventListener("click", function (){ challenge_mode = true; });
	opt_challenge_false_btn.addEventListener("click", function (){ challenge_mode = false; });
	play_now_btn.addEventListener("click", game_startup);

	pause_game_container.addEventListener("click", pause_timer);
	pause_btn.addEventListener("click", pause_timer);
	restart_btn.addEventListener("click", restart_game);

	play_again_btn.addEventListener("click", restart_game);

	for(let grid_item of grid_items) {
		grid_item.addEventListener("click", cell_click);
	}

	// --- Call function to initiate any onload ui animations or states
	gui_startup();
}



/* ---------------------------------------- The build function to be triggered when the page has finished loading */
function build() {
	// --- Set arrays, booleans, vars, and objects if needed
	gameboard = [
	  ["_","_","_"],
	  ["_","_","_"],
	  ["_","_","_"]
	];

	game_pieces = [
		["o", "img/game_piece_o.png"], // Joker
		["x", "img/game_piece_x.png"] // Batman
	];

	NUM_ROWS = 3;
	NUM_COLS = 3;

	winner = "N"; // N equals "no winner"

	// --- Assign containers, buttons, and images
	gui = document.querySelector("#gui");
	game_settings = document.querySelector("#game_settings");
	grid_items = document.querySelector("main").querySelectorAll("div");
	menu_btn = document.querySelector("#menu_btn");
	footer = document.querySelector("footer");
	jokers_turn_icon = document.querySelector("footer > div:nth-child(1)");
	batmans_turn_icon = document.querySelector("footer > div:nth-child(3)");

	modal = document.querySelector("#modal");
	modal_content = document.querySelector("#modal_content");

	startup_options_container = document.querySelector("#startup_options_container");
	play_mode_container = document.querySelector("#play_mode_container");
	opt_pvp_btn = document.querySelector("#opt_pvp_btn");
	opt_pvc_btn = document.querySelector("#opt_pvc_btn");
	challenge_mode_container = document.querySelector("#challenge_mode_container");
	opt_challenge_true_btn = document.querySelector("#opt_challenge_true_btn");
	opt_challenge_false_btn = document.querySelector("#opt_challenge_false_btn");
	play_now_btn = document.querySelector("#play_now_btn");

	pause_game_container = document.querySelector("#pause_game_container");
	pause_btn = document.querySelector("#pause_btn");
	restart_btn = document.querySelector("#restart_btn");

	game_over_container = document.querySelector("#game_over_container");
	winner_title_container = document.querySelector("#winner_title_container");
	game_results_container = document.querySelector("#game_results_container");
	play_again_btn = document.querySelector("#play_again_btn");
	joker_pic = document.querySelector("#joker_pic");
	joker_swirl = document.querySelector("#joker_swirl");
	batman_pic = document.querySelector("#batman_pic");
	batman_swirl = document.querySelector("#batman_swirl");
	catwoman_pic = document.querySelector("#catwoman_pic");
	catwoman_swirl = document.querySelector("#catwoman_swirl");

	timer_container = document.querySelector("#timer_container");

	// --- Call function to add event listeners
	add_listeners();
}



/* ---------------------------------------- Call the build function when the page has finished loading */
window.addEventListener("load", build);


