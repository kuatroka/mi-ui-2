<script lang="ts">
	import {Activity,CreditCard,DollarSign,
			Landmark,Users, CalendarDays, CandlestickChart,
			Maximize2, Maximize} from "lucide-svelte";
	import * as Card from "$lib/components/ui/card";
	import * as Tabs from "$lib/components/ui/tabs";
	import { Switch } from "$lib/components/ui/switch";
	import { Toggle } from "$lib/components/ui/toggle";
	import { Label } from "$lib/components/ui/label";
	import { Button } from "$lib/components/ui/button";
	
	import {format} from 'svelte-ux';

	import {Overview, RecentSales	} from "$lib/components/dashboard";
	import AreaClipped from "$lib/components/layerchart/area-simple/area-clipped-tooltip.svelte";
	import Bar from '$lib/components/layerchart/bar/bar.svelte'

	import DataTable from "$lib/components/datatable-sup-overview/data-table.svelte";
	export let data;
	$: entries_cik = data.ciks;

	let original_qtrstats = data.qtrStats; // Store the original data

    let entries_qtrstats = original_qtrstats; // This will be modified based on the toggle
    let showIncomple = false; // State for the toggle

	function handleCheckedChange(event: CustomEvent<boolean>) {
    showIncomple = event.detail;
}

	$: if (showIncomple) {
		entries_qtrstats = original_qtrstats;
	} else {
        entries_qtrstats = original_qtrstats.filter(entry => entry.is_quarter_completed == 'YES');
    }
	
	$: entries_qtrstats_chart = entries_qtrstats.map(entry => ({
			date: new Date(entry.quarter_end_date),
			value: entry.ttl_value_all_ciks_per_qtr,
			assets: entry.ttl_num_assets_all_ciks_per_qtr,
			ciks: entry.ttl_num_ciks_per_qtr,
			positions: entry.ttl_num_positions_per_qtr
	}));

	let isCardExpanded = false;

    function toggleCardSize() {
        isCardExpanded = !isCardExpanded;
    }



	


</script>

<!-- showCompleted: {entries_qtrstats_chart} -->

<!-- {#each entries_qtrstats_chart.reverse().slice(0, 5) as entry}
<p>{entry.date} : {entry.value} </p>

{/each} -->

<!-- {#each entries_qtrstats.slice(0, 5) as entry}
<p>{entry.date} : {entry.value} </p>

{/each} -->

<svelte:head>
	<title>Superinvestors</title>
</svelte:head>

<div class="hidden flex-col md:flex">
	<div class="flex-1 space-y-2 p-2">
		<div class="flex items-center justify-between space-y-2">
			<h2 class="text-3xl font-bold tracking-tight">All Superinvestors</h2>

			
			<div class="flex flex-col items-center space-y-2">
				<Toggle
				bind:pressed={showIncomple}
				aria-label="toggle completed quarters"
				>
				<!-- onPressedChange={handleCheckedChange} -->
				Show Incomplete Qtr
				</Toggle>

				<div class="flex items-center gap-2">
					<Switch 
					id="add-partial-qtr"
					class="ml-auto"
					bind:checked={showIncomple}
					>
					<!-- onCheckedChange={handleCheckedChange} -->
				</Switch>
				<Label for="add-partial-qtr">Show partial Qtr</Label>
			</div>
		</div>
		</div>

		<Tabs.Root value="overview" class="space-y-2">
			<div class="flex items-center gap-2">
				<Tabs.List>
					<Tabs.Trigger value="overview">Overview</Tabs.Trigger>
					<Tabs.Trigger value="analytics">Analytics</Tabs.Trigger>
					<Tabs.Trigger value="reports" disabled>Reports</Tabs.Trigger>
					<Tabs.Trigger value="notifications" disabled>Notifications</Tabs.Trigger>
				</Tabs.List>


			</div>
			<Tabs.Content value="overview" class="space-y-2">
				<div class="grid gap-2 md:grid-cols-2 lg:grid-cols-4">
					<Card.Root>
						<Card.Header
							class="flex flex-row items-center justify-between space-y-0 pb-2"
						>
							<Card.Title class="text-sm font-medium">Value</Card.Title>
							<DollarSign class="h-8 w-8 text-muted-foreground" />
						</Card.Header>
						<Card.Content>
							<div class="text-2xl font-bold">${format(data.totals[0].last_full_value, "metric")}</div>
							<p class="text-xs text-muted-foreground">Last complete quarter: {data.totals[0].last_full_qtr}</p>
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
							<div class="text-2xl font-bold">{format(data.totals[0].ttl_ciks, "integer")}</div>
						</Card.Content>
					</Card.Root>
					<Card.Root>
						<Card.Header
							class="flex flex-row items-center justify-between space-y-0 pb-2"
						>
							<Card.Title class="text-sm font-medium">Years</Card.Title>
							<CalendarDays class="h-8 w-8 text-muted-foreground" />
						</Card.Header>
						<Card.Content>
							<div class="text-2xl font-bold">{data.totals[0].ttl_years}</div>
							<p class="text-xs text-muted-foreground">{data.totals[0].ttl_quarters} filed quarters from 1999</p>
						</Card.Content>
					</Card.Root>
					<Card.Root>
						<Card.Header
							class="flex flex-row items-center justify-between space-y-0 pb-2"
						>
							<Card.Title class="text-sm font-medium">Assets</Card.Title>
							<CandlestickChart class="h-8 w-8 text-muted-foreground" />
						</Card.Header>
						<Card.Content>
							<div class="text-2xl font-bold">{format(data.totals[0].ttl_assets, "integer")}</div>
							<p class="text-xs text-muted-foreground">Held in {format(data.totals[0].ttl_positions, "integer")} Positions</p>
						</Card.Content>
					</Card.Root>
				</div>
				<div class="grid gap-2 md:grid-cols-2 lg:grid-cols-7">
					<Card.Root class={isCardExpanded ? 'col-span-7' : 'col-span-4'}>
						<Tabs.Root>
							<Tabs.List class='w-full flex'>
								<Tabs.Trigger class="flex-grow text-center" value="performance">Performance</Tabs.Trigger>
								<Tabs.Trigger class="flex-grow text-center" value="value">Value</Tabs.Trigger>
								<Tabs.Trigger class="flex-grow text-center" value="superinvestors">Superinvestors</Tabs.Trigger>
								<Tabs.Trigger class="flex-grow text-center" value="assets">Assets</Tabs.Trigger>
								<Tabs.Trigger class="flex-grow text-center" value="positions">Positions</Tabs.Trigger>
							</Tabs.List>

							<Tabs.Content value="performance" class="space-y-2">
								<!-- <Card.Header>
									<Card.Title>Overview</Card.Title>
								</Card.Header> -->
								<Card.Content class="min-h-[450px]">
										<DataTable data={entries_cik}/>
									<!-- <AreaSimple /> -->
								</Card.Content>								
							</Tabs.Content>

							<Tabs.Content value="value" class="space-y-2">
								<Card.Content class="min-h-[450px]">

									<AreaClipped  data={entries_qtrstats_chart} y='value'/>	
									<!-- <Button class="m-1"
									on:click={toggleCardSize}
									>
									<Maximize />
									</Button>							 -->
								</Card.Content>
							</Tabs.Content>
							
							
							<Tabs.Content value="superinvestors" class="space-y-2">								
								<Card.Content class="min-h-[450px]">
									
									<Bar data={entries_qtrstats_chart} y='ciks'/>								
								</Card.Content>
							</Tabs.Content>
							<Tabs.Content value="assets" class="space-y-2">	
								<Card.Content class="min-h-[450px]">
	
									<Bar data={entries_qtrstats_chart} y='assets'/>								
								</Card.Content>
							</Tabs.Content>

							<Tabs.Content value="positions" class="space-y-2">								
								<Card.Content class="min-h-[450px]">
	
									<Bar data={entries_qtrstats_chart} y='positions'/>								
								</Card.Content>
								
							</Tabs.Content>

						</Tabs.Root>
					</Card.Root>
					<Card.Root class="col-span-3">
						<Card.Header>
							<Card.Title>Recent Sales</Card.Title>
							<Card.Description>You made 265 sales this month.</Card.Description>
						</Card.Header>
						<Card.Content>
							<RecentSales />
						</Card.Content>
					</Card.Root>
				</div>
				<div class="grid gap-2 md:grid-cols-2 lg:grid-cols-7">
					<Card.Root class="col-span-4">
						<Card.Header>
							<Card.Title>Value</Card.Title>

						</Card.Header>
						<Card.Content>
							<AreaClipped  data={entries_qtrstats_chart}/>
							
							<!-- <AreaClipped /> -->
						</Card.Content>
					</Card.Root>
					<!-- <Card.Root class="col-span-3">
						<Card.Header>
							<Card.Title>Recent Sales</Card.Title>
							<Card.Description>You made 265 sales this month.</Card.Description>
						</Card.Header>
						<Card.Content>
							<RecentSales />
						</Card.Content>
					</Card.Root> -->
				</div>
			</Tabs.Content>
			<Tabs.Content value="analytics" class="space-y-2">
				<div class="grid gap-2 md:grid-cols-2 lg:grid-cols-4">
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
				<div class="grid gap-2 md:grid-cols-2 lg:grid-cols-7">
					<Card.Root class="col-span-4">
						<Card.Header>
							<Card.Title>Overview</Card.Title>
						</Card.Header>
						<Card.Content>
							<Overview />
						</Card.Content>
					</Card.Root>
					<Card.Root class="col-span-3">
						<Card.Header>
							<Card.Title>Recent Sales</Card.Title>
							<Card.Description>You made 265 sales this month.</Card.Description>
						</Card.Header>
						<Card.Content>
							<RecentSales />
						</Card.Content>
					</Card.Root>
				</div>
				<div class="grid gap-2 md:grid-cols-2 lg:grid-cols-7">
					<Card.Root class="col-span-4">
						<Card.Header>
							<Card.Title>Overview</Card.Title>
						</Card.Header>
						<Card.Content>
							<Overview />
						</Card.Content>
					</Card.Root>
					<Card.Root class="col-span-3">
						<Card.Header>
							<Card.Title>Recent Sales</Card.Title>
							<Card.Description>You made 265 sales this month.</Card.Description>
						</Card.Header>
						<Card.Content>
							<RecentSales />
						</Card.Content>
					</Card.Root>
				</div>
			</Tabs.Content>
		</Tabs.Root>
	</div>
</div>
