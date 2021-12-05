// fuck camelCase, snake_case_gang
const screen_width = 640; const screen_height = 480; // predefined screen height/width
const render_delay = 30; const player_fov = 60; // render delay in ms + fov
let player_x = 1; let player_y = 1; // cartesian player position
let player_angle = 45; const angle_inc = player_fov/screen_width;
// player view direction + angle to be incremented by for raycasting
const level = [[1, 1, 1, 1, 1, 1, 1], // level to be raycasted
[1, 0, 0, 0, 0, 0, 1],
[1, 0, 0, 0, 0, 0, 1],
[1, 0, 1, 1, 0, 0, 1],
[1, 0, 0, 1, 1, 0, 1],
[1, 0, 0, 0, 0, 0, 1],
[1, 1, 1, 1, 1, 1, 1]]

const screen = document.createElement('canvas'); /* initializing canvas element */
screen.width = screen_width;
screen.height = screen_height;
screen.style.border = "1px solid black"; // applying styling to canvas to center and give border
screen.style.padding = "0";
screen.style.margin = "auto";
screen.style.display = "block";
document.body.appendChild(screen);
const screen_context = screen.getContext("2d");
keys = {
	key: {
		up: "KeyW",
		down: "KeyS",
		left: "KeyA",
		right: "KeyD"
	}
}

function deg_to_rad(angle) {
	//converts degrees to radians
	return (angle*Math.PI)/180;
}

function draw_canvas_line(x1, y1, x2, y2, css_color_keyword) {
	// draws the canvas lines to be used to render the scene
	screen_context.strokeStyle = css_color_keyword;
	screen_context.beginPath();
	screen_context.moveTo(x1, y1);
	screen_context.lineTo(x2, y2);
	screen_context.stroke();
}

function clear_screen() {
	screen_context.clearRect(0, 0, screen_width, screen_height);
}

function ray_cast() {
	let ray_angle = player_angle - (player_fov/2); // angle to be used for purposes of incrementing from left to right
	for(let ray = 0; ray < screen_width; ray++) { // incrementing across the screen and testing for walls
		let cast_ray_x = player_x // x and y comp. of ray to be cast
		let cast_ray_y = player_y
		const x_component = Math.cos(deg_to_rad(ray_angle))/64;
		const y_component = Math.sin(deg_to_rad(ray_angle))/64;
		let wall_found = 0;
		while(wall_found == 0) {
			cast_ray_x += x_component;
			cast_ray_y += y_component;
			wall_found = level[Math.floor(cast_ray_y)][Math.floor(cast_ray_x)];
		}
		const distance = Math.sqrt(Math.pow(player_x - cast_ray_x, 2) + Math.pow(player_y - cast_ray_y, 2));
		const distance_to_wall = distance * Math.cos(deg_to_rad(ray_angle - player_angle));
		const wall_height = Math.floor((screen_height/2)/distance_to_wall);
		draw_canvas_line(ray, 0, ray, (screen_height/2) - wall_height, "darkturquoise");
		draw_canvas_line(ray, (screen_height/2) - wall_height, ray, (screen_height/2)+wall_height, "hotpink");
		draw_canvas_line(ray, (screen_height/2) + wall_height, ray, screen_height, "#b967ff");
		ray_angle += angle_inc;
	}
}

main();

function main() {
	setInterval(function() {
		clear_screen();
		ray_cast();
	}, render_delay);
}

document.addEventListener('keydown', (event) => {
	let key_code = event.code;
	if(key_code === keys.key.up) {
		const player_cos = Math.cos(deg_to_rad(player_angle)) * .2;
		const player_sin = Math.sin(deg_to_rad(player_angle)) * .2;
		if(level[Math.floor(player_y + player_sin)][Math.floor(player_x + player_cos)] === 0) {
			// collision detection logic
			player_x += player_cos;
			player_y += player_sin;
		}
	}
	else if (key_code === keys.key.down) {
		const player_cos = Math.cos(deg_to_rad(player_angle)) * .2;
		const player_sin = Math.sin(deg_to_rad(player_angle)) * .2;
		if(level[Math.floor(player_y - player_sin)][Math.floor(player_x - player_cos)] === 0) {
			// collision detection logic
			player_x -= player_cos;
			player_y -= player_sin;
		}
	}
	else if (key_code === keys.key.left) {
		if(player_angle - 5 < -180) {
			player_angle = (player_angle - 5) + 360;
			console.log(player_angle);
		}
		else {
			player_angle -= 5;
			console.log(player_angle);
		}
	}
	else if (key_code === keys.key.right) {
		if(player_angle + 5 > 180) {
			player_angle = (player_angle + 5) - 360;
			console.log(player_angle);
		}
		else {
			player_angle += 5;
			console.log(player_angle)
		}
	}

});

