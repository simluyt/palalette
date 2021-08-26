<script>
	let hovering;
	export let className = "";

	function enter() {
		hovering = true;
	}

	function leave() {
		hovering = false;
	}
</script>

<div class={className} on:mouseenter={enter} on:mouseleave={leave}>
	<slot hovering={hovering}></slot>
</div>