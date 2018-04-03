// STILL TO DO

// give ship hp 
// make it so that random alien ships can shoot back at random intervals

// make the animations sprites / images instead of dots 

// make a modal for when you hit or destroy an alien ship

const canvas = document.getElementById('my-canvas');

const ctx = canvas.getContext('2d');

// some global variables
const speed = 20;
let handle;

// button to start the game
$('#start').on('click', () => {
	// ctx.clearRect(0, 0, canvas.width, canvas.height);
	$('#intro-screen').detach();
	theGame.startGame();
	// const stuffToRemove = $('#canvas-holder').children();
	// stuffToRemove.detach()
	// $('#canvas-holder').append($('<canvas>'))
	// $('canvas').attr('id','my-canvas')
	// $('canvas').attr('width', '800px');
	// $('canvas').attr('height', '800px');

	// $('canvas').addClass('ocean')
	// $('#start').detach();
	// theGame.startGame();
	// spaceship.initialize()
	// spaceship.drawBody()
	// window.setInterval(alienFire, 1000)
})

const getRandomInteger = (min, max) => {
	min = Math.floor(min);
	max = Math.ceil(max);
	return Math.floor(Math.random() * (max - min) + min)
}

// the game object

const theGame = {
	numOfAliens: 0,
	startGame() {
		$('canvas').attr('width', '800px');
		$('canvas').attr('height', '800px');
	
		$('canvas').addClass('ocean')
		$('#start').detach();
		
		spaceship.initialize()
		spaceship.drawBody()
		let alienShots;
		window.clearInterval(alienShots);
		alienShots = window.setInterval(alienFire, 1000)

		this.numOfAliens = getRandomInteger(5, 11)
		alienShipFactory.alienShips = [];

		const alienShipX = ((canvas.width - 100) / this.numOfAliens)
		let alienShipXPos = alienShipX;

		for (let i = 1; i <= this.numOfAliens; i++) {
			alienShipFactory.generateAlienShips(alienShipXPos, i);

			alienShipXPos += alienShipX
			// alienShipFactory.alienShips[i].shipId = (i + 1)
			console.log(alienShipFactory.alienShips);
		}

		$('#level').text("LEVEL ONE")
		$('#player-stats').text("Hull Points: " + spaceship.hull)
		$('#ships-destroyed').text("Ships Destroyed: " + this.shipsDestroyed)
		$('#ships-remaining').text("Ships Remaining: " + alienShipFactory.alienShips.length)
		gamePlayAnimation();
	},
	shipsDestroyed: 0,
	endGame() {
		console.log("end game is being called successfully")
		ctx.clearRect(0,0, canvas.width, canvas.height);
		$('canvas').attr('width', '0');
		$('canvas').attr('height', '0');
		$('canvas').removeClass("ocean")
		
		const endScreen = $('<div>').attr("id", "end-screen")
		const endSpan = $('<span>').text("GAME OVER")
		endSpan.attr("id", "end-text")
		endSpan.appendTo(endScreen)
		const playAgain = $('<div>').text("PLAY AGAIN").addClass("buttons")
		playAgain.on('click', () =>{
			endScreen.detach();
			this.startGame()
		})
		playAgain.appendTo(endScreen)
		endScreen.appendTo($("#canvas-holder"));
	}
}

// make a ship
const spaceship = {
	body: {},
	direction: "right",
	firepower: 2,
	hull: 1,
	alive: true,
	initialize () {
		this.body = {
			x: 400,
			y: 700, 
			r: 12.50,
			e: 0
		}
		this.hull = 1
		this.alive = true
	},

	move (direction) {
		switch(spaceship.direction) {
			case 'right':
				if (this.body.x + speed < canvas.width) {
					this.body.x = this.body.x + speed;
					console.log("right case")
				}
				break;
			case 'left': 
				if (this.body.x - speed > 0) {
					this.body.x = this.body.x - speed;
					console.log("Left case")
				} 
				break;
		}

		// this.drawBody()
		console.log("drew body")

	},
	drawBody() {
		ctx.beginPath();
		ctx.arc(this.body.x, this.body.y, this.body.r, this.body.e, Math.PI * 2);
		ctx.fillStyle = "f00";
		ctx.fill();
		ctx.closePath();
	}
}


// make alien ships
class AlienShip {
	constructor(id, x) {
		this.body = {
			id: id,
			x: x,
			y: 100,
			r: 12.5,
			e: 0	
		}
		this.hull = 10
	}
	drawBody() {
		ctx.beginPath();
		ctx.arc(this.body.x, this.body.y, this.body.r, this.body.e, Math.PI * 2);
		ctx.fillStyle = "green";
		ctx.fill();
		ctx.closePath();
	}
}

const alienShipFactory = {
	alienShips: [],
	generateAlienShips(xPos) {
		const newAlienShip = new AlienShip((this.alienShips.length + 1), xPos);
		this.alienShips.push(newAlienShip);
		newAlienShip.drawBody();
		return newAlienShip;
	},
	animateAliens() {
		for (let i = 0; i < this.alienShips.length; i++) {
			this.alienShips[i].drawBody();
		}
	}
}


// when the user presses the spacebar, a shot is fired up
// this should occur in the animate canvas function (which may need to take an argument of keypress)

class Shot {
	constructor(x, y, dy) {
		this.x = x;
		this.y = y;
		this.r = 8;
		this.e = 0;
		this.dx = 0;
		this.dy = dy;

		this.draw = function() {
			ctx.beginPath();
			ctx.arc(this.x, this.y, this.r, this.e, Math.PI * 2);
			ctx.fillStyle = "red";
			ctx.fill();
			ctx.closePath();
		}

		this.update = function() {
			if(this.y + this.dy > 0) {
				this.y += this.dy;
				this.draw();
				this.checkForAlienCollision();
			} else if (this.y <= 0) {
				shotsFired.shift()
			} else if (this.didYouHitAlien === false) {
				shotsFired.shift()
			}
			
		}
		this.updateAlien = function() {
			if (this.y + this.dy < 800) {
				this.y += this.dy;
				this.draw();
				this.checkForShipCollision();
			} else if (this.y >= 800) {
				alienShotsFired.shift();
			} else if (this.didYouHitShip === false) {
				alienShotsFired.shift();
			}
		}

		this.positions = [];
		this.storeLastPosition = function(xPos, yPos) {
			this.positions.push ({
				x: this.x,
				y: this.y
			});
			if (this.positions.length > 10) { 
				this.positions.shift();
			}
		}
		this.move = function() {
			// console.log("the shot is moving")
	// 		for (let i = spaceship.body.y; i > 20; i -= 1) { 
	// // 		ctx.clearRect(0,0, canvas.width, canvas.height);
				// console.log(this.positions)
	// // 		// draw the motion trail 
				// for (let j = 0; j < this.positions.length; j++) {
				// 	const ratio = (i + 150) / this.positions.length;

				// 	ctx.beginPath();
				// 	ctx.arc(this.positions[j].x, this.positions[j].y, 10, 0, 2*Math.PI, true);
				// 	ctx.fillStyle ='rgba(204, 102, 153, ' + ratio / 2 + ")";
				// 	ctx.fill();
				// }
			this.update();
	// // 		// redraw the shot on the canvas
	// 		this.update()

	// // 		// store where the shot is for motion trail
			// this.storeLastPosition(this.x, this.y);

	// // 		// change the shot's position
	// 		// shot.y -= 1;
	// 		}
		}
		this.didYouHitAlien = false;
		this.checkForAlienCollision = function() {
			if (this.didYouHitAlien === false) {
				for (let i = 0; i < alienShipFactory.alienShips.length; i++) {
				if (alienShipFactory.alienShips.length === 0) {
					console.log("You have destroyed all of the alien ships. Click continue to move on to the next level.");
				}
				if (getDistance(this.x, this.y, alienShipFactory.alienShips[i].body.x, alienShipFactory.alienShips[i].body.y) < alienShipFactory.alienShips[i].body.r + this.r) {
					console.log(this.x, this.y, alienShipFactory.alienShips[i].body.x, alienShipFactory.alienShips[i].body.y)
					console.log("You hit the alien ship.");
					shotsFired.shift()
					this.didYouHitAlien = true;
					this.checkForAlienDestruction(i)

					// return true;
				}
			} 
			} else {
				return;
			}
			
			
			
		}
		this.checkForAlienDestruction = function(k) {
			if (typeof(k) != "number") {
				console.log("nothing happened because you didn't hit the ship.");
			} else if (this.y < 0) {
				return;
			} else {
				// console.log(alienShipFactory.alienShips[k]);
				alienShipFactory.alienShips[k].hull -= spaceship.firepower;
				if (alienShipFactory.alienShips[k].hull > 0) {
					return;
				} else if (alienShipFactory.alienShips[k].hull <= 0) {
					theGame.shipsDestroyed += 1;
	// 				// remove that alien ship from the array
					alienShipFactory.alienShips.splice(k,1);
					$('#ships-remaining').text("Ships Remaining: " + alienShipFactory.alienShips.length)
	// 				// add it to ships destroyed array to track how many have been destroyed
					$('#ships-destroyed').text("Ships Destroyed: " + theGame.shipsDestroyed)
	// 				// toggleModal2();
					return;
				// } else {
				// 	return;
				}
			}

		}
		this.didYouHitShip = false;
		this.checkForShipCollision = function() {
			if (spaceship.alive === false) {
				return;
			} else if (spaceship.alive === true) {
				if (getDistance(this.x, this.y, spaceship.body.x, spaceship.body.y) < spaceship.body.r + this.r) {
				console.log("Your ship has been hit!")
				alienShotsFired.shift()
				this.didYouHitShip = true;
				spaceship.hull -= 1;
				$('#player-stats').text("Hull points: " + spaceship.hull)
				// this.checkForShipDestruction()
				}
				if (spaceship.hull <= 0) {
					console.log("The aliens have destroyed your ship. Game Over.")
					spaceship.alive = false;
					toggleModal2();
					theGame.endGame();
					
				}
			}
			
		}
	}	
}

const shotsFired = [];
const alienShotsFired = [];

// collision detection utility function
function getDistance(x1, y1, x2, y2) {
	let xDistance = x2 - x1;
	let yDistance = y2 - y1;

	return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
}


function alienFire() {
	const randomAlienShip = alienShipFactory.alienShips[Math.floor(Math.random()*alienShipFactory.alienShips.length)]
	const alienShot = new Shot(randomAlienShip.body.x, randomAlienShip.body.y, 10);
	alienShotsFired.push(alienShot)
	let wereYouHit = false;

	// if (alienShipFactory.alienShips.length === 0) {
	// 	// DO NOTHING
	// 	return;
	// } else {
	// 	for (let i = randomAlienShip.body.y; i < 700; i += 1) { 
	// 		// ctx.clearRect(0,0, canvas.width, canvas.height);
	// 		alienShot.y += 1;
		// draw the motion trail 
		// for (let j = 0; j < alienShot.positions.length; j++) {
		// 	const ratio = (i + 150) / alienShot.positions.length
		// 	ctx.beginPath();
		// 	ctx.arc(alienShot.positions[j].x, alienShot.positions[j].y, 10, 0, 2*Math.PI, true);
		// 	ctx.fillStyle ='rgba(204, 102, 153, ' + ratio / 2 + ")";
		// 	ctx.fill();
		// }
	
		// redraw the shot on the canvas
		// alienShot.draw()
		// store where the shot is for motion trail
		// alienShot.storeLastPosition(alienShot.x, alienShot.y)
		// change the shot's position
		

	}
	// check for collision
	
	// if (wereYouHit === false) {
	// 	if (getDistance(alienShot.x, alienShot.y, spaceship.body.x, spaceship.body.y) < spaceship.body.r + alienShot.r) {
	// 		// cancelAnimationFrame(gamePlayAnimation)
	// 		console.log("The alien lasers hit your ship.");
	// 		spaceship.hull -= 1;
	// 		$('#player-stats').text("Hull points: " + spaceship.hull)
	// 		wereYouHit = true;
	// 	}
	// } else {
	// 	if (spaceship.hull <= 0) {
	// 		console.log("The aliens have destroyed your ship. game over.");
	// 		return;
	// 	}
	// }
	
	// // also draw the spaceship
	// spaceship.drawBody();
	// // also draw the aliens
// 	// alienShipFactory.animateAliens();
// }
// }


function gamePlayAnimation(e) {
	ctx.clearRect(0,0, canvas.width, canvas.height);

	requestAnimationFrame(gamePlayAnimation);

	// base case if something is meant 	

	spaceship.drawBody();
	alienShipFactory.animateAliens();

	for (let i = 0; i < shotsFired.length; i++) {
		shotsFired[i].move()
	}
	for (let j = 0; j < alienShotsFired.length; j++) {
		alienShotsFired[j].updateAlien();
	}
}
	// if (e === 'shot') {
	// 	shot.move()
	// }

	// if (alienShipFactory.alienShips.length < 1) {
	// 	cancelAnimationFrame(gamePlayAnimation)
	// 	return;
	// } else if (alienShipFactory.alienShips.length > 0) {
	// 	window.setInterval(alienFire, 1000)
	// } 
	

	// if (key === 39) {
	// 	// ctx.clearRect(0,0, canvas.width, canvas.height);
	// 	// spaceship.direction = 'right';
	// 	// spaceship.body.x = spaceship.body.x + speed;
	// 	// spaceship.move('right', );
	// 	// spaceship.drawBody();
	// 	// alienShipFactory.animateAliens();
	// } else if (key === 37) {
	// 	ctx.clearRect(0,0, canvas.width, canvas.height);
	// 	spaceship.direction = 'left';
	// 	spaceship.body.x = spaceship.body.x - speed;
	// 	spaceship.move();
	// 	spaceship.drawBody();
	// 	alienShipFactory.animateAliens();
	// } else if (key === 32) {
	// 	requestAnimationFrame(gamePlayAnimation)

	// 	// fire the shot
	// 	const shot = new Shot(spaceship.body.x, spaceship.body.y);
	// 	let didYouHit = false;

	// 	//function to check if the shot hit the alien ship
	// 	const checkForCollision = () => {
	// 		for (k = 0; k < alienShipFactory.alienShips.length; k++) {
						
	// 			if (alienShipFactory.alienShips.length === 0) {
	// 				console.log("You have destroyed all of the alien ships. Click continue to move on to the next level.");
	// 				// spaceship.drawBody();
	// 			}

	// 			if (getDistance(shot.x, shot.y, alienShipFactory.alienShips[k].body.x, alienShipFactory.alienShips[k].body.y) < alienShipFactory.alienShips[k].body.r + shot.r) {
	// 				cancelAnimationFrame(gamePlayAnimation)
	// 				console.log("You hit the alien ship.");
	// 				didYouHit = true;
	// 				checkForDestruction(k);
	// 				// return k;
	// 			}
	// 		}
	// 	}

	// 	// function to check if the shot destroyed the alien ship
	// 	const checkForDestruction = (k) => {
	// 		if (typeof(k) != "number") {
	// 			console.log("nothing happened because you didn't hit the ship.");
	// 		} else {
	// 			// console.log(alienShipFactory.alienShips[k]);
	// 			alienShipFactory.alienShips[k].hull -= spaceship.firepower;
			

	// 			if (alienShipFactory.alienShips[k].hull <= 0) {
	// 				theGame.shipsDestroyed.push(alienShipFactory.alienShips[k])
	// 				// remove that alien ship from the array
	// 				alienShipFactory.alienShips.splice(k,1);
	// 				$('#ships-remaining').text("Alien Ships Remaining: " + alienShipFactory.alienShips.length)
	// 				// add it to ships destroyed array to track how many have been destroyed
	// 				$('#ships-destroyed').text("Alien Ships Destroyed: " + theGame.shipsDestroyed.length)
	// 				// toggleModal2();
	// 				return true;
	// 			} else {
	// 				return;
	// 			}
	// 		}
	// 	}

	// 	// move the shot
	// 	for (let i = spaceship.body.y; i > 100; i -= 1) { 
	// 		ctx.clearRect(0,0, canvas.width, canvas.height);
			
	// 		// draw the motion trail 
	// 		for (let j = 0; j < shot.positions.length; j++) {
	// 			const ratio = (i + 150) / shot.positions.length;

	// 			ctx.beginPath();
	// 			ctx.arc(shot.positions[j].x, shot.positions[j].y, 10, 0, 2*Math.PI, true);
	// 			ctx.fillStyle ='rgba(204, 102, 153, ' + ratio / 2 + ")";
	// 			ctx.fill();
	// 		}
			
	// 		// redraw the shot on the canvas
	// 		shot.draw()

	// 		// store where the shot is for motion trail
	// 		shot.storeLastPosition(shot.x, shot.y);

	// 		// change the shot's position
	// 		shot.y -= 1;

	// 		// collision detection
	// 		if (didYouHit === false) {
	// 			if (checkForCollision() === true) {
	// 			console.log("You destroyed the alien ship.");
	// 			};
	// 		}

	// 		// also draw the spaceship
	// 		spaceship.drawBody();
	// 		// also draw the aliens
	// 		alienShipFactory.animateAliens();
	// 	}	
	// } 
// }

// MODAL STUFF

const modal = $('.modal');
const modal2 = $('.modal2');

const toggleModal = () => {
    modal.toggleClass("show-modal")
    modal.on('click', toggleModal);
}

const toggleModal2 = () => {
	modal2.toggleClass("show-modal");
	modal2.on('click', toggleModal2)
}

$('#instructions').on('click', () => {
	// $('.modal-content').text(""
	toggleModal();
});

// EVENT LISTENERS

$('html').keydown(function(e) {
	let key = e.keyCode;



	if (key === 39) {
		spaceship.direction = 'right'
		spaceship.move('right');
	} else if (key === 37) {
		spaceship.direction = 'left'
		spaceship.move('left');
	} else if (key === 32) {
		const shot = new Shot(spaceship.body.x, spaceship.body.y, -10);
		shotsFired.push(shot)
		shot.didYouHitAlien = false;
		// if (shot.y == 100) {
		// 	shot.checkForAlienCollision();
		// }
		

	}
	
})