<script lang="ts">
	import {format} from 'svelte-ux';
	import {DollarSign, CalendarDays, Landmark, CandlestickChart} from "lucide-svelte";
	import * as Card from "$lib/components/ui/card";
	export let data;
	const years = data.totals[0].ttl_years
	const quarters = data.totals[0].ttl_quarters
	const ciks = data.totals[0].ttl_ciks
	const assets = data.totals[0].ttl_assets
	const positions = data.totals[0].ttl_positions
	const last_full_qtr = data.totals[0].last_full_qtr
	const last_full_value = data.totals[0].last_full_value
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>


<div class="flex">

<div class="mx-6 flex items-center justify-center h-screen">
<span class="text-xl">
		<span class="text-chart text-8xl">Insight</span>
		<span class="text-4xl">hidden in plain</span>
		<span class="text-chart text-8xl">Sight</span>
	</span>
</div>

<div class="flex-1 grid gap-2 md:grid-cols-2 lg:grid-cols-2 m-1">
	
	<Card.Root>
		<Card.Header
			class="flex flex-row items-center justify-between space-y-0 pb-2"
		>
			<Card.Title class="text-sm font-medium">Total Years</Card.Title>
			<CalendarDays class="h-8 w-8 text-muted-foreground" />
		</Card.Header>
		<Card.Content>
			<div class="text-2xl font-bold">{years}</div>
			<p class="text-xs text-muted-foreground">{quarters} filings from 1999</p>
		</Card.Content>
	</Card.Root>
	<Card.Root>
		<Card.Header
			class="flex flex-row items-center justify-between space-y-0 pb-2"
		>
			<Card.Title class="text-sm font-medium">Superinvestors</Card.Title>
			<Landmark class="h-8 w-8 text-muted-foreground" />
		</Card.Header>
		<Card.Content>
			<div class="text-2xl font-bold">{format(ciks, "integer")}</div>
		</Card.Content>
	</Card.Root>
	<Card.Root>
		<Card.Header
			class="flex flex-row items-center justify-between space-y-0 pb-2"
		>
			<Card.Title class="text-sm font-medium">Total Value</Card.Title>
			<DollarSign class="h-8 w-8 text-muted-foreground" />
		</Card.Header>
		<Card.Content>
			<div class="text-2xl font-bold">${format(last_full_value, "metric")}</div>
			<p class="text-xs text-muted-foreground">Last full qtr: {last_full_qtr}</p>
		</Card.Content>
	</Card.Root>
	<Card.Root>
		<Card.Header
			class="flex flex-row items-center justify-between space-y-0 pb-2"
		>
			<Card.Title class="text-sm font-medium">Postions</Card.Title>
			<CandlestickChart class="h-8 w-8 text-muted-foreground" />
		</Card.Header>
		<Card.Content>
			<div class="text-2xl font-bold">{format(positions, "integer")}</div>
			<p class="text-xs text-muted-foreground">Across {years} years</p>
		</Card.Content>
	</Card.Root>
</div>
</div>

<!-- <div class="flex">
	<div class="flex-1 bg-gray-400 p-4">Div 1</div>
	<div class="flex-1 bg-gray-500 p-4">Div 2</div>
	<div class="flex-1 bg-gray-600 p-4">Div 3</div>
</div> -->