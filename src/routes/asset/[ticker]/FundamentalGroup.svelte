<script lang="ts">
	import type { FundamentalFactor, Fundamentals, FundamentalsKeys, Grade } from '$lib/fundamentals';
	import { isSuccess } from '@joyautomation/dark-matter';
	import Card from './Card.svelte';
	import { fundamentalData } from './fundamentalData.svelte';

	let { key, value }: { key: string; value: Grade } = $props();
	const getGradeColor = (grade: Grade) => {
		switch (grade) {
			case 'a':
				return 'var(--grade-a)';
			case 'b':
				return 'var(--grade-b)';
			case 'c':
				return 'var(--grade-c)';
			case 'd':
				return 'var(--grade-d)';
			case 'f':
				return 'var(--grade-f)';
		}
	};
	const gradeColor = $derived(getGradeColor(value));
	const getGroupFundamentals = (fundamentals: Fundamentals) => {
		return Object.entries(fundamentals).filter(([_factorKey, factorValue]) => {
			return typeof factorValue === 'object' && factorValue.group === key;
		}) as [FundamentalsKeys, FundamentalFactor][];
	};
</script>

<div class="flex space-x-1 mb-1">
	<p class="grade" style="--grade-color: {gradeColor}">{value}</p>
	<h2>{key}</h2>
</div>
<ul>
	{#if fundamentalData.fundamentals}
		{#await fundamentalData.fundamentals then fundamentals}
			{#if isSuccess(fundamentals.fundamentals)}
				{#each getGroupFundamentals(fundamentals.fundamentals.output) as [factorKey, factorValue]}
					<li
						class="grade__pill"
						style="--grade-color: {getGradeColor(factorValue.grade || 'f')}"
						title={factorValue.description}
					>
						<p>
							{factorValue.grade}
						</p>
						<p>{factorValue.value?.toFixed(2)}</p>
						<p>{factorValue.name}</p>
						<p>{factorValue.config.direction === 'higherIsBetter' ? '↑' : '↓'}</p>
						<p>{factorValue.weight}</p>
					</li>
				{/each}
			{:else}
				{JSON.stringify(fundamentals.fundamentals.error)}
			{/if}
		{/await}
	{/if}
</ul>

<style lang="scss">
	p {
		margin: 0;
	}
	ul {
		display: flex;
		gap: var(--spacing-unit);
	}
	.grade__pill {
		& > p:first-child {
			display: flex;
			align-items: center;
			justify-content: center;
			padding: var(--spacing-unit);
			font-size: var(--text-xl);
			line-height: var(--text-xl-lh);
			font-weight: var(--font-black);
			text-transform: uppercase;
			aspect-ratio: 1;
			width: 30px;
			border-radius: var(--rounded-full);
			margin-left: 0;
		}
		& > p {
			margin-left: var(--spacing-unit);
		}
		border-radius: var(--rounded-full);
		display: flex;
		align-items: center;
		background-color: var(--grade-color);
		padding-right: calc(3 * var(--spacing-unit));
	}
	.grade {
		background-color: var(--grade-color);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: var(--spacing-unit);
		font-size: var(--text-xl);
		line-height: var(--text-xl-lh);
		font-weight: var(--font-black);
		text-transform: uppercase;
		aspect-ratio: 1;
		width: 30px;
		border-radius: var(--rounded-full);
	}
</style>
