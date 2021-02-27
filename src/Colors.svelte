<script lang="ts">
    let colors: string[] = randomColor({'count':7});
    
    import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	function refresh() {
		dispatch('message', {
			text: 'Hello!'
		});
	}

 
</script>

<main>
	{#each colors as color}
	<Color color={color}/>
	{/each}
</main>

<style>

</style>