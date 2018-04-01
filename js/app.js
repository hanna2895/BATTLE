const canvas = document.getElementById('my-canvas');

const ctx = canvas.getContext('2d');

// to center stuff on the canvas
const cx = canvas.width / 2;
const cy = canvas.height / 2;

const speed = 20;
let handle;

// make the Battle text on the home screen
ctx.beginPath();
ctx.font = '48px serif';
ctx.textAlign ='center';
ctx.fillStyle = 'blue';
ctx.fillText('BATTLE', cx, cy - 100);

// button to start the game
$('#start').on('click', () => {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	$('canvas').addClass('ocean')
	$('#start').detach();
	theGame.startGame();
	spaceship.initialize()
	spaceship.drawBody()
})

const getRandomInteger = (min, max) => {
	min = Math.floor(min);
	max = Math.ceil(max);
	return Math.floor(Math.random() * (max - min) + min)
}

// the game object

const theGame = {
	startGame() {
		let numOfAliens = getRandomInteger(5, 11)
		alienShipFactory.alienShips = [];

		const alienShipX = ((canvas.width - 100) / numOfAliens)
		console.log(alienShipX);
		let alienShipXPos = alienShipX;

		for (let i = 1; i <= numOfAliens; i++) {
			alienShipFactory.generateAlienShips(alienShipXPos);
			// alienShips[i].initialize(alienShipXPos);

			alienShipXPos += alienShipX
			console.log("alienShipXPos = " + alienShipXPos);

		}

		$('#level').text("LEVEL ONE")
		$('#ships-remaining').text("Alien Ships Remaining: " + alienShipFactory.alienShips.length)

	}
}

// make a ship class
const spaceship = {
	body: {},
	direction: "right",
	initialize () {
		this.body = {
			x: 400,
			y: 700, 
			r: 12.50,
			e: 0
		}
	},

	move () {
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
		console.log(this.body);
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
		const newAlienShip = new AlienShip(this.alienShips.length, xPos);
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
	constructor(x,y) {
		this.x = x;
		this.y = y;
		this.r = 8;
		this.e = 0;
		this.dx = 0;
		this.dy = -10;

		this.draw = function() {
			ctx.beginPath();
			ctx.arc(this.x, this.y, this.r, this.e, Math.PI * 2);
			ctx.fillStyle = "red";
			ctx.fill();
			ctx.closePath();
		}

		this.update = function() {
			this.y += this.dy;
			console.log(this.y);
			this.draw();
		}
		this.positions = [];
		this.storeLastPosition = function(xPos, yPos) {
			this.positions.push ({
				x: this.x,
				y: this.y
			});
			if (this.positions.length > 100) { // 10 is the length of the motion trail. hardcoding because I won't need it to change
				this.positions.shift();
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




function gamePlayAnimation (e) {
	const key = e.keyCode;


	if (key === 39) {
		ctx.clearRect(0,0, canvas.width, canvas.height);
		spaceship.direction = 'right';
		spaceship.body.x = spaceship.body.x + speed;
		spaceship.move();
		spaceship.drawBody();
		alienShipFactory.animateAliens();
	} else if (key === 37) {
		ctx.clearRect(0,0, canvas.width, canvas.height);
		spaceship.direction = 'left';
		spaceship.body.x = spaceship.body.x - speed;
		spaceship.move();
		spaceship.drawBody();
		alienShipFactory.animateAliens();
	} else if (key === 32) {
		requestAnimationFrame(gamePlayAnimation)
		
		// fire the shot
		const shot = new Shot(spaceship.body.x, spaceship.body.y);

		// move the shot
		for (let i = spaceship.body.y; i > -100; i -= 1) { 
			ctx.clearRect(0,0, canvas.width, canvas.height);
			
			// draw the motion trail 
			for (let j = 0; j < shot.positions.length; j++) {
				const ratio = (i + 150) / shot.positions.length;

				ctx.beginPath();
				ctx.arc(shot.positions[j].x, shot.positions[j].y, 10, 0, 2*Math.PI, true);
				ctx.fillStyle ='rgba(204, 102, 153, ' + ratio / 2 + ")";
				ctx.fill();
			}
			
			// redraw the shot on the canvas
			shot.draw()

			// store where the shot is for motion trail
			shot.storeLastPosition(shot.x, shot.y);

			// change the shot's position
			shot.y -= 1;

			// collision detection
			for (let k = 0; k < alienShipFactory.alienShips.length; k++) {
				
			 	if (getDistance(shot.x, shot.y, alienShipFactory.alienShips[k].body.x, alienShipFactory.alienShips[k].body.y) < alienShipFactory.alienShips[k].body.r + shot.r) {
					console.log("You hit the alien ship.");
					// remove that alien ship from the array
					alienShipFactory.alienShips.splice(k,1);
					$('#ships-remaining').text("Alien Ships Remaining: " + alienShipFactory.alienShips.length)
				if (alienShipFactory.alienShips.length === 0) {
					console.log("You have destroyed all of the alien ships. Click continue to move on to the next level.");
					cancelAnimationFrame(gamePlayAnimation)

				// get the sho to stop moving
				}
				
			}
			
		}

		// also draw the spaceship
		spaceship.drawBody();
		// also draw the aliens
		alienShipFactory.animateAliens();
	}	
	}
}

$('html').keydown(function(e) {
	gamePlayAnimation(e);
	})



