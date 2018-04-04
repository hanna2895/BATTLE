// STILL TO DO

// display alien stats



const canvas = document.getElementById('my-canvas');

const ctx = canvas.getContext('2d');

// some global variables
const speed = 20;
let handle;
let alienShots;
let shotsFired = [];
let alienShotsFired = [];
let animate;

// button to start the game
$('#start').on('click', () => {
	// ctx.clearRect(0, 0, canvas.width, canvas.height);
	$('#intro-screen').detach();
	theGame.startGame();
})

const getRandomInteger = (min, max) => {
	min = Math.floor(min);
	max = Math.ceil(max);
	return Math.floor(Math.random() * (max - min) + min)
}

// the game object

const theGame = {
	numOfAliens: 0,
	shipsDestroyed: 0,
	level: 1,
	newAliens (num) {
		this.numOfAliens = num;
		alienShipFactory.alienShips = [];
		alienShotsFired = [];

		const alienShipX = ((canvas.width - 100) / this.numOfAliens)
		let alienShipXPos = alienShipX;

		for (let i = 1; i <= this.numOfAliens; i++) {
			alienShipFactory.generateAlienShips(alienShipXPos, i);

			alienShipXPos += alienShipX
			// alienShipFactory.alienShips[i].shipId = (i + 1)
			$('<div>').attr('id', alienShipFactory.alienShips[i-1].body.id.toString()).text("Ship " + alienShipFactory.alienShips[i-1].body.id + ": " + alienShipFactory.alienShips[i-1].hull).appendTo($('#alien-stats'))
		}
	},
	startGame() {
		cancelAnimationFrame(animate);
		$('canvas').attr('width', '800px');
		$('canvas').attr('height', '800px');
	
		$('canvas').addClass('ocean')
		$('#start').detach();

		this.level = 1;
		
		spaceship.initialize()
		spaceship.drawBody()
		
		window.clearInterval(alienShots);
		alienShots = window.setInterval(alienFire, 1000)

		this.newAliens(4)


		// this.numOfAliens = getRandomInteger(5, 11)
		// alienShipFactory.alienShips = [];

		// const alienShipX = ((canvas.width - 100) / this.numOfAliens)
		// let alienShipXPos = alienShipX;

		// for (let i = 1; i <= this.numOfAliens; i++) {
		// 	alienShipFactory.generateAlienShips(alienShipXPos, i);

		// 	alienShipXPos += alienShipX
		// 	// alienShipFactory.alienShips[i].shipId = (i + 1)
		// 	$('<div>').attr('id', alienShipFactory.alienShips[i-1].body.id.toString()).text("Ship " + alienShipFactory.alienShips[i-1].body.id + ": " + alienShipFactory.alienShips[i-1].hull).appendTo($('#alien-stats'))
		// }

		

		$('#level').text("LEVEL ONE")
		// $('#player-stats').text("Your Ship:")
		$('#player-stats').text("Your Ship")
		const hp = $('<p>').attr('id', 'hull-points').text("Hull Points: " + spaceship.hull);
		$('#player-stats').append(hp)
		
		$('#ships-destroyed').text("Ships Destroyed: " + this.shipsDestroyed)
		$('#ships-remaining').text("Ships Remaining: " + alienShipFactory.alienShips.length)
		gamePlayAnimation();
	},
	nextLevel() {
		ctx.clearRect(0,0, canvas.width, canvas.height);
		cancelAnimationFrame(gamePlayAnimation)
		$('canvas').attr('width', '0');
		$('canvas').attr('height', '0');
		this.level += 1;

		const nextScreen = $('<div>').attr("id", "next-screen")
		const nextSpan = $('<span>').text("STAGE CLEARED")
		nextSpan.attr("id", "next-text")
		nextSpan.appendTo(nextScreen)
		const cont = $('<div>').text("CONTINUE").addClass("buttons")
		cont.on('click', () =>{
			nextScreen.detach();
			this.levelUp()
			// if (this.level === 2) {
			// 	this.levelTwo()
			// } else if (this.level === 3) {
			// 	this.levelThree()
			// }
			
		})
		cont.appendTo(nextScreen)
		nextScreen.appendTo($("#canvas-holder"));
	},
	levelUp() {
		cancelAnimationFrame(animate);
		$('canvas').attr('width', '800');
		$('canvas').attr('height', '800');
		window.clearInterval(alienShots);
		if (this.level === 2) {
			$('canvas').removeClass('ocean');
			$('canvas').addClass('desert');
			alienShots = window.setInterval(alienFire, 800)
			this.newAliens(8)

			$('#level').text("LEVEL TWO")
		} else if (this.level === 3) {
			$('canvas').removeClass('desert');
			$('canvas').addClass('arctic');
			alienShots = window.setInterval(alienFire, 600)
			this.newAliens(10)
			$('#level').text("LEVEL THREE")
		} else if (this.level === 4) {
			$('canvas').removeClass('arctic');
			$('canvas').addClass('city');	
			alienShots = window.setInterval(alienFire, 500)
			this.newAliens(12)
			$('#level').text("LEVEL FOUR")	
		}
		gamePlayAnimation();
	},

	// levelTwo() {
	// 	cancelAnimationFrame(animate);
	// 	$('canvas').attr('width', '800');
	// 	$('canvas').attr('height', '800');
	// 	$('canvas').removeClass('ocean');
	// 	$('canvas').addClass('desert');

	// 	shotsFired = [];

	// 	window.clearInterval(alienShots);
	// 	alienShots = window.setInterval(alienFire, 800)

	// 	this.newAliens(8)

	// 	$('#level').text("LEVEL TWO")

	// 	gamePlayAnimation();
	// 	//stop animation
	// 	// remove ocean class
	// 	// add desert class
	// 	// get aliens
	// 	// get ship
	// 	// display all the stuff (but some of it is the same)/
	// 	// start the animation
	// },
	// levelThree(){
	// 	cancelAnimationFrame(gamePlayAnimation);
	// 	$('canvas').attr('width', '800');
	// 	$('canvas').attr('height', '800');
	// 	$('canvas').removeClass('desert');
	// 	$('canvas').addClass('arctic');

	// 	shotsFired = [];

	// 	window.clearInterval(alienShots);
	// 	alienShots = window.setInterval(alienFire, 600)

	// 	this.newAliens(10)

	// 	$('#level').text("LEVEL THREE")

	// 	gamePlayAnimation();
	// },
	endGame() {
		cancelAnimationFrame(animate);
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
	},
	winGame() {
		cancelAnimationFrame(animate);
		ctx.clearRect(0,0, canvas.width, canvas.height);
		$('canvas').attr('width', '0');
		$('canvas').attr('height', '0');
		$('canvas').removeClass("ocean")
		const endScreen = $('<div>').attr("id", "end-screen")
		const endSpan = $('<span>').text("YOU DEFEATED THE ALIENS")
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
			r: 20
		}
		this.hull = 100
		this.alive = true
	},

	move (direction) {
		switch(spaceship.direction) {
			case 'right':
				if (this.body.x + speed < canvas.width) {
					this.body.x = this.body.x + speed;
				}
				break;
			case 'left': 
				if (this.body.x - speed > 0) {
					this.body.x = this.body.x - speed;
				} 
				break;
		}
	},
	drawBody() {
		const img = new Image();
		img.src = "img/spaceship1.png"
		ctx.beginPath();
		ctx.drawImage(img, (this.body.x-40), this.body.y);
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
			r: 20,	
		}
		this.hull = 10
	}
	drawBody() {
		const img = new Image();
		img.src = "img/spaceship2.png"
		ctx.beginPath();
		ctx.drawImage(img, this.body.x-40, this.body.y-30)
		// ctx.arc(this.body.x, this.body.y, this.body.r, this.body.e, Math.PI * 2);
		// ctx.fillStyle = "green";
		// ctx.fill();
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
		this.r = 5;
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

		// this.positions = [];
		// this.storeLastPosition = function(xPos, yPos) {
		// 	this.positions.push ({
		// 		x: this.x,
		// 		y: this.y
		// 	});
		// 	if (this.positions.length > 10) { 
		// 		this.positions.shift();
		// 	}
		// }
	// 	this.move = function() {
	// 		// console.log("the shot is moving")
	// // 		for (let i = spaceship.body.y; i > 20; i -= 1) { 
	// // // 		ctx.clearRect(0,0, canvas.width, canvas.height);
	// 			// console.log(this.positions)
	// // // 		// draw the motion trail 
	// 			// for (let j = 0; j < this.positions.length; j++) {
	// 			// 	const ratio = (i + 150) / this.positions.length;

	// 			// 	ctx.beginPath();
	// 			// 	ctx.arc(this.positions[j].x, this.positions[j].y, 10, 0, 2*Math.PI, true);
	// 			// 	ctx.fillStyle ='rgba(204, 102, 153, ' + ratio / 2 + ")";
	// 			// 	ctx.fill();
	// 			// }
	// 		this.update();
	// // // 		// redraw the shot on the canvas
	// // 		this.update()

	// // // 		// store where the shot is for motion trail
	// 		// this.storeLastPosition(this.x, this.y);

	// // // 		// change the shot's position
	// // 		// shot.y -= 1;
	// // 		}
	// 	}
		this.didYouHitAlien = false;
		this.checkForAlienCollision = function() {
			if (this.didYouHitAlien === false) {
				for (let i = 0; i < alienShipFactory.alienShips.length; i++) {
				if (alienShipFactory.alienShips.length === 0) {
					console.log("You have destroyed all of the alien ships. Click continue to move on to the next level.");
				}
				if (getDistance(this.x, this.y, alienShipFactory.alienShips[i].body.x, alienShipFactory.alienShips[i].body.y) < alienShipFactory.alienShips[i].body.r + this.r) {
		
					shotsFired.shift()
					this.didYouHitAlien = true;
					this.checkForAlienDestruction(i);
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

				alienShipFactory.alienShips[k].hull -= spaceship.firepower;
				$('#' + alienShipFactory.alienShips[k].body.id.toString()).text("Ship " + alienShipFactory.alienShips[k].body.id + ": " + alienShipFactory.alienShips[k].hull)
				if (alienShipFactory.alienShips[k].hull > 0) {
					return;
				} else if (alienShipFactory.alienShips[k].hull <= 0) {
					theGame.shipsDestroyed += 1;
					$('#' + alienShipFactory.alienShips[k].body.id.toString()).remove()
	// 				// remove that alien ship from the array
					alienShipFactory.alienShips.splice(k,1);
					$('#ships-remaining').text("Ships Remaining: " + alienShipFactory.alienShips.length)
	// 				// add it to ships destroyed array to track how many have been destroyed
					$('#ships-destroyed').text("Ships Destroyed: " + theGame.shipsDestroyed)
	// 				// toggleModal2();
					if (alienShipFactory.alienShips.length <= 0) {
						theGame.nextLevel();
					} else {
						return;
					}
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
				$('#hull-points').text("Hull points: " + spaceship.hull)
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



// collision detection utility function
function getDistance(x1, y1, x2, y2) {
	let xDistance = x2 - x1;
	let yDistance = y2 - y1;

	return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
}



function alienFire() {
	if (alienShipFactory.alienShips.length === 0) {
		clearInterval(alienShots) 
	} else {
		const randomAlienShip = alienShipFactory.alienShips[Math.floor(Math.random()*alienShipFactory.alienShips.length)]
		const alienShot = new Shot(randomAlienShip.body.x, randomAlienShip.body.y, 10);
		alienShotsFired.push(alienShot)
	}
	
}



function gamePlayAnimation(e) {
	ctx.clearRect(0,0, canvas.width, canvas.height);

	animate = requestAnimationFrame(gamePlayAnimation);

	// base case if something is meant 	
	spaceship.drawBody();
	alienShipFactory.animateAliens();

	for (let i = 0; i < shotsFired.length; i++) {
		shotsFired[i].update()
	}
	for (let j = 0; j < alienShotsFired.length; j++) {
		alienShotsFired[j].updateAlien();
	}
}
	

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
		const shot = new Shot(spaceship.body.x, spaceship.body.y + 40, -10);
		shotsFired.push(shot)
		shot.didYouHitAlien = false;
	}
	
})