console.log("hi");

const canvas = document.getElementById('my-canvas');

const ctx = canvas.getContext('2d');

// to center stuff on the canvas
const x = canvas.width / 2;
const y = canvas.height / 2;

const speed = 20;
let handle;

// make the Battle text on the home screen
ctx.beginPath();
ctx.font = '48px serif';
ctx.textAlign ='center';
ctx.fillStyle = 'blue';
ctx.fillText('BATTLE', x, y - 100);

// button to start the game
$('#start').on('click', () => {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	$('canvas').addClass('ocean')
	$('#start').detach();
	spaceship.initialize()
	spaceship.drawBody()
})

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

// when the user presses the arrow keys, the "ship" moves left and right
$('html').keydown(function(event) {
	const key = event.keyCode;
	if (key === 39) {
		spaceship.direction = 'right';
		spaceship.body.x = spaceship.body.x + speed;
		animateCanvas()
	} else if (key === 37) {
		spaceship.direction = 'left';
		spaceship.body.x = spaceship.body.x - speed;
		handle = window.requestAnimationFrame(animateCanvas);
	}
})

function animateCanvas () {
	ctx.clearRect(0,0, canvas.width, canvas.height);
	spaceship.move();
	spaceship.drawBody();
}



// animateCanvas()