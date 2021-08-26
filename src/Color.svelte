<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    import Fa from 'svelte-fa';
    import { faCopy, faLock, faTimes, faUnlock } from '@fortawesome/free-solid-svg-icons';
    import { Circle } from 'svelte-loading-spinners';

    import Hoverable from './Hoverable.svelte';
    import { adjustColor } from './helpers';


    const dispatch = createEventDispatcher();

    export let color: string;
    export let locked: boolean;
    export let index: number;

    //fetch color name
    let colorInfo;
    $: colorInfo = fetch("https://www.thecolorapi.com/id?hex=" + color.slice(1,7), {mode: 'cors'}).then((x) => x.json());


    //controls
	let hovering;

	function enter() {
		hovering = true;
	}

	function leave() {
		hovering = false;
	}

    function toggleLocked() {
        locked = !locked
		dispatch('message', {
			index: index,
            type: 'toggleLock',
            locked: locked
		});
	}

    function removeColor() {
		dispatch('message', {
			index: index,
            type: 'remove',
		});
	}

    function copyColor() {
		dispatch('message', {
			index: index,
            type: 'copy',
		});
	}

    //dyn
    $: cssVarStyles = `
    --bg-color:${color};
    --name-color:${adjustColor(color, 30)};
    --hex-color:${adjustColor(color, 90)};`;

</script>
<main class="bg" style="{cssVarStyles}" on:mouseenter={enter} on:mouseleave={leave}>
    <h2 class="hex">{color.slice(1,7).toUpperCase()}</h2>
    {#await colorInfo}
    <div class="loader">
        <Circle size="13" color={adjustColor(color, 30)} unit="px" duration="0.5s"></Circle>
    </div>
    {:then info} 
    <p class="name">{info.name.value}</p>
    {/await}
    
    <div class="controls">
        {#if hovering}
        <Hoverable let:hovering={active}>
        <div class:active on:click={removeColor}>
            <Fa icon={faTimes} color={active ? adjustColor(color, 100) : adjustColor(color, 50) } size="2x"/> 
        </div>
        </Hoverable>
        {/if}
        {#if hovering}
        <Hoverable let:hovering={active}>
        <div class:active on:click={copyColor}>
            <Fa icon={faCopy} color={active ? adjustColor(color, 100) : adjustColor(color, 50) } size="2x"/> 
        </div>
        </Hoverable>
        {/if}
        {#if hovering || locked}
        <Hoverable let:hovering={active}>
        <div class:active on:click={toggleLocked}>
            <Fa icon={locked ? faLock : faUnlock} color={active || locked ? adjustColor(color, 100) : adjustColor(color, 50) } size="2x"/> 
        </div>
        </Hoverable>
        {/if}
    </div>
</main>


<style type="scss">
    @import url("https://fonts.googleapis.com/css?family=Raleway&display=swap");

	main {
		text-align: center;
		width: 100%;
        height: 100%;
	}

    .hex {
        font-family: 'Raleway';
        color: var(--hex-color, lightgray);
    }

    .name {
        font-family: 'Raleway';
        font-size: small;
        color: var(--name-color, lightgray);
    }

    .bg {
        background-color: var(--bg-color, lightgray);
        height: 100%;
    }

    .loader {
        display: flex;
        justify-content: center;
    }

    .controls {
        margin: 25px auto;
        max-width: 30px;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;

        * {
            padding: 10px  0px;
        }
    }
</style>