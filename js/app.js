console.log("hi");

const canvas = document.getElementById('my-canvas');

// this is something you will basically always need for 2d canvas art
const ctx = canvas.getContext('2d');
const x = canvas.width / 2;
const y = canvas.height / 2;
ctx.beginPath();
ctx.font = '48px serif';
ctx.textAlign ='center';
ctx.fillStyle = 'blue';
ctx.fillText('BATTLE', x, y - 100);
