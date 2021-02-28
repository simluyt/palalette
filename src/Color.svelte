<script lang="ts">
    import Icon from 'svelte-awesome';
    import { lock, unlock } from 'svelte-awesome/icons';

    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    export let color: string;
    export let locked: boolean;
    export let index: number;
    let colorInfo;
    
    $: colorInfo = fetch("https://www.thecolorapi.com/id?hex=" + color.slice(1,7), {mode: 'cors'}).then((x) => x.json());

    function toggleLocked() {
        locked = !locked
		dispatch('message', {
			index: index,
            locked: locked
		});
	}

</script>

<main class="bg" style="--bg-color:{color};">
<p>{color}</p>
{#await colorInfo}
    <p>waiting...</p>
{:then info} 
<p>{info.name.value}</p>
{/await}
<p on:click={toggleLocked}><Icon  data={locked ? lock : unlock}/></p>
<p>hue</p>	
</main>

<style>
	main {
		text-align: center;
		width: 100%;
        height: 100%;
	}

    .bg{
        background-color: var(--bg-color, lightgray);
    }
</style>