<script>
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import * as stores from './levels.js';

	//map
	let level = 0;
	let allmaps = get(stores.mapgen);
	let mapgen;
	mapgen = allmaps.maps[level];

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
		canvas.width = size.width * 10;
		canvas.height = size.height * 10;
		ctx.scale(10, 10);

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
		function drawMap() {
            ctx.clearRect(0, 0, game.w * game.blocklength, game.h * game.blocklength);
			for (var y = 0; y < game.h; y++) {
				for (var x = 0; x < game.w; x++) {
					switch (mapgen[y * game.w + x]) {
						case 1:
							ctx.fillStyle = 'black';
							ctx.fillRect(
								x * game.blocklength,
								y * game.blocklength,
								game.blocklength,
								game.blocklength
							);
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
						default:
							if(mapgen[y * game.w + x] > 1 && mapgen[y * game.w + x] < 100){
								// array[mapgen[y * game.w + x]].push(y * game.w + x);
							}
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
		let abacus = 0;
		let fps = 60;
		let now;
		let then = Date.now();
		let interval = 1000 / fps;
		let delta;
		let fpscounter = 0;
		let arrayPos = [0];
		let movingBlockArray = [[0,1,2,3,4,5,6,100,100,100,6,5,4,3,2,1,0]];
		setInterval(() => {
		        console.log('fps:' + fpscounter);
		        fpscounter = 0;
		    }, 1000);
		function gameloop() {
			now = Date.now();
			delta = now - then;
			if (delta > interval) {
				fpscounter = fpscounter+1;
				then = now - (delta % interval);

				//runs every frame 
				abacus = abacus +1;
				if (abacus == 10){
				drawMovingBlock(movingBlockArray[0][arrayPos[0]], movingBlockArray[0][arrayPos[0]-1], 1, 'red', movingBlockArray[0].length, 0);
				abacus = 0;
			}
				animatecharacter();
				checkcollision();

			}
			requestAnimationFrame(gameloop);
		}

		//movement
		function animatecharacter() {
            ctx.clearRect(player.x, player.y, player.size, player.size);
			if (keys.w == true) {
				player.y = player.y - player.move;
			}
			if (keys.s == true) {
				player.y = player.y + player.move;
			}
			if (keys.a == true) {
				player.x = player.x - player.move;
			}
			if (keys.d == true) {
				player.x = player.x + player.move;
			}
			ctx.fillStyle = player.color;
			ctx.fillRect(player.x, player.y, player.size, player.size);
		}
		requestAnimationFrame(gameloop);

		//colision logic
		let bordcord = {
			minXMinY: 0,
			minXMaxY: 0,
			maXXminY: 0,
			maXXmaxY: 0
		};
		var HitNextLVLOnce = true;
		function checkcollision() {
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
			mapgen = allmaps.maps[level];
			console.log('level:' + level);
			drawMap();
			spawnplayer();
		}
        window.level = nextlevel;

		//block that moves to all array positions
		let blockY;
		let blockX;
		function drawMovingBlock (blockpos, previousBlockpos, blockSize, blockColor, moveLength, n){
			ctx.clearRect(blockX*game.blocklength, blockY*game.blocklength, game.blocklength*blockSize, game.blocklength*blockSize);
			mapgen[previousBlockpos] = 0;
			blockY = Math.floor(blockpos/game.w);
			blockX = blockpos - blockY * game.w;
			ctx.fillStyle = blockColor;
			ctx.fillRect(blockX*game.blocklength, blockY*game.blocklength, game.blocklength*blockSize, game.blocklength*blockSize);
			mapgen[blockpos] = 1;
			if (arrayPos[n] == moveLength){
				arrayPos[n] = 0;
			}
			arrayPos[n] = arrayPos[n] + 1;

		}
	});
</script>

<canvas bind:this={canvas} id="gameboard" />
<svelte:window on:keydown={handleKeyDown} on:keyup={handlekeyUp} />

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
