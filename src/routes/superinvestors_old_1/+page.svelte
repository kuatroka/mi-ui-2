<script lang="ts">
	import {page} from '$app/stores'
	// import {Activity,CreditCard,DollarSign,
	// 		Landmark,Users, CalendarDays, CandlestickChart,
	// 		Maximize2, Maximize} from "lucide-svelte";

	import MdiCurrencyUsdCircleOutline from 'virtual:icons/mdi/currency-usd-circle-outline'
	import MdiBank from 'virtual:icons/mdi/bank'
	import MdiCalendarClockOutline from '~icons/mdi/calendar-clock-outline'
	import MdiTrendingUp from '~icons/mdi/trending-up'
	import MdiCreditCard from '~icons/mdi/credit-card'
	import MdiAccountSupervisor from '~icons/mdi/account-supervisor'

	import { ActivityLog } from "radix-icons-svelte";
	import ObservablePlot from "$lib/components/observableplot/observablePlot.svelte"

	import * as Card from "$lib/components/ui/card";
	import * as Tabs from "$lib/components/ui/tabs";
	import { Switch } from "$lib/components/ui/switch";
	import { Toggle } from "$lib/components/ui/toggle";
	import { Label } from "$lib/components/ui/label";
	import { Button } from "$lib/components/ui/button";
	import * as ToggleGroup from "$lib/components/ui/toggle-group";
	import {Range} from 'flowbite-svelte'
	
	import {format, ButtonGroup, Button as ButtonUx, PeriodType} from 'svelte-ux';
	
	import { pivotLonger}  from 'layerchart';
	// import { createDateSeries } from 'layerchart/utils/genData';
    import { flatGroup } from 'd3-array';

	import {Overview, RecentSales	} from "$lib/components/dashboard";
	import AreaClipped from "$lib/components/layerchart/area-simple/area-clipped-tooltip.svelte";
	import Bar from '$lib/components/layerchart/bar/bar.svelte'
	import Line from "$lib/components/layerchart/line/line.svelte"
	import MultiLine from "$lib/components/layerchart/line/line-multiseries.svelte"

	import DataTable from "$lib/components/datatable-sup-overview/data-table.svelte";
	import * as Plot from "@observablehq/plot";

	export let data;

	$: ({top_10_ciks_twrr_yahoo, top_10_ciks_value, quarters,  } = data)
    let quarter_id = parseInt($page.url.searchParams.get('quarter_id') || data.quarter_id.toString());

	$: entries_totals = data.totals;


	$: entries_for_table = data.ciks;

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

	let test = entries_qtrstats.map(entry => ({
            date: new Date(entry.quarter_end_date),
            value: entry.ttl_value_all_ciks_per_qtr,
        }));
	

	let entries_qtrstats_chart: any[]= []; 
    let entries_ciks: any[]= []; 
    let entries_positions: any[]= []; 
    let entries_cusips: any[]= []; 


	$: {
        entries_qtrstats_chart = entries_qtrstats.map(entry => ({
            date: new Date(entry.quarter_end_date),
            value: entry.ttl_value_all_ciks_per_qtr,
			qtr_return_yahoo: entry.qtr_return_yahoo,
			compound_return_yahoo: entry.compound_return_yahoo
        }));

        entries_ciks = entries_qtrstats.slice(1).map(entry => ({
            date: new Date(entry.quarter_end_date),
			quarter: entry.quarter,
            closed_ciks: entry.num_stopped_ciks ?? 0,
            new_ciks: entry.num_new_ciks ?? 0,
			ciks: entry.ttl_num_ciks_per_qtr,
			ratio_new_stopped_ciks: entry.ratio_new_stopped_ciks
        }));

        entries_positions = entries_qtrstats.slice(1).map(entry => ({
            date: new Date(entry.quarter_end_date),
			quarter: entry.quarter,
            positions: entry.ttl_num_positions_per_qtr,
			open_positions: entry.open_positions_per_qtr,
			close_positions: entry.close_positions_per_qtr,
            open_close: entry.open_close_ratio,
        }));

        entries_cusips = entries_qtrstats.map(entry => ({
            date: new Date(entry.quarter_end_date),
			quarter: entry.quarter,
            ratio_new_stopped_cusips: entry.ratio_new_stopped_cusips,
			assets: entry.ttl_num_assets_all_ciks_per_qtr,
			num_stopped_cusips: entry.num_stopped_cusips,
			num_new_cusips: entry.num_new_cusips
        }));
	};



	
	$: cusip_ratio_max = Math.max(...entries_cusips.map(item => item.ratio_new_stopped_cusips));
	$: cusip_ratio_min = -cusip_ratio_max;
	let showRule = true;
  	let ruleClass = 'stroke-2 stroke-rose-400 [stroke-dasharray:4] [stroke-linecap:round]';


	let series_columns = ['closed_ciks', 'new_ciks'];
    let metric_column = 'value'
    let category = 'type';
    let series_colours = ['var(--color-rose-400)', 'var(--color-emerald-500'];

    let categoryColours: Record<string, string> = {};
    series_columns.forEach((column, index) => {
						categoryColours[column] = series_colours[index];
						});


    let multiSeriesFlatData: any[]= [];
    let dataByCategory: any[]= [];
    $: { multiSeriesFlatData = pivotLonger(entries_ciks, series_columns, category, metric_column);
        dataByCategory = flatGroup(multiSeriesFlatData, (d) => d[category]);
    }

	let isCardExpanded = false;

    function toggleCardSize() {
        isCardExpanded = !isCardExpanded;
    };

	let tabTitles: Record<string, string> = {
    'total': 'Number of All Positions',
    'ratio_oc_positions': 'Ratio of Opened vs Closed Positions',
};
	

let activeTab = 'total';
function handleTabClick(event: CustomEvent<string>) {
	activeTab = event.detail;
};

////////////////////////////////////////////// Tabs for Top 10
let activeTab_top_ten = 'return';
function handleTabClick_top_ten(event: CustomEvent<string>) {
	activeTab_top_ten = event.detail;
};

let tabTitles_top_ten: Record<string, string> = {
	'value': 'Top 10 by',
	'return': 'Top 10 by',
};
//////////////////////////////////////////////

////////////////////////////////////////////// Tabs for Value Assets  Positions
let activeTab_value_ass_pos = 'value';
function handleTabClick_value_ass_pos(event: CustomEvent<string>) {
	activeTab_value_ass_pos = event.detail;
};

let tabTitles_value_ass_pos: Record<string, string> = {
	'value': 'Total Value ($)',
	'ciks': '# of Unique Investors',
	'assets': '# of Unique Assets',
	'positions': '# of Positions',
};
//////////////////////////////////////////////
// $: last_load_date = entries_totals[0]?.last_load_date;

// const last_load_date = entries_totals[0]?.last_load_date
$: last_load_date = entries_totals[0]?.last_load_date ? new Date(entries_totals[0].last_load_date.split(' ')[0]) : null;
$: console.log(last_load_date);
// Get the current date
// let  currentDate = last_load_date;
// let currentDate = new Date('2024-05-01');
let currentDate = new Date();

// Calculate the end of the previous calendar quarter
let quarter = Math.floor((currentDate.getMonth() / 3));
let lastQuarterEnd = new Date(currentDate.getFullYear(), quarter * 3, 0);

// Add 45 days to the end of the previous quarter
let lastReportingDate = new Date(lastQuarterEnd);
lastReportingDate.setDate(lastReportingDate.getDate() + 45);

// Calculate the difference in days between current date and last reporting date
let timeDifference = lastReportingDate.getDate() - currentDate.getDate();
let daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));

// console.log(date);
// console.log(new Date(last_load_date));
console.log(lastReportingDate, currentDate, timeDifference);

let topCikValueOptions = {
	marginLeft: 100,
	marks: [
    // Plot.ruleY([40, 60, 180]),
    Plot.ruleY([0]),
    Plot.areaY(test, {x: "date", y: "value", fillOpacity: 0.2}),
    Plot.lineY(test, {x: "date", y: "value", 
	tip: {fill: 'var(--color-emerald-500)', fontSize: 12}
})
  ]     
    };

$: optionsTopTenTwrrYahoo = 
		{
		width: 1500,
		height: 400,
		marginLeft: 2,
		marginTop: 0,
		x: {label: "Cumulative Return (%)"},
		marks: [

			Plot.barX(top_10_ciks_twrr_yahoo, {x: "cum_twrr_yahoo", y: "cik_name", fill: 'var(--chart-observable)', sort: {y: "x", reverse: true},
			channels: { cik: 'cik', Superinvestor: "cik_name" },
			tip: {fill: 'var(--chart-foreground-observable)', fontSize: 12, stroke: 'black'},
			// stroke: 'var(--chart-foreground-observable)'
		 },	),
			Plot.axisY({
			label: null,
			textAnchor: "start",
			lineWidth: 20,
			fill: 'white',
			dx: 14,
			tickSize: 0,
			
			}),
		]
		};

$: optionsTopTenValue = 
	{
		width: 1500,
		height: 400,
		marginLeft: 10,
		marginTop: 0,
	x: {
		label: "Value ($)", 
		tickFormat: (d:any) => d >= 1_000_000_000_000 ? `${(d / 1_000_000_000_000).toFixed(2)} T` : `${Math.floor(d / 1_000_000_000)} B`
},
marks: [
	// Plot.tickY(top_10_ciks, {marker: "circle"}),
		// Plot.ruleX([0]),
		Plot.barX(top_10_ciks_value, {x: "value", y: "cik_name",  fill: 'var(--chart-observable)', sort: {y: "x", reverse: true},

		channels: { cik: 'cik', Superinvestor: "cik_name" },
		tip: {fill: 'var(--chart-foreground-observable)', fontSize: 12}, }),
		Plot.axisY({
		label: null,
		textAnchor: "start",
		fill: 'white',
		dx: 14,
		tickSize: 0,
		// stroke: 'white'
		}),
	]
};

$: optionsQtrReturn ={
	height: 400,
		marginLeft: 20,
		marginTop: 10,
			// grid: true,
			// color: {
			// 	type: "diverging",
			// 	scheme: "BuRd"
			// },
			y: {label: "%", },
			marks: [
				Plot.ruleY([0]),
				Plot.lineY(entries_qtrstats_chart, {x: "date", y: "qtr_return_yahoo",  stroke: 'var(--chart-observable)',
			tip: {fill: 'var(--chart-foreground-observable)', fontSize: 12, stroke: 'black'}}),
			// 	Plot.lineY(entries_qtrstats_chart, {x: "date", y: "compound_return_yahoo",  stroke: 'orange',
			// tip: {fill: 'var(--chart-foreground-observable)', fontSize: 12, stroke: 'black'}}),
			],						
			};


$: optionsCikNewStopped ={
	width: 1500,
		height: 400,
		marginLeft: 20,
		marginTop: 10,
		y: {label: "Ratio", },
	// x: { interval: 'year' },
marks: [
	Plot.ruleY([1]),
	Plot.lineY(entries_ciks.slice(2), {x: "date", y: "ratio_new_stopped_ciks",  stroke: 'var(--chart-observable)',
	channels: { "New": 'new_ciks', "Closed": "closed_ciks", "Ratio - New vs. Closed": "ratio_new_stopped_ciks", Quarter: "quarter" },
tip: {fill: 'var(--chart-foreground-observable)', fontSize: 12, stroke: 'black'}},
),
],
};

$: optionsCusipsNewStopped ={
	width: 1500,
		height: 400,
		marginLeft: 25,
		marginTop: 20,
		y: {label: "Ratio", },
	// x: { interval: 'year' },
marks: [
	Plot.ruleY([1]),
	Plot.lineY(entries_cusips, {x: "date", y: "ratio_new_stopped_cusips",  stroke: 'var(--chart-observable)',
	channels: { "New": 'num_new_cusips', "Closed": "num_stopped_cusips", "Ratio - New vs. Closed": "ratio_new_stopped_cusips", Quarter: "quarter" },
tip: {fill: 'var(--chart-foreground-observable)', fontSize: 12, stroke: 'black'}},
),
],
};

$: optionsPositionsOpenClose ={
	width: 1500,
		height: 400,
		marginLeft: 25,
		marginTop: 20,
		y: {label: "Ratio", },
	// x: { interval: 'year' },
marks: [
	Plot.ruleY([1]),
	Plot.lineY(entries_positions.slice(1), {x: "date", y: "open_close",  stroke: 'var(--chart-observable)',
	channels: { "Open": 'open_positions', "Closed": "close_positions", "Ratio - Open vs. Closed": "open_close", Quarter: "quarter" },
tip: {fill: 'var(--chart-foreground-observable)', fontSize: 12, stroke: 'black'}},
),
],
};




let isActive = false;


</script>

<!-- <pre>{JSON.stringify(currentDate, null, 2)}</pre> -->
<!-- showCompleted: {entries_qtrstats_chart} -->

<!-- {#each entries_totals as entry}
<p>{entry.last_load_date.toString()} </p>
{/each} -->

<svelte:head>
	<title>Superinvestors</title>
</svelte:head>

<div class="hidden flex-col md:flex">
	<div class="flex-1 space-y-2 p-2">
		<div class="flex items-center justify-between space-y-2">
			<!-- <h2 class="text-3xl font-bold tracking-tight">All Superinvestors</h2> -->
			
			<div class="flex flex-col items-center space-y-2">

		</div>
		</div>

		<Tabs.Root value="overview" class="space-y-2">
			<div class="flex items-center gap-2 text-md font-medium">
				<Tabs.List >
					<Tabs.Trigger value="overview" class="text-md font-bold">Overview</Tabs.Trigger>
					<Tabs.Trigger value="analytics" class="text-md font-bold">Analytics</Tabs.Trigger>
					<Tabs.Trigger value="reports" disabled class="text-md font-bold">Reports</Tabs.Trigger>
					<Tabs.Trigger value="notifications" disabled class="text-md font-bold">Notifications</Tabs.Trigger>
				</Tabs.List>


			</div>
			<Tabs.Content value="overview" class="space-y-2">
				<div class="grid gap-2 md:grid-cols-2 lg:grid-cols-6">
					<Card.Root >
						<Card.Header
							class="flex flex-row items-center justify-between space-y-0 pb-2"
						>
							<Card.Title class="text-sm font-medium">Value</Card.Title>
							<MdiCurrencyUsdCircleOutline class="h-6 w-6 text-muted-foreground" />
						</Card.Header>
						<Card.Content>
							<div class="text-2xl font-bold">${format(data.totals[0].last_full_value, "metric")}</div>
							<p class="text-xs text-muted-foreground">Last Full Qtr: {data.totals[0].last_full_qtr}</p>
						</Card.Content>
					</Card.Root>

					<Card.Root >
						<Card.Header
							class="flex flex-row items-center justify-between space-y-0 pb-2"
						>
							<Card.Title class="text-sm font-medium">Superinvestors</Card.Title>
							<MdiBank class="h-6 w-6 text-muted-foreground" />
						</Card.Header>
						<Card.Content>
							<div class="text-2xl font-bold">{format(data.totals[0].ttl_ciks, "integer")}</div>
						</Card.Content>
					</Card.Root>

					<Card.Root >
						<Card.Header
							class="flex flex-row items-center justify-between space-y-0 pb-2"
						>
							<Card.Title class="text-sm font-medium">Years</Card.Title>
							<MdiCalendarClockOutline class="h-6 w-6 text-muted-foreground" />
						</Card.Header>
						<Card.Content>
							<div class="text-2xl font-bold">{data.totals[0].ttl_years}</div>
							<p class="text-xs text-muted-foreground">{data.totals[0].ttl_quarters} filed quarters from 1999</p>
						</Card.Content>
					</Card.Root>

					<Card.Root >
						<Card.Header
							class="flex flex-row items-center justify-between space-y-0 pb-2"
						>
							<Card.Title class="text-sm font-medium">Assets</Card.Title>
							<MdiTrendingUp class="h-6 w-6 text-muted-foreground" />
						</Card.Header>
						<Card.Content>
							<div class="text-2xl font-bold">{format(data.totals[0].ttl_assets, "integer")}</div>
							<p class="text-xs text-muted-foreground">Held in {format(data.totals[0].ttl_positions, "integer")} Positions</p>
						</Card.Content>
					</Card.Root>

					<Card.Root >
						<Card.Header
							class="flex flex-row items-center justify-between space-y-0 pb-2"
						>
							<Card.Title class="text-sm font-medium">Compound Return</Card.Title>
							<MdiCurrencyUsdCircleOutline class="h-6 w-6 text-muted-foreground" />
						</Card.Header>
						<Card.Content>
							<div class="text-xl font-bold">{format(data.totals[0].last_compound_twrr, "decimal")}%</div>
							<!-- <p class="text-xs text-muted-foreground">Compound</p> -->
							<!-- <div class="text-xl font-bold"> Quaterly: {format(data.totals[0].last_curr_twrr, "decimal")}%</div> -->
							<p class="text-xs text-muted-foreground">Last Full Qtr Return: {format(data.totals[0].last_curr_twrr, "decimal")}%</p>
						</Card.Content>
					</Card.Root>


					<Card.Root>

						<Card.Content class="flex self-center mt-5">

							<div class="flex items-center">
							<ul class="timeline timeline-vertical [--timeline-col-start:rem]">
								<ul class="timeline timeline-vertical [--timeline-col-start:6rem]">
									<li>
										<div class="timeline-start tracking-tight text-sm font-medium">{currentDate?.toLocaleDateString('en-US', {year: 'numeric', month: 'short', day: 'numeric'})}</div>
										<div class="timeline-middle">
											<svg  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" 
											fill="currentColor" 
											class="w-5 h-5"><path 
											fill-rule="evenodd" 
											d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" /></svg>
										</div>
										<div class="timeline-end timeline-box bg-background tracking-tight text-sm font-medium" style="padding: 6px;">Data Load</div>
										<hr/>
									</li>
						
	
							<li>
								{#if entries_totals.at(0)?.incomplete_qtr}
									<hr/>
									<div class="timeline-start tracking-tight text-sm font-medium">{entries_totals.at(0)?.incomplete_qtr}</div>
									<div class="timeline-middle">
										<svg  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" 
										fill="currentColor" 
										class="w-5 h-5"><path 
										fill-rule="evenodd" 
										d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" /></svg>
									</div>
									<div class="timeline-end timeline-box bg-background flex items-center tracking-tight text-sm font-medium" style="padding: 6px;">
										{#if Math.abs(timeDifference) === 0}
											In Progress - Last day
										{:else}
											In Progress ({Math.abs(timeDifference)} days left)
										{/if}
											
											<Switch 
											id="add-partial-qtr"
											class="ml-auto mx-1"
											bind:checked={showIncomple}
											>
											</Switch>												
										</div>
		
										<hr/>									
										{/if}
	
							</li>
							<li>
								<hr/>
								<div class="timeline-start tracking-tight text-sm font-medium">{entries_totals.at(0)?.last_full_qtr}</div>
								<div class="timeline-middle">
									<svg  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" 
									fill="currentColor" 
									class="w-5 h-5"><path 
									fill-rule="evenodd" 
									d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" /></svg>
								</div>
								<div class="timeline-end timeline-box bg-background tracking-tight text-sm font-medium" style="padding: 6px;">Last Full Qtr</div>
							</li>
							</ul>		
							</div>
						</Card.Content>
					</Card.Root>

				</div>

				<div class="grid gap-2 md:grid-cols-2 lg:grid-cols-7">
					<!-- /////////////////////////////////////////////////////// Card - multiple tabs with table /////////////////////////////////////////////////////// -->		
					<Card.Root class={isCardExpanded ? 'col-span-7' : 'col-span-4'}>
						<Tabs.Root>
							<Tabs.List class=' flex mt-2 mx-6'>
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
								<Card.Content class="max-h-[400px]">
										<DataTable data={entries_for_table}/>
									<!-- <AreaSimple /> -->
								</Card.Content>								
							</Tabs.Content>

							<Tabs.Content value="value" class="space-y-2">
								<Card.Content >
									<div class="h-[400px] p-4 border rounded group">
										<AreaClipped  data={entries_qtrstats_chart} y='value'/>	
									</div>
									<!-- <Button class="m-1"
									on:click={toggleCardSize}
									>
									<Maximize />
									</Button>							 -->
								</Card.Content>
							</Tabs.Content>	
							
							<Tabs.Content value="superinvestors" class="space-y-2">								
								<Card.Content >
									<Tabs.Root>
										<div class="flex items-center justify-center gap-2">
				
											<Tabs.List>
												<Tabs.Trigger class="flex-grow text-center" value="totals">Total</Tabs.Trigger>
												<Tabs.Trigger class="flex-grow text-center" value="new_closed">New/Closed</Tabs.Trigger>
											</Tabs.List>
										</div>
				
										<Tabs.Content value="totals" class="space-y-2">
											<Card.Content >
												<div class="h-[400px] p-4 border rounded group">
													<Bar data={entries_ciks} y='ciks'/>								
												</div>
											</Card.Content>								
										</Tabs.Content>

										<Tabs.Content value="new_closed" class="space-y-2">
											<Card.Content >
													<!-- <Line data={entries_qtrstats_chart} y='open_close'	/>	 -->
													<div class="h-[350px] p-4 border rounded group">

														<MultiLine
														{categoryColours}
														{multiSeriesFlatData}
														{dataByCategory}
														{series_columns}
														/>							
													</div>
											</Card.Content>								
										</Tabs.Content>
				
									</Tabs.Root>					
								</Card.Content>
							</Tabs.Content>


							<Tabs.Content value="assets" class="space-y-2">								
								<Card.Content>
									<Tabs.Root>
										<div class="flex items-center justify-center gap-2">
				
											<Tabs.List>
												<Tabs.Trigger class="flex-grow text-center" value="totals">Total</Tabs.Trigger>
												<Tabs.Trigger class="flex-grow text-center" value="new_closed">Started/Stopped Trading</Tabs.Trigger>
											</Tabs.List>
										</div>
				
										<Tabs.Content value="totals" class="space-y-2">
											<Card.Content >
												<div class="h-[350px] p-4 border rounded group">
													<AreaClipped  data={entries_cusips} y='assets'/>								
												</div>
											</Card.Content>								
										</Tabs.Content>

										<Tabs.Content value="new_closed" class="space-y-2">
											<Card.Content >
												<div class="h-[350px] p-4 border rounded group">

													<Line 
													data={entries_cusips} 
													y='ratio_new_stopped_cusips'
													minValue={cusip_ratio_min}
													maxValue={cusip_ratio_max}
													{showRule}
													{ruleClass}
													/>							
												</div>
											</Card.Content>								
										</Tabs.Content>
				
									</Tabs.Root>					
								</Card.Content>
							</Tabs.Content>
							

							<Tabs.Content value="positions" class="space-y-2">								
								<Card.Content class="h-[360px]">
									<Tabs.Root bind:value={activeTab}>
										
										<div class="flex items-center justify-between gap-2">
											<h3 class="font-semibold leading-none tracking-tight">{tabTitles[activeTab]}</h3>
											<Tabs.List>
												<Tabs.Trigger class="flex-grow text-center" value="total">Total</Tabs.Trigger>
												<Tabs.Trigger class="flex-grow text-center" value="ratio_oc_positions">Ratio</Tabs.Trigger>
											</Tabs.List>
										</div>
										<Tabs.Content value="total" class="space-y-2 ">
											<Card.Content >
												<div class="h-[350px] p-4 border rounded group">
													<!-- <Bar data={entries_qtrstats_chart} y='positions'/>	 -->
													<AreaClipped  data={entries_positions} y='positions'/>							
												</div>
											</Card.Content>								
										</Tabs.Content>
										
										<Tabs.Content value="ratio_oc_positions" class="space-y-2">
											<Card.Content >
												<div class="h-[350px] p-4 border rounded group">
													<Line data={entries_positions} y='open_close'	/>								
												</div>
											</Card.Content>								
										</Tabs.Content>
				
									</Tabs.Root>					
								</Card.Content>
							</Tabs.Content>

						</Tabs.Root>
					</Card.Root>



					<Card.Root class="col-span-3">
						<Tabs.Root bind:value={activeTab_top_ten}>
										
							<div class="flex items-center justify-between mt-2">
								<h3 class="text-xl pl-4 pr-1 font-semibold leading-none tracking-tight">{tabTitles_top_ten[activeTab_top_ten]}</h3>
								<div class="mr-2">
									<Tabs.List>
										<Tabs.Trigger class="flex-grow text-center font-bold" value="return">Return</Tabs.Trigger>
										<Tabs.Trigger class="flex-grow text-center font-bold" value="value">Value</Tabs.Trigger>
									</Tabs.List>
								</div>
								
								<div class="flex items-center gap-2 flex-grow">
									<form data-sveltekit-keepfocus data-sveltekit-noscroll class="flex items-center flex-grow">
										<input type="range" name="quarter_id"
											min="0" 
											max={quarters.length -  1} 
											bind:value={quarter_id}
											on:change={e=>e.currentTarget.form?.requestSubmit()}
											class="w-full"											
											style="accent-color: #b09d4f;">
									</form>
									<h3 class="text-xl font-semibold leading-none tracking-tight text-chart flex-shrink-0" style="width: 100px;">{quarters[+quarter_id]}</h3>
								</div>

							</div>
							
							<Tabs.Content value="value" class="space-y-2 ">
								<Card.Content>
									<ObservablePlot options={optionsTopTenValue} />							
								</Card.Content>								
							</Tabs.Content>
							
							<Tabs.Content value="return" class="space-y-2">
								<Card.Content>
									
									<ObservablePlot options={optionsTopTenTwrrYahoo}  />								
								</Card.Content>								
							</Tabs.Content>
	
						</Tabs.Root>
					</Card.Root>



				</div>

				<h2
				class="scroll-m-20 text-3xl font-semibold tracking-tight transition-colors first:mt-0"
				>
				Value, Assets & Positions
				</h2>

				<!-- ///////////////////////////////////////////////////// -->
				<div class="grid gap-2 md:grid-cols-2 lg:grid-cols-7">   <!-- This is the section of two cards -->


					<!-- /////////////////////////////////////////////////////// Card 1 - Left /////////////////////////////////////////////////////// -->
					<Card.Root class="col-span-4">
						<Tabs.Root bind:value={activeTab_value_ass_pos}>
										
							<div class="flex items-center justify-between pt-2">
								<h3 class="text-xl pl-4 pr-1 font-semibold leading-none tracking-tight">{tabTitles_value_ass_pos[activeTab_value_ass_pos]}</h3>
								<div class="mr-2">
									<Tabs.List>
										<Tabs.Trigger class="flex-grow text-center font-bold" value="value">Value</Tabs.Trigger>
										<Tabs.Trigger class="flex-grow text-center font-bold" value="ciks">Investors</Tabs.Trigger>
										<Tabs.Trigger class="flex-grow text-center font-bold" value="assets">Assets</Tabs.Trigger>
										<Tabs.Trigger class="flex-grow text-center font-bold" value="positions">Postitions</Tabs.Trigger>
									</Tabs.List>
								</div>
								
								<!-- <div class="flex items-center gap-2 flex-grow">
									<h3 class="text-xl font-semibold leading-none tracking-tight text-chart flex-shrink-0" style="width: 100px;">{quarters[+quarter_id]}</h3>
								</div> -->

							</div>
							<!-- //////////////// -->
							<Tabs.Content value="value" class="space-y-2">
								<Card.Content>
									<div class="h-[400px] p-4 border rounded group ">

										<AreaClipped  data={entries_qtrstats_chart}/>								
									</div>
								</Card.Content>								
							</Tabs.Content>
							<!-- ////////////////// -->
							
							<Tabs.Content value="ciks" class="space-y-2 ">
								<Card.Content>
									<div class="h-[400px] p-4 border rounded group">

										<Bar data={entries_ciks} y='ciks'/>							
									</div>
								</Card.Content>								
							</Tabs.Content>


							<!-- //////////////// -->
							<Tabs.Content value="assets" class="space-y-2">
								<Card.Content>
									<div class="h-[400px] p-4 border rounded group">

										<Bar data={entries_cusips} y='assets'/>								
									</div>
								</Card.Content>								
							</Tabs.Content>
							<!-- ////////////////// -->

							<!-- //////////////// -->
							<Tabs.Content value="positions" class="space-y-2">
								<Card.Content>
									<div class="h-[400px] p-4 border rounded group">
										
										<Bar  data={entries_positions} y='positions'/>								
									</div>
								</Card.Content>								
							</Tabs.Content>
							<!-- //////////////// -->
	
						</Tabs.Root>
					</Card.Root>

<!-- /////////////////////////////////////////////////////// Card 2 - Right /////////////////////////////////////////////////////// -->


<Card.Root class="col-span-3">
	{#if activeTab_value_ass_pos === 'value'}

		<h3 class="text-xl p-4 font-semibold leading-none tracking-tight">Quarterly Return (%)</h3>
		<Card.Content>
			<div class="h-[400px] border rounded group">
			<!-- <AreaClipped data={entries_qtrstats_chart} y='qtr_return_yahoo'/> -->
				<ObservablePlot  options={optionsQtrReturn}  />							 
			</div>
		</Card.Content>	

	{:else if activeTab_value_ass_pos === 'ciks'}
	<h3 class="text-xl p-4 font-semibold leading-none tracking-tight">New vs. Closed Investors</h3>
	<Card.Content>
		<div class="h-[400px] border rounded group">
			<ObservablePlot  options={optionsCikNewStopped}/>							
		</div>
	</Card.Content>	

	{:else if activeTab_value_ass_pos === 'assets'}
	<h3 class="text-xl p-4 font-semibold leading-none tracking-tight">New vs. Closed Assets</h3>
	<Card.Content>
		<div class="h-[400px] border rounded group">
			<ObservablePlot  options={optionsCusipsNewStopped}/>							
		</div>
	</Card.Content>	

	{:else if activeTab_value_ass_pos === 'positions'}
	<h3 class="text-xl p-4 font-semibold leading-none tracking-tight">New vs. Closed Positions</h3>
	<Card.Content>
		<div class="h-[400px] border rounded group">
			<ObservablePlot  options={optionsPositionsOpenClose}/>							
		</div>
	</Card.Content>	
	{/if}	

</Card.Root>
<!-- /////////////////////////////////////////////////////// End /////////////////////////////////////////////////////// -->

					<!-- /////////////////////////////////////////////////////// Start /////////////////////////////////////////////////////// -->
					<!-- <Card.Root class="col-span-3">
						<Card.Header class="flex justify-between">
							<Card.Title class="flex items-center gap-2">Top 10

							<div class="flex items-center gap-2">
									<form data-sveltekit-keepfocus data-sveltekit-noscroll class="flex items-center">   -->
										<!-- <input type="range" name="quarter_id"
										min="0" 
										max={quarters.length -  1} 
										bind:value={quarter_id}
										on:change={e=>e.currentTarget.form?.requestSubmit()}
										class="w-[200px]"
										/> -->
									<!-- <Range 
									name="quarter_id"
									id="medium-range" 
									min="0" 
									max={quarters.length -  1} 
									bind:value={quarter_id}
									on:change={event => event.target?.form?.requestSubmit()}
									class=" accent-black w-[200px] h-2 bg-gray-200 rounded-md dark:bg-gray-700"
									/> -->
									<!-- style="accent-color: #f5f5f5;" -->									
									<!-- </form>
									<h3 class="font-semibold leading-none tracking-tight text-chart">{quarters[+quarter_id]}</h3>
							</div> -->

							<!-- <div>
								<ToggleGroup.Root type="single">
									<ToggleGroup.Item value="bold" aria-label="Toggle return">
										<p>Return</p>
									</ToggleGroup.Item>
									<ToggleGroup.Item value="italic" aria-label="Toggle value">
										<p>Value</p>

									</ToggleGroup.Item>
								  </ToggleGroup.Root>
							</div>
							
							</Card.Title>
						</Card.Header>

						<Card.Content>
								<ObservablePlot options={optionsTopTenTwrrYahoo}  />
						</Card.Content>
					</Card.Root> -->
<!-- /////////////////////////////////////////////////////// End /////////////////////////////////////////////////////// -->

				</div>


			</Tabs.Content>   <!-- This is the end of the biggest tab: Overview -->
			<Tabs.Content value="analytics" class="space-y-2">
				<div class="grid gap-2 md:grid-cols-2 lg:grid-cols-4">
					<Card.Root>
						<Card.Header
							class="flex flex-row items-center justify-between space-y-0 pb-2"
						>
							<Card.Title class="text-sm font-medium">Total Revenue</Card.Title>
							<MdiCurrencyUsdCircleOutline class="h-6 w-6 text-muted-foreground" />
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
							<MdiAccountSupervisor class="h-6 w-6 text-muted-foreground" />
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
							<MdiCreditCard class="h-6 w-6 text-muted-foreground" />
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
							<ActivityLog class="h-4 w-4 text-muted-foreground" />
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


<!-- <div class="h-[400px] p-4">
	<AreaClipped data={entries_qtrstats_chart} y='qtr_return_yahoo'/>							
</div> -->