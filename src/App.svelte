<script lang="ts">
	import { randomColor } from 'randomcolor';
	import Color from './Color.svelte';
	import { SvelteToast } from '@zerodevx/svelte-toast'
	import { Circle } from 'svelte-loading-spinners';
import { adjustColor } from './helpers';

	interface ColorProps {
    lock: boolean;
    hex: string;
    index: number;
    id: number;
	}

	let colors: ColorProps[] = [];
	let colorCount = 5;

	let initColors = randomColor({'count':colorCount});
	
	initColors.forEach((color,index) => {
		colors.push({hex: color, lock:false, index: index, id: index})
	});



	function handlePress(e) {
		if( e.key === " ") {
			const newColors = randomColor({'count':colorCount});
			newColors.forEach((color, idx) => {
				colors[idx].lock ? 
					'' :
					colors[idx].hex = color;
			});
		}
	}

	function handleMessage(event) {
		if (event.detail.type === 'toggleLocked') {
			colors[event.detail.index].lock = event.detail.locked;
		} else  if (event.detail.type === 'remove'){
			colors = colors.filter(item => item.index !== event.detail.index);
		} else {
			navigator.clipboard.writeText(colors[event.detail.index].hex);
		}
			
	}



</script>

<svelte:window on:keypress={e => handlePress(e)} />

<main>
		{#await initColors} 
		<div class="loader">
			<Circle size="13" color={adjustColor("#fffff", 30)} unit="px" duration="0.5s"></Circle>
		</div>
		{:then colorScheme} 
		{#each colors as color(color.id)}
		<Color on:message={handleMessage} hex={color.hex} locked={color.lock} index={color.index}/>
		{/each}
		<div className="wrap">
			<SvelteToast options={{ reversed: true, intro: { y: 120 } }} />
		</div>
		{/await}

</main>

<style>
	@import url("https://fonts.googleapis.com/css?family=Raleway&display=swap");

	main {
		text-align: center;
		height: 100vh;
		max-height: 100vh;
		min-width:100vh;
		display:flex;
		flex-direction:row;

	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}

	:root {
    --toastContainerTop: auto;
    --toastContainerRight: auto;
    --toastContainerBottom: 8rem;
    --toastContainerLeft: calc(50vw - 8rem);
  }

  	.wrap {
		display: contents;
		font-family: "Raleway", sans-serif;
		font-size: 0.875rem;
  }
</style>