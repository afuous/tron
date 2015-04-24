(function() {
	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");
	
	var LEFT = 0;
	var UP = 1;
	var RIGHT = 2;
	var DOWN = 3;
	
	var width = 100;
	var height = 80;
	var side = 10;
	
	var rubber = 10;
	
	var bikes;
	var playing = false;
	var interval;
	
	function init() {
		playing = true;
		document.getElementById("loser").innerHTML = "&nbsp";
		
		bikes = [{
			number: 1,
			x: width - 10,
			y: height / 2,
			dir: LEFT,
			head: "white",
			tail: "red",
			keys: {
				left: 37,
				right: 39,
				up: 38,
				down: 40
			}
		}, {
			number: 2,
			x: 10,
			y: height / 2,
			dir: RIGHT,
			head: "white",
			tail: "green",
			keys: {
				left: 65,
				right: 68,
				up: 87,
				down: 83
			}
		}];
	
		for(var i = 0; i < bikes.length; i++) {
			var bike = bikes[i];
			bike.pressed = [];
			bike.chances = 0;
			bike.field = [];
			for(var j = 0; j < height; j++) {
				bike.field.push([]);
				for(var k = 0; k < width; k++) {
					bike.field[j].push(false);
				}
			}
		}
	
		interval = setInterval(function() {
			if(physics()) draw();
		}, 50);
	}
	
	canvas.width = side * width;
	canvas.height = side * height;
	
	window.onkeydown = function(event) {
		var key = (event || window.event).keyCode;
		if(playing) for(var i = 0; i < bikes.length; i++) {
			var bike = bikes[i];
			if(~[bike.keys.left, bike.keys.right, bike.keys.up, bike.keys.down].indexOf(key)) {
				bike.pressed.push(key);
			}
		}
		if((key == 32 || key == 13) && !playing) init();
	};
	
	function physics() {
		for(var i = 0; i < bikes.length; i++) {
			var bike = bikes[i];
			while(bike.pressed.length > 0) {
				var any = true;
				if(bike.pressed[0] == bike.keys.left && bike.dir != RIGHT) bike.dir = LEFT;
				else if(bike.pressed[0] == bike.keys.right && bike.dir != LEFT) bike.dir = RIGHT;
				else if(bike.pressed[0] == bike.keys.up && bike.dir != DOWN) bike.dir = UP;
				else if(bike.pressed[0] == bike.keys.down && bike.dir != UP) bike.dir = DOWN;
				else any = false;
				bike.pressed.splice(0, 1);
				if(any) break;
			}
			var oldX = bike.x;
			var oldY = bike.y;
			bike.field[bike.y][bike.x] = true;
			if(bike.dir == RIGHT) bike.x++;
			if(bike.dir == LEFT) bike.x--;
			if(bike.dir == UP) bike.y--;
			if(bike.dir == DOWN) bike.y++;
			var hittingWall = bike.x < 0 || bike.x >= width || bike.y < 0 || bike.y >= height;
			if(!hittingWall) for(var j = 0; j < bikes.length; j++) {
				if(bikes[j].field[bike.y][bike.x]) {
					hittingWall = true;
				}
			}
			if(hittingWall) {
				bike.x = oldX;
				bike.y = oldY;
				bike.chances++;
				if(bike.chances >= rubber) {
					clearInterval(interval);
					playing = false;
					document.getElementById("loser").innerHTML = "Player " + bike.number + " loses";
					return false;
				}
			}
			else {
				bike.chances = 0;
			}
		}
		return true;
	}
	
	function draw() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.fillStyle = "black";
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		for(var i = 0; i < bikes.length; i++) {
			var bike = bikes[i];
			ctx.fillStyle = bike.tail;
			for(var j = 0; j < bike.field.length; j++) {
				for(var k = 0; k < bike.field[j].length; k++) {
					if(bike.field[j][k]) {
						ctx.fillRect(k * side, j * side, side, side);
					}
				}
			}
			ctx.fillStyle = bike.head;
			ctx.fillRect(bike.x * side, bike.y * side, side, side);
		}
	}
})();