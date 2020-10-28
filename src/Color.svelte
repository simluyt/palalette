<script lang="ts">

    export let color: string;
    let colorInfo;
    
    $: colorInfo = fetch("https://www.thecolorapi.com/id?hex=" + color.slice(1,7), {mode: 'cors'}).then((x) => x.json());

</script>

<main class="bg" style="--bg-color:{color};">
<p>{color}</p>
{#await colorInfo}
    <p>waiting...</p>
{:then info} 
<p>{info.name.value}</p>
{/await}	
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