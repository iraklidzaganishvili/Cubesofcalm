<style>
#gameboard{
    width:80rem;
    height:40rem;
    position: absolute;
    left:50%;
    top:50%;
    transform: translate(-50%, -50%);
    background-color:aquamarine;
}
</style>
<canvas id="gameboard">
</canvas>
<script>
    import { onMount } from 'svelte';
    // import { dimensions } from './store.js';
    onMount(() => {
        let spawn;
        let goal;
        
        let keys = {
            w: false,
            a: false,
            s: false,
            d: false
        };

        let game = {
            speed: 1000/20
        };

        //map
        let mapgen =  [0,0,0,0,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
                       0,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
                       0,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
                       0,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
                       0,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
                       0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
                       1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
                       1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
                       1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
                       1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
                       1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
                       1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
                       1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
                       1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
                       1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
                       1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
                       1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
                       1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
                       1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
                       1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,3,
                       ];

        let canvas = document.getElementById('gameboard');
        let ctx = canvas.getContext('2d');
        let size = canvas.getBoundingClientRect();
        let blocklength = size.width/40;
        canvas.width = size.width * 10;
        canvas.height = size.height * 10;
        ctx.scale(10, 10);
        
        //Styling stuff
        window.addEventListener('resize', resize);
        function resize(){
            let viewportWidth = window.innerWidth;
            let viewportHeight = window.innerHeight;
            if (canvas.offsetWidth > viewportWidth || canvas.offsetHeight > viewportHeight) {
                canvas.style.left = "0%";
                canvas.style.top = "0%";
                canvas.style.transform = "translate(0%, 0%)";
            } else {
                canvas.style.left = "50%";
                canvas.style.top = "50%";
                canvas.style.transform = "translate(-50%, -50%)";
            }
        }
        resize();

        //Drawing unmoving
        function drawwalls(arrayof800){
            for (var y = 0; y < 20; y++){
                for (var x = 0; x < 40; x++){
                    switch(arrayof800[y*40+x]) {
                        case 1:
                            ctx.fillStyle = 'black';
                            ctx.fillRect(x*blocklength, y*blocklength, blocklength, blocklength); 
                            break;
                        case 2:
                            ctx.fillStyle = 'red';
                            ctx.fillRect(x*blocklength, y*blocklength, blocklength/2, blocklength/2);
                            spawn = {x:x*blocklength, y:y*blocklength};
                            break;
                        case 3:
                            ctx.fillStyle = 'blue';
                            ctx.fillRect(x*blocklength, y*blocklength, blocklength, blocklength);
                            goal = {x:x, y:y};
                            break;
                    }
                } 
            }
        }
        drawwalls(mapgen);

        let player = {
            x: spawn.x,
            y: spawn.y,
            vx: 0,
            vy: 0,
            move: blocklength/4,
            color: "green",
        };
        //spawn
        function spawnplayer(){
            ctx.fillStyle = player.color; 
            ctx.fillRect(spawn.x, spawn.y, blocklength/2, blocklength/2);
        }
        spawnplayer();

        window.addEventListener('keydown', function(evt) {
            keys[evt.key] = true;
        });
        window.addEventListener('keyup', function(evt) {
            keys[evt.key] = false;
        });

        //gameloop
        
        var fps = 30;
        var now;
        var then = Date.now();
        var interval = 1000/fps;
        var delta;
        
        function gameloop(){

            now = Date.now();
            delta = now - then;
            if (delta > interval) {
                then = now - (delta % interval);
                animatecharacter();
            }
            requestAnimationFrame(gameloop);
        }
        function animatecharacter(){
            ctx.clearRect(player.x, player.y, blocklength/2, blocklength/2);
            if(keys.w == true){
                player.y = player.y-player.move;
            }
            if(keys.s == true){
                player.y = player.y+player.move;
            }
            if(keys.a == true){
                player.x = player.x-player.move;
            }
            if(keys.d == true){
                player.x = player.x+player.move;
            }
            ctx.fillStyle = player.color;
            ctx.fillRect(player.x, player.y, blocklength/2, blocklength/2);
        }
        requestAnimationFrame(gameloop);

    });
</script>