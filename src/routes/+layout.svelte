<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import '@joyautomation/salt/styles.scss';
	import '$lib/css/app.scss';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
