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
    onMount(() => {
        // dimensions.set({
        //     width: gameboard.offsetWidth,
        //     height: gameboard.offsetWidth / 2
        // });

        //Draw canvas
        let canvas = document.getElementById('gameboard');
        let ctx = canvas.getContext('2d');
        size = canvas.getBoundingClientRect();
        canvas.width = size.width * 10;
        canvas.height = size.height * 10;
        ctx.scale(10, 10);
        ctx.beginPath();
        ctx.rect(20, 20, 300, 300); 
        ctx.fill();
        
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
    });
</script>