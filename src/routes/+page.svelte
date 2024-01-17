<script lang="ts">
		import {Activity,CreditCard,DollarSign,Users} from "lucide-svelte";
	import * as Card from "$lib/components/ui/card";
	export let data;
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>


<div class="flex">

<div class="mx-6 flex items-center justify-center h-screen">
<span class="text-xl">
		<span class="text-chart text-8xl">Insight</span>
		<span class="text-4xl">hidden in the plain</span>
		<span class="text-chart text-8xl">Sight</span>
	</span>
</div>

<div class="flex-1 grid gap-2 md:grid-cols-2 lg:grid-cols-2 m-1">
	
	<Card.Root>
		<Card.Header
			class="flex flex-row items-center justify-between space-y-0 pb-2"
		>
			<Card.Title class="text-sm font-medium">Total Revenue</Card.Title>
			<DollarSign class="h-4 w-4 text-muted-foreground" />
		</Card.Header>
		<Card.Content>
			<div class="text-2xl font-bold">$45,231.89</div>
			<p class="text-xs text-muted-foreground">+20.1% from last month</p>
		</Card.Content>
	</Card.Root>
	<Card.Root>
		<Card.Header
			class="flex flex-row items-center justify-between space-y-0 pb-2"
		>
			<Card.Title class="text-sm font-medium">Subscriptions</Card.Title>
			<Users class="h-4 w-4 text-muted-foreground" />
		</Card.Header>
		<Card.Content>
			<div class="text-2xl font-bold">+2350</div>
			<p class="text-xs text-muted-foreground">+180.1% from last month</p>
		</Card.Content>
	</Card.Root>
	<Card.Root>
		<Card.Header
			class="flex flex-row items-center justify-between space-y-0 pb-2"
		>
			<Card.Title class="text-sm font-medium">Sales</Card.Title>
			<CreditCard class="h-4 w-4 text-muted-foreground" />
		</Card.Header>
		<Card.Content>
			<div class="text-2xl font-bold">+12,234</div>
			<p class="text-xs text-muted-foreground">+19% from last month</p>
		</Card.Content>
	</Card.Root>
	<Card.Root>
		<Card.Header
			class="flex flex-row items-center justify-between space-y-0 pb-2"
		>
			<Card.Title class="text-sm font-medium">Active Now</Card.Title>
			<Activity class="h-4 w-4 text-muted-foreground" />
		</Card.Header>
		<Card.Content>
			<div class="text-2xl font-bold">+573</div>
			<p class="text-xs text-muted-foreground">+201 since last hour</p>
		</Card.Content>
	</Card.Root>
</div>
</div>

<!-- <div class="flex">
	<div class="flex-1 bg-gray-400 p-4">Div 1</div>
	<div class="flex-1 bg-gray-500 p-4">Div 2</div>
	<div class="flex-1 bg-gray-600 p-4">Div 3</div>
</div> -->