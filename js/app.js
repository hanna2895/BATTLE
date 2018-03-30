console.log("hi");

const canvas = document.getElementById('my-canvas');

const ctx = canvas.getContext('2d');

// to center stuff on the canvas
const x = canvas.width / 2;
const y = canvas.height / 2;

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
})