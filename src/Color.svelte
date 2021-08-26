<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    import Fa from 'svelte-fa';
    import { faCopy, faLock, faPlusCircle, faTimes, faUnlock } from '@fortawesome/free-solid-svg-icons';
    import { Circle } from 'svelte-loading-spinners';
    import { toast } from '@zerodevx/svelte-toast'

    import Hoverable from './Hoverable.svelte';
    import { adjustColor } from './helpers';


    const dispatch = createEventDispatcher();

    export let hex: string;
    export let locked: boolean;
    export let index: number;

    //fetch color name
    let colorInfo;
    $: colorInfo = fetch("https://www.thecolorapi.com/id?hex=" + hex.slice(1,7), {mode: 'cors'}).then((x) => x.json());


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
        if (!locked) {
            toast.push('Color succesfully deleted', {
                theme: {
                    '--toastBackground': '#48BB78',
                    '--toastColor': adjustColor('#48BB78', 40),
                    '--toastProgressBackground': '#48BB78'
                }
            })
		    dispatch('message', {
                index: index,
                type: 'remove',
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
    <aside class="colorSide" />
    <div class="colorMain">
    <h2 class="hex">{hex.slice(1,7).toUpperCase()}</h2>
    {#await colorInfo}
    <div class="loader">
        <Circle size="13" color={adjustColor(hex, 30)} unit="px" duration="0.5s"></Circle>
    </div>
    {:then info} 
    <p class="name">{info.name.value}</p>
    {/await}
    
    <div class="controls">
        {#if hovering}
        <Hoverable let:hovering={active}>
        <div class:active on:click={removeColor}>
            <Fa icon={faTimes} color={active ? adjustColor(hex, 100) : adjustColor(hex, 50) } size="2x"/> 
        </div>
        </Hoverable>
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
    <Hoverable className=colorSide let:hovering={show}>
        <div class="plusContainer" on:click={addColor}>
            <div class="plusButton">
                <Fa icon={faPlusCircle} color={show ? adjustColor(hex, 100) : adjustColor(hex, 50) } size="2x"/> 
            </div>
        </div>
    </Hoverable>
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
    .colorMain {
        width: 80%;
    }

    .colorSide {
        height: 100%;
        width: 10%;
        display: flex;
        flex-direction: column;
        justify-content: stretch;
    }

    .plusContainer {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .plusButton {
        position: relative;
        margin-left: 68%;
    }
</style>