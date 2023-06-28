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
        let canvas = document.getElementById('gameboard');
        let ctx = canvas.getContext('2d');
        size = canvas.getBoundingClientRect();
        canvas.width = size.width * 10;
        canvas.height = size.height * 10;
        ctx.scale(10, 10);
        ctx.beginPath();
        ctx.rect(20, 20, size.width-300, size.height-300); 
        ctx.fill();
    });
</script>