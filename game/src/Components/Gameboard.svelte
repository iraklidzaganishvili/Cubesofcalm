<script>
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import * as stores from './levels.js';
	import wall_roof from "./Sprites/wall_roof.png";
	import wall_bottom from "./Sprites/wall_bottom.png";	
	import wall_side from "./Sprites/wall_side.png";
	import wall_top from "./Sprites/wall_top.png";

	//map
	let level = 0;
	let allmaps = get(stores.mapgen).maps;
	let allblocks = get(stores.blockgen).movingBlocks;
	let addallblocks = get(stores.addblockgen).movingBlockAdditionalPoperties;
	let mapgen;
	let blockgen;
	let addpropgen;

	let canvas;
	function handleKeyDown(event) {
		keys[event.key] = true;
	}

	function handlekeyUp(event) {
		keys[event.key] = false;
	}
	let spawn;
	let keys = {
		w: false,
		a: false,
		s: false,
		d: false
	};

	let game = {
		speed: 1000 / 20,
		w: 80,
		h: 40,
		blocklength: 0
	};
	onMount(() => {
		let ctx = canvas.getContext('2d');
		let size = canvas.getBoundingClientRect();
		canvas.width = size.width * 8;
		canvas.height = size.height * 8;
		ctx.scale(8, 8);

		//blocklength
		game.blocklength = size.width / game.w;

		//Styling stuff
		window.addEventListener('resize', resize);
		function resize() {
			let viewportWidth = window.innerWidth;
			let viewportHeight = window.innerHeight;
			if (canvas.offsetWidth > viewportWidth || canvas.offsetHeight > viewportHeight) {
				canvas.style.left = '0%';
				canvas.style.top = '0%';
				canvas.style.transform = 'translate(0%, 0%)';
			} else {
				canvas.style.left = '50%';
				canvas.style.top = '50%';
				canvas.style.transform = 'translate(-50%, -50%)';
			}
		}
		resize();

		//Drawing unmoving
		allblocks = allblocks.map((element) =>
			element.map((innerArray) => innerArray.map((coord) => coord[1] * game.w + coord[0]))
		);
		function drawMap() {
			ctx.clearRect(0, 0, game.w * game.blocklength, game.h * game.blocklength);
			mapgen = allmaps[level];
			blockgen = allblocks[level];
			addpropgen = addallblocks[level];
			for (var y = 0; y < game.h; y++) {
				for (var x = 0; x < game.w; x++) {
					switch (mapgen[y * game.w + x]) {
						case 1:
							ctx.drawImage(
								document.getElementById("wall_roof"),
								x * game.blocklength,
								y * game.blocklength,
								game.blocklength,
								game.blocklength
							);
							if (mapgen[(y-1) * game.w + x] == 0){
								ctx.drawImage(
								document.getElementById("wall_top"),
								x * game.blocklength,
								y * game.blocklength,
								game.blocklength,
								game.blocklength/4
							);
							}
							if (mapgen[(y+1) * game.w + x] == 0){
								ctx.drawImage(
								document.getElementById("wall_bottom"),
								x * game.blocklength,
								(y + 0.5) * game.blocklength,
								game.blocklength,
								game.blocklength/2
							);
							}
							if (mapgen[y * game.w + x - 1] == 0){
								ctx.fillRect(
								document.getElementById("wall_side"),
								x * game.blocklength,
								y * game.blocklength,
								game.blocklength/4,
								game.blocklength
							);
							}
							if (mapgen[y * game.w + x + 1] == 0){
								ctx.fillRect(
								document.getElementById("wall_side"),
								(x + 0.75)* game.blocklength,
								y * game.blocklength,
								game.blocklength/4,
								game.blocklength
							);
							}
							break;
						case -1:
							ctx.fillStyle = 'red';
							ctx.fillRect(
								x * game.blocklength,
								y * game.blocklength,
								game.blocklength,
								game.blocklength
							);
							spawn = { x: x * game.blocklength, y: y * game.blocklength };
							break;
						case -2:
							ctx.fillStyle = 'blue';
							ctx.fillRect(
								x * game.blocklength,
								y * game.blocklength,
								game.blocklength,
								game.blocklength
							);
							break;
					}
				}
			}
		}
		drawMap();

		let player = {
			size: game.blocklength,
			x: spawn.x,
			y: spawn.y,
			vx: 0,
			vy: 0,
			move: game.blocklength / 8,
			color: 'green'
		};
		//spawn
		function spawnplayer() {
			ctx.fillStyle = player.color;
			ctx.fillRect(spawn.x, spawn.y, player.size, player.size);
			ctx.clearRect(player.x, player.y, player.size, player.size);
			player.x = spawn.x;
			player.y = spawn.y;
			drawMap();
			keys = { w: false, a: false, s: false, d: false };
		}
		//gameloop
		let fps = 60;
		let now;
		let then = Date.now();
		let interval = 1000 / fps;
		let delta;
		let fpscounter = 0;
		let deltatime = 1;

		let lastFrameTimeMs = Date.now();
		let FrameTimeMs;
		setInterval(() => {
			console.clear();
			console.table({
				FPS: fpscounter,
				Choose_Level: 'window.level(Level)',
			});
			fpscounter = 0;
		}, 1000);
		function gameloop() {
			now = Date.now();
			delta = now - then;
			if (delta > interval) {
				//
				FrameTimeMs = Date.now();
				//
				fpscounter = fpscounter + 1;
				deltatime = ((FrameTimeMs - lastFrameTimeMs) / 1000) * 60;
				lastFrameTimeMs = Date.now();
				then = now - (delta % interval);
				blockgen.forEach((element, index) => {
					drawMovingBlock(
						blockgen[index][posInMovesetArray[index]], //blockpos
						blockgen[index][posInMovesetArray[index] - 1], //previousBlockpos
						addpropgen[index].color, //blockColor
						element.length - 1, //moveLength
						index, //blockIndex
						Math.round(fps / addpropgen[index].speed) //blockSpeed
					);
				});
				animatecharacter();
				checkCollision();
			}
			requestAnimationFrame(gameloop);
		}
		requestAnimationFrame(gameloop);

		//movement
		function animatecharacter() {
			ctx.clearRect(player.x, player.y, player.size, player.size);
			if (keys.w == true) {
				player.y = player.y - player.move * deltatime;
				player.y = Math.round(player.y);
			}
			if (keys.s == true) {
				player.y = player.y + player.move * deltatime;
				player.y = Math.round(player.y);
			}
			if (keys.a == true) {
				player.x = player.x - player.move * deltatime;
				player.x = Math.round(player.x);
			}
			if (keys.d == true) {
				player.x = player.x + player.move * deltatime;
				player.x = Math.round(player.x);
			}
			ctx.fillStyle = player.color;
			ctx.fillRect(player.x, player.y, player.size, player.size);
		}

		//colision logic
		let bordcord = {
			minXMinY: 0,
			minXMaxY: 0,
			maXXminY: 0,
			maXXmaxY: 0
		};
		var HitNextLVLOnce = true;
		function checkCollision() {
			bordcord.minXMinY =
				Math.floor(player.y / game.blocklength) * game.w + Math.floor(player.x / game.blocklength);
			bordcord.minXMaxY =
				Math.floor(player.y / game.blocklength) * game.w + Math.ceil(player.x / game.blocklength);
			bordcord.maXXminY =
				Math.ceil(player.y / game.blocklength) * game.w + Math.floor(player.x / game.blocklength);
			bordcord.maXXmaxY =
				Math.ceil(player.y / game.blocklength) * game.w + Math.ceil(player.x / game.blocklength);
			for (let element in bordcord) {
				if (mapgen[bordcord[element]] == 1) {
					spawnplayer();
				} else {
					if (mapgen[bordcord[element]] == -2 && HitNextLVLOnce == true) {
						HitNextLVLOnce = false;
						level = level + 1;
						nextlevel(level);
						spawnplayer();
					}
				}
			}
			HitNextLVLOnce = true;
		}

		function nextlevel(level) {
			console.log('level:' + level);
			spawnplayer();
			posInMovesetArray = [];
			smoother = [];
			exactBlockPosition = [];
		}
		window.level = nextlevel;

		//block that moves to all array positions (thats a lot of inputs past me what the f**k where you thinking)
		let posInMovesetArray = [];
		let smoother = [];
		let exactBlockPosition = [];
		// The ungodly demon
		function drawMovingBlock(
			blockpos,
			previousBlockpos,
			blockColor,
			moveLength,
			blockIndex,
			blockSpeed
		) {
			let blockY;
			let blockX;
			let prevBlockY;
			let prevBlockX;
			if (!smoother[blockIndex]) {
				smoother[blockIndex] = 0;
			}
			if (!posInMovesetArray[blockIndex]) {
				posInMovesetArray[blockIndex] = 0;
			}
			if (!exactBlockPosition[blockIndex]) {
				exactBlockPosition[blockIndex] = {
					x: Math.floor(
						(prevBlockX + ((blockX - prevBlockX) / blockSpeed) * smoother[blockIndex]) *
							game.blocklength
					),
					y: Math.floor(
						(prevBlockY + ((blockY - prevBlockY) / blockSpeed) * smoother[blockIndex]) *
							game.blocklength
					)
				};
			}
			ctx.fillStyle = 'green';
			ctx.clearRect(
				exactBlockPosition[blockIndex].x,
				exactBlockPosition[blockIndex].y,
				game.blocklength,
				game.blocklength
			);

			//positions
			blockY = Math.floor(blockpos / game.w);
			blockX = blockpos - blockY * game.w;
			prevBlockY = Math.floor(previousBlockpos / game.w);
			prevBlockX = previousBlockpos - prevBlockY * game.w;
			exactBlockPosition[blockIndex].x = Math.floor(
				(prevBlockX + ((blockX - prevBlockX) / blockSpeed) * smoother[blockIndex]) *
					game.blocklength
			);
			exactBlockPosition[blockIndex].y = Math.floor(
				(prevBlockY + ((blockY - prevBlockY) / blockSpeed) * smoother[blockIndex]) *
					game.blocklength
			);

			//filling
			ctx.fillStyle = blockColor;
			ctx.fillRect(
				exactBlockPosition[blockIndex].x,
				exactBlockPosition[blockIndex].y,
				game.blocklength,
				game.blocklength
			);
			smoother[blockIndex] = smoother[blockIndex] + 1;
			if (posInMovesetArray[blockIndex] == moveLength && smoother[blockIndex] > blockSpeed) {
				posInMovesetArray[blockIndex] = 0;
			}
			if (smoother[blockIndex] > blockSpeed) {
				smoother[blockIndex] = 0;
				posInMovesetArray[blockIndex] = posInMovesetArray[blockIndex] + 1;
			}
			if (
				player.x + 1 < exactBlockPosition[blockIndex].x + game.blocklength &&
				player.x - 1 + game.blocklength > exactBlockPosition[blockIndex].x &&
				player.y + 1 < exactBlockPosition[blockIndex].y + game.blocklength &&
				player.y - 1 + game.blocklength > exactBlockPosition[blockIndex].y
			) {
				spawnplayer();
			}
		}
	});

	// fix hitbox by using game.blocklength instead of arraynum
</script>

<canvas bind:this={canvas} id="gameboard" />
<svelte:window on:keydown={handleKeyDown} on:keyup={handlekeyUp} />
<img src={wall_bottom} alt="wall" id="wall_bottom" style="display:none;"/>
<img src={wall_roof} alt="wall" id="wall_roof" style="display:none;"/>
<img src={wall_side} alt="wall" id="wall_side" style="display:none;"/>
<img src={wall_top} alt="wall" id="wall_top" style="display:none;"/>
<style>
	#gameboard {
		width: 80rem;
		height: 40rem;
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		background-color: aquamarine;
	}
</style>
