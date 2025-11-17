<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import * as d3 from 'd3';
	import type { AlpacaBarHistory, AlpacaBar } from '$lib/alpaca/request.ts';

	// Props
	export let data: AlpacaBarHistory;
	export let width: number = 800;
	export let height: number = 300;
	export let title: string = '';

	type Point = { date: Date; value: number };

	let container: HTMLDivElement;
	let svg: any;
	let g: any;
	let xAxisG: any;
	let yAxisG: any;
	let path: any;

	const margin = { top: 20, right: 24, bottom: 32, left: 48 };

	const getInnerSize = () => {
		const w = Math.max(0, width - margin.left - margin.right);
		const h = Math.max(0, height - margin.top - margin.bottom);
		return { w, h };
	};

	// Convert Alpaca bars into plottable points
	const toPoints = (bars: AlpacaBar[]): Point[] =>
		bars
			.map((b) => ({ date: new Date(b.t), value: b.c }))
			.filter((p) => !isNaN(p.date.getTime()) && isFinite(p.value))
			.sort((a, b) => a.date.getTime() - b.date.getTime());

	function render() {
		if (!data || !data.bars) return;
		const points = toPoints(data.bars);
		const { w, h } = getInnerSize();

		// Scales
		const x = d3
			.scaleTime()
			.domain(d3.extent(points, (d: Point) => d.date) as [Date, Date])
			.range([0, w]);

		const y = d3
			.scaleLinear()
			.domain([
				d3.min(points, (d: Point) => d.value) ?? 0,
				d3.max(points, (d: Point) => d.value) ?? 1
			])
			.nice()
			.range([h, 0]);

		// Axes
		const xAxis = d3
			.axisBottom(x)
			.ticks(6)
			.tickFormat(d3.timeFormat('%H:%M') as any);
		const yAxis = d3.axisLeft(y).ticks(6);

		xAxisG
			.attr('transform', `translate(0,${h})`)
			.transition()
			.duration(250)
			.call(xAxis as any);

		yAxisG
			.transition()
			.duration(250)
			.call(yAxis as any);

		// Line
		const line = d3
			.line()
			.x((d: Point) => x(d.date))
			.y((d: Point) => y(d.value))
			.curve(d3.curveMonotoneX);

		path
			.datum(points)
			.transition()
			.duration(300)
			.attr('d', line as any);
	}

	function initialize() {
		const { w, h } = getInnerSize();

		svg = d3
			.select(container)
			.append('svg')
			.attr('width', width)
			.attr('height', height)
			.attr('viewBox', `0 0 ${width} ${height}`)
			.attr('preserveAspectRatio', 'xMinYMin');

		g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

		// Title (optional)
		if (title) {
			svg
				.append('text')
				.attr('x', margin.left)
				.attr('y', margin.top / 1.5)
				.attr('fill', 'currentColor')
				.attr('font-size', 12)
				.attr('font-weight', 600)
				.text(title);
		}

		// Axes groups
		xAxisG = g.append('g').attr('class', 'x-axis');
		yAxisG = g.append('g').attr('class', 'y-axis');

		// Path
		path = g
			.append('path')
			.attr('fill', 'none')
			.attr('stroke', 'var(--sky-500)')
			.attr('stroke-width', 1.5)
			.attr('opacity', 0.9);

		render();
	}

	// Re-render on prop changes
	$: if (svg) {
		// Update the outer svg size in case width/height changed
		svg.attr('width', width).attr('height', height).attr('viewBox', `0 0 ${width} ${height}`);
		render();
	}

	onMount(() => {
		initialize();
	});

	onDestroy(() => {
		if (svg) svg.remove();
	});
</script>

<div class="linechart" bind:this={container} aria-label="Line chart: close price over time"></div>

<style>
	/* svelte-ignore css-unused-selector */
	.x-axis path,
	.x-axis line,
	.y-axis path,
	.y-axis line {
		stroke: var(--neutral-700);
	}

	/* svelte-ignore css-unused-selector */
	.x-axis text,
	.y-axis text {
		fill: var(--neutral-700);
		font-size: 11px;
	}
</style>
