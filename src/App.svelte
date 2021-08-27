<script lang="ts">
	import { randomColor } from 'randomcolor';
	import Color from './Color.svelte';
	import { SvelteToast } from '@zerodevx/svelte-toast'
	import { toast } from '@zerodevx/svelte-toast'
	import { Circle } from 'svelte-loading-spinners';
	import { adjustColor } from './helpers';

	interface ColorProps {
    lock: boolean;
    hex: string;
    index: number;
	}

	let colors: ColorProps[] = [];
	let colorCount = 5;

	let initColors = randomColor({'count': colorCount});
	
	initColors.forEach((color,index) => {
		colors.push({hex: color, lock:false, index: index});
	});



	function handlePress(e) {
		if(e.key === " ") {
			const newColors = randomColor({'count': colorCount});
			newColors.forEach((color, idx) => {
				if (colors[idx].lock ) {
					colors[idx].hex = color;
				}
			});
		}
	}

	function handleMessage(event) {
		if (event.detail.type === 'toggleLock') {
			colors[event.detail.index].lock = event.detail.locked;
			toast.push(`${event.detail.locked ? 'Locked' : "Unlocked"} ${event.detail.hex}`, {
        	theme: {
				'--toastBackground': '#48BB78',
				'--toastColor': adjustColor('#48BB78', 40),
				'--toastProgressBackground': '#48BB78'
			}
		})
		} else  if (event.detail.type === 'remove'){
			colorCount--;
			colors = colors.filter(item => item.index !== event.detail.index);
			toast.push('Color succesfully deleted', {
                theme: {
                    '--toastBackground': '#48BB78',
                    '--toastColor': adjustColor('#48BB78', 40),
                    '--toastProgressBackground': '#48BB78'
                }
            })
		} else  if (event.detail.type === 'add'){
			colorCount++;
			colors.splice(event.detail.index, 0, {hex: '#ffffff', lock: false, index: event.detail.index});
			let count = 0
			colors.forEach(item => {
				item.index = count;
				console.log(item)
				count++;
			})
			toast.push('Color succesfully added', {
                theme: {
                    '--toastBackground': '#48BB78',
                    '--toastColor': adjustColor('#48BB78', 40),
                    '--toastProgressBackground': '#48BB78'
                }
            })
		} else {
			navigator.clipboard.writeText(colors[event.detail.index].hex);
				toast.push('Color copied to the clipboard', {
			theme: {
				'--toastBackground': '#48BB78',
				'--toastColor': adjustColor('#48BB78', 40),
				'--toastProgressBackground': '#48BB78'
			}
		})
		}
			
	}



</script>

<svelte:window on:keypress={e => handlePress(e)} />

<main>
		{#each colors as color(color.index)}
		<Color on:message={handleMessage} hex={color.hex} locked={color.lock} index={color.index} bind:colorCount="{colorCount}" />
		{/each}
		<div class="wrap">
			<SvelteToast options={{ reversed: true, intro: { y: 120 } }} />
		</div>
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
		font-family: "Raleway", Arial, Helvetica, sans-serif;
  }
</style>