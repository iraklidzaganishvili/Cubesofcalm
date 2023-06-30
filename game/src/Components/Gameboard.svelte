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
        
        let player = {
            x: spawn.x,
            y: spawn.y,
            move: blocklength/2,
            color: "green",
        }
        
        let keys = {
            w: false,
            a: false,
            s: false,
            d: false
        }

        let game = {
            speed: 1000/60
        }

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
        function gameloop(){
            ctx.clearRect(player.x, player.y, blocklength/2, blocklength/2);
            ctx.fillStyle = player.color;
            ctx.fillRect(player.x, player.y, blocklength/2, blocklength/2);
            switch(keys) {
            case w:
                
                break;
            case s:

                break;
            case a:

                break;
            case d:

                break;
        }
        }
        setInterval(gameloop, game.speed);
    });
</script>