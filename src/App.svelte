<script lang="ts">
	import { randomColor } from 'randomcolor';
	import Color from './Color.svelte';

	let colors: string[] = randomColor({'count':7});

	function handlePress(e) {
		if( e.key === " ") {
			colors =  randomColor({'count':7});
		}
	}



</script>

<svelte:window on:keypress={e => handlePress(e)} />

<main>
	{#each colors as color}
	<Color color={color}/>
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