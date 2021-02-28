<script lang="ts">
	import { randomColor } from 'randomcolor';
	import Color from './Color.svelte';

	interface ColorProps {
		lock: boolean;
		hex: string;
		index: number;
	}

	let initColors = randomColor({'count':7});
	let colors: ColorProps[] = []
	initColors.forEach((color,index) => {
		colors.push({hex: color, lock:false, index: index})
	});

	function handlePress(e) {
		if( e.key === " ") {
			const newColors = randomColor({'count':7});
			newColors.forEach((color, idx) => {
				colors[idx].lock ? 
					'' :
					colors[idx].hex = color;
			});
		}
	}

	function handleMessage(event) {
		colors[event.detail.index].lock = event.detail.locked	
	}



</script>

<svelte:window on:keypress={e => handlePress(e)} />

<main>
	{#each colors as color}
	<Color on:message={handleMessage} color={color.hex} locked={color.lock} index={color.index}/>
	{/each}
</main>

<style>
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
</style>