<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    import Fa from 'svelte-fa';
    import { faCopy, faLock, faPlus, faPlusCircle, faTimes, faUnlock } from '@fortawesome/free-solid-svg-icons';
    import { Circle } from 'svelte-loading-spinners';
    import { toast } from '@zerodevx/svelte-toast'

    import Hoverable from './Hoverable.svelte';
    import { adjustColor } from './helpers';


    const dispatch = createEventDispatcher();

    export let hex: string;
    export let locked: boolean;
    export let index: number;
    export let colorCount: number;

    //fetch color name
    
    $: name = fetch("https://www.thecolorapi.com/id?hex=" + hex.slice(1,7), {mode: 'cors'}).then((x) => x.json());


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
            locked: locked,
            hex: hex
		});
	}

    function removeColor() {
        if (!locked) {
		    dispatch('message', {
                index: index,
                type: 'remove',
                locked: locked
            });
        } else {
            toast.push('Cannot delete locked color', {
                theme: {
                    '--toastBackground': '#e63239',
                    '--toastColor': adjustColor('#e63239', 40),
                    '--toastProgressBackground': '#e63239'
                }
            });

	    }
    }

    function addColor() {
        if (colorCount < 10) {
		    dispatch('message', {
                index: index,
                type: 'add',
            });
        } else {
            toast.push('Cannot add another color', {
                theme: {
                    '--toastBackground': '#e63239',
                    '--toastColor': adjustColor('#e63239', 40),
                    '--toastProgressBackground': '#e63239'
                }
            });

	    }
    }

    function copyColor() {
		dispatch('message', {
			index: index,
            type: 'copy',
		});
	}

    //dyn
    $: cssVarStyles = `
    --bg-color:${hex};
    --name-color:${adjustColor(hex, 30)};
    --hex-color:${adjustColor(hex, 90)};`;

</script>

<main class="bg" style="{cssVarStyles}" on:mouseenter={enter} on:mouseleave={leave}>
    <div class="colorMain">
    <div class="colorNames">
        <h2 class="hex">{hex.slice(1,7).toUpperCase()}</h2>
        <div class="loader">
        {#await name}
         <p><Circle size="15" color={adjustColor(hex, 30)} unit="px" duration="1s"></Circle></p>   
        {:then info} 
        <p class="name">{info.name.value}</p>
        {/await}
        </div>
    </div>
    <div class="controls">
        {#if hovering && colorCount > 2}
            <Hoverable let:hovering={active}>
                <div class:active on:click={removeColor}>
                    <Fa icon={faTimes} color={active ? adjustColor(hex, 100) : adjustColor(hex, 50) } size="2x"/> 
                </div>
            </Hoverable>
        {/if}
        {#if hovering && colorCount < 10}
        <div class="plusContainer" on:click={addColor}>
            <Hoverable let:hovering={active}>
            <Fa icon={faPlus} color={active ? adjustColor(hex, 100) : adjustColor(hex, 50) } size="2x"/>
            </Hoverable>
        </div>
        {/if}
        {#if hovering}
            <Hoverable let:hovering={active}>
                <div class:active on:click={copyColor}>
                    <Fa icon={faCopy} color={active ? adjustColor(hex, 100) : adjustColor(hex, 50) } size="2x"/> 
                </div>
            </Hoverable>
        {/if}
        {#if hovering || locked}
            <Hoverable let:hovering={active}>
                <div class:active on:click={toggleLocked}>
                    <Fa icon={locked ? faLock : faUnlock} color={active || locked ? adjustColor(hex, 100) : adjustColor(hex, 50) } size="2x"/> 
                </div>
            </Hoverable>
        {/if}
    </div>
    </div>
</main>

<style type="scss">
    @import url("https://fonts.googleapis.com/css?family=Raleway&display=swap");

	main {
		text-align: center;
		width: 100%;
        height: 100%;
        display: flex;
	}

    .hex {
        font-family: 'Raleway', Arial, Helvetica, sans-serif;
        color: var(--hex-color, lightgray);
        font-size: 36px;
    }

    .name {
        font-family: 'Raleway', Arial, Helvetica, sans-serif;
        font-size: 16px;
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

    .colorNames {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
    }

    .controls {
        margin: 25px auto;
        max-width: 30px;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;

        * {
            padding: 10px  0px;
        }
    }
    .colorMain {
        width: 100%;
        display: flex;
        flex-direction: column;
        
    }

</style>