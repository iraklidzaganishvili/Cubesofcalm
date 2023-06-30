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
    let size;
    let spawn;
    let goal;
    onMount(() => {
        // dimensions.set({
        //     width: gameboard.offsetWidth,
        //     height: gameboard.offsetWidth / 2
        // });

        //Draw canvas
        let canvas = document.getElementById('gameboard');
        let ctx = canvas.getContext('2d');
        size = canvas.getBoundingClientRect();
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
                            spawn = {x:x, y:y};
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

        //map
        let mapgen =  [2,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
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
                       ]
        drawwalls(mapgen);

        //player and collision

        function getMousePos(canvas, evt) {
            const rect = canvas.getBoundingClientRect();
            return {
                x: evt.clientX - rect.left,
                y: evt.clientY - rect.top
            };
            }
        function spawnplayer(){
            ctx.fillStyle = 'green'; 
            ctx.fillRect(spawn.x*blocklength, spawn.y*blocklength, blocklength/2, blocklength/2);
        }
        spawnplayer();

        //player
        var player = {
            x: spawn.x,
            y: spawn.y,
            move: blocklength,
            color: green,
        }

        //colision
        canvas.addEventListener('keydown', function(evt) {        
            switch(evt.key){
                case 'w':
                    box.y = box.y-box.move;
                    break;
                case 's':
                    box.y = box.y+box.move;
                    break;
                case 'a':
                    box.x = box.x-box.move;
                    break;
                case 'd':
                    box.x = box.x+box.move;
                    break;
            }
        });
    });
</script>