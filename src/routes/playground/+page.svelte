<script lang="ts">

    import * as d3 from 'd3';
    import { Chart, type EChartsOptions } from '$lib/components/echarts'

    import { page } from '$app/stores'
    import type { ComponentProps } from 'svelte';
    import MdiArrowExpand from '~icons/mdi/arrow-expand'
    import MdiArrowRight from '~icons/mdi/arrow-right'
    // import { Timeline, TimelineItem, Button as ButtonFlowbite } from 'flowbite-svelte';

    import { ToggleGroup as ToggleGroupUX,
         ToggleOption, TogglePanel,
          NumberStepper, MenuField } from 'svelte-ux';

    
    import {Rule} from 'layerchart'
//     import { createDateSeries } from '../../../node_modules/layerchart/dist/utils/genData';

        // import { createDateSeries } from 'layerchart/utils/genData';

//     let data2 = createDateSeries({
//     count: 100,
//     min: 0.80,
//     max: 1.5,
//     value: 'number',
//     keys: ['assets', 'baseline'],
//   });

    import { pivotLonger } from '../../../node_modules/layerchart/dist/utils/pivot';
    import { flatGroup } from 'd3-array';
    

    import AreaSimple from "$lib/components/layerchart/area-simple/area-simple.svelte";
    import AreaClipped from "$lib/components/layerchart/area-simple/area-clipped-tooltip.svelte";
    import Line from "$lib/components/layerchart/line/line.svelte"
    import MultiLine from "$lib/components/layerchart/line/line-multiseries.svelte"
    import Bar from '$lib/components/layerchart/bar/bar.svelte'

    import * as Card from "$lib/components/ui/card";
	import * as Tabs from "$lib/components/ui/tabs";
    import { Switch } from "$lib/components/ui/switch";
	import { Toggle } from "$lib/components/ui/toggle";
    import * as ToggleGroup from "$lib/components/ui/toggle-group";
	import { Label } from "$lib/components/ui/label";
    import { Button } from "$lib/components/ui/button";


    import DataTable from "$lib/components/datatable-sup-overview/data-table.svelte";

    import MyPlot from '$lib/components/observableplot/Plot.svelte'
    import * as Plot from "@observablehq/plot";
// 
    import ObservablePlot from '$lib/components/observableplot/observablePlot.svelte';


	export let data;
	let entries_cik = data.ciks;
    let entries_totals = data.totals;
    let quarters = data.quarters;
    // $: {console.log(entries_totals[0].last_load_date);}
    let entries_qtrstats = data.qtrStats; // originally it was declared with `$:`

    let original_qtrstats = data.qtrStats; // Store the original data
    let showIncomple = false; // State for the toggle
    $: if (showIncomple) {
		entries_qtrstats = original_qtrstats;
	} else {
        entries_qtrstats = original_qtrstats.filter(entry => entry.is_quarter_completed == 'YES');
    };    

    let entries_qtrstats_chart: any[]= []; 
    let entries_ciks_new_closed: any[]= []; 
    $: {
        entries_qtrstats_chart = entries_qtrstats.map(entry => ({
            date: new Date(entry.quarter_end_date),
            value: entry.ttl_value_all_ciks_per_qtr,
            assets: entry.ttl_num_assets_all_ciks_per_qtr,
            ciks: entry.ttl_num_ciks_per_qtr,
            positions: entry.ttl_num_positions_per_qtr,
            open_close: entry.open_close_ratio,
        }));

        entries_ciks_new_closed = entries_qtrstats.map(entry => ({
            date: new Date(entry.quarter_end_date),
            closed_ciks: entry.num_stopped_ciks ?? 0,
            new_ciks: entry.num_new_ciks ?? 0
        }));
        };

        // $: console.log(entries_ciks_new_closed)

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
    $: { multiSeriesFlatData = pivotLonger(entries_ciks_new_closed, series_columns, category, metric_column);
        dataByCategory = flatGroup(multiSeriesFlatData, (d) => d[category]);
    };


    let isCardExpanded = false;

    function toggleCardSize() {
        isCardExpanded = !isCardExpanded;
    };


    let selectedStr = 'a';

    // Plot options for the type 1 of declaring Observable Plot
    let plotOptions: any;
    $: {plotOptions = {
        marks: [
            Plot.lineY(entries_ciks_new_closed, {x: "date", y: "closed_ciks", stroke: "var(--color-rose-400)" }),
        ]
        }};
    
    // Plot options for the type 2 of declaring Observable Plot
    let div: HTMLElement | null;
    let data4 = d3.ticks(-2, 2, 200).map(Math.sin);

    function onMousemove(event: MouseEvent) {
        const [x, y] = d3.pointer(event);
        data4 = data4.slice(-200).concat(Math.atan2(x, y));
    }

    $: {
        div?.firstChild?.remove(); // remove old chart, if any
        div?.append(Plot.lineY(data4).plot({grid: true})); // add the new chart
    }
//////////////////////


    // options for eCharts 
const options: EChartsOptions = {
  legend: {padding: 10, left: 'left', top: 'top', orient: 'vertical'},
  tooltip: {},
  toolbox: {
    left: 'center',
    feature: {
      dataZoom: {}
    }
  },
  xAxis: {type: 'time'},
  yAxis: {  },
  series: [
    {
      type: 'line',
      name: '# Investors',
      data: data.qtrStats.reverse().map(entry => [new Date(entry.quarter_end_date), entry.ttl_num_assets_all_ciks_per_qtr]),
      encode: {
        x: 'date',
        y: 'num_stopped_ciks',
        tooltip: ['date', 'num_stopped_ciks']
      }
    },
  ]
};



$: randomDateData = [10, 23, 34];
let dateRange = 10;

let optionsQuarters = [
    { label: '1999Q1', value: '1999Q1' },
    { label: '1999Q2', value: '1999Q2' },
    { label: '1999Q3', value: '1999Q3' },
    { label: '2001Q3', value: '2001Q3' },
    { label: '2023Q1', value: '2023Q1' },
];

// const quarters = ["1999Q1", "1999Q2", "1999Q3", "2001Q3", "2023Q1"];

$: quarters_index =  -1 ?? -1;
$: quarter = quarters[quarters.length - 1] ;

// $: optionsTopTenTwrrYahoo = 
// 		{
// 		width: 1500,
// 		height: 400,
// 		marginLeft: 0,
// 		marginTop: 0,
// 		x: {label: "Cumulative Return (%)"},
// 		marks: [

// 			Plot.barX(top_10_ciks_twrr_yahoo, {x: "cum_twrr_yahoo", y: "cik_name", fill: 'var(--chart-observable)', sort: {y: "x", reverse: true},
// 			channels: { cik: 'cik', Superinvestor: "cik_name" },
// 			tip: {fill: 'var(--chart-foreground-observable)', fontSize: 12, stroke: 'black'},
// 			// stroke: 'var(--chart-foreground-observable)'
// 		 },	),
// 			Plot.axisY({
// 			label: null,
// 			textAnchor: "start",
// 			lineWidth: 20,
// 			fill: 'black',
// 			dx: 14,
// 			tickSize: 0,
// 			}),
// 		]
// 		};
  
  
</script>
{quarter}
<div class="w-[100] m-4">

    <MenuField  bind:value={quarter} stepper classes={{ menuIcon: "hidden" }}/>
</div>


<!-- <div class="m-4 w-[100]"></div>
<NumberStepper label="Date range" bind:value={quarters_index} class="w-1/10" /> -->

<!-- <h2 class="text-3xl font-bold tracking-tight ml-4  my-4">Layerchart - Real Data - # Assets</h2>
<div>
    <AreaSimple  data={entries_qtrstats.map(entry => ({
        date: new Date(entry.quarter_end_date),
        value: entry.ttl_num_assets_all_ciks_per_qtr,
    }))
    } />
</div> -->


<!-- ////////////////////// -->
<!-- <h2 class="text-3xl font-bold tracking-tight ml-4  my-4">eCharts - Synthetic Data</h2>
<div class="app">
    <Chart options={options} />
</div> -->
<!-- ////////////////////// -->


<!-- ////////////////////// -->
<!-- <h2 class="text-3xl font-bold tracking-tight ml-4  my-4">Observable Plot Type 1 - Synthetic Data</h2>
<div on:mousemove={onMousemove} bind:this={div} role="img"></div> -->
<!-- ////////////////////// -->

<!-- <h2 class="text-3xl font-bold tracking-tight ml-4  my-4">Flowbite-svelte - Timeline</h2>

<Card.Content class="mt-2">
<Timeline>
    <TimelineItem svgClass="pb-2"  title="Today" date={new Date().toDateString()}>
    </TimelineItem>
    <TimelineItem title="Application UI code in Tailwind CSS" date={new Date(entries_totals[0].last_load_date).toDateString()}>
      <p class="text-base font-normal text-gray-500 dark:text-gray-400">All of the pages and components are first designed in Figma and we keep a parity between the two versions even as we update the project.</p>
    </TimelineItem>
    <TimelineItem title="Application UI code in Tailwind CSS" date="April 2022">
      <p class="text-base font-normal text-gray-500 dark:text-gray-400">Get started with dozens of web components and interactive elements built on top of Tailwind CSS.</p>
      <Button color="alternative">Learn more<MdiArrowRight class="ms-2 w-3 h-3" />        
      </Button>
    </TimelineItem>
  </Timeline>
</Card.Content> -->


<!-- ////////////////////// -->
<!-- <h2 class="text-3xl font-bold tracking-tight ml-4  my-4">DaisyUI - Timeline</h2> -->
<!-- <Card.Content class="mt-2">
    <ul class="timeline timeline-vertical [--timeline-col-start:2rem]">
    <li>
        <div class="timeline-start">1984</div>
        <div class="timeline-middle">
            <svg  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" 
            fill="currentColor" 
            class="w-5 h-5"><path 
            fill-rule="evenodd" 
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" /></svg>
        </div>
        <div class="timeline-end timeline-box bg-background">First Macintosh computer</div>
        <hr/>
    </li>
    <li>
        <hr/>
        <div class="timeline-start">1998</div>
        <div class="timeline-middle">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" /></svg>
        </div>
        <div class="timeline-end timeline-box bg-background">iMac</div>
        <hr/>
    </li>
    <li>
        <hr/>
        <div class="timeline-start">2001</div>
        <div class="timeline-middle">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" /></svg>
        </div>
        <div class="timeline-end timeline-box bg-background">iPod</div>
        <hr/>
    </li>
    <li>
        <hr/>
        <div class="timeline-start">2007</div>
        <div class="timeline-middle">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" /></svg>
        </div>
        <div class="timeline-end timeline-box bg-background">iPhone</div>
        <hr/>
    </li>
    <li>
        <hr/>
        <div class="timeline-start">2015</div>
        <div class="timeline-middle">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" /></svg>
        </div>
        <div class="timeline-end timeline-box bg-background">Apple Watch</div>
    </li>
    </ul>
</Card.Content> -->



<!-- {#each entries_qtrstats_chart.slice(0,4) as entry }
<p>{entry.date} - {entry.open_close}</p>
    
{/each} -->
<!-- <pre>{JSON.stringify(multiSeriesFlatData.reverse().slice(0,4), null, 2)}</pre> -->


<!-- ////////////////////// -->
<div class="flex flex-col items-end m-2 justify-end">
        <Toggle
        bind:pressed={showIncomple}
        aria-label="toggle completed quarters"
        >
        <!-- onPressedChange={handleCheckedChange} -->
        Show Partial Qtr
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
<!-- ////////////////////// -->


<!-- <div class="my-4">
    <h1 class="mx-4 scroll-m-20 py-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0"
    >Layerchart - Real Data</h1>
<Bar 
data={entries_qtrstats_chart}
/>
</div> -->





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
                        <!-- <DataTable data={entries_cik}/> -->
                </Card.Content>								
            </Tabs.Content>

            <Tabs.Content value="value" class="space-y-2">
                <Button class="m-1 ml-6"
                on:click={toggleCardSize}
                >
                <MdiArrowExpand />
                </Button>
                <Card.Content class="min-h-[450px]">
                    
                    <!-- <AreaClipped  data={entries_qtrstats_chart} y='value'/>	 -->
                </Card.Content>
						
            </Tabs.Content>
            
            
            <Tabs.Content value="superinvestors" class="space-y-2">								
                <Card.Content class="min-h-[450px]">
                    <Tabs.Root>
                        <div class="flex items-center justify-center gap-2">

                            <Tabs.List>
                                <Tabs.Trigger class="flex-grow text-center" value="totals">Total</Tabs.Trigger>
                                <Tabs.Trigger class="flex-grow text-center" value="new_closed">New/Closed</Tabs.Trigger>
                            </Tabs.List>
                        </div>

                        <Tabs.Content value="totals" class="space-y-2">
                            <Card.Content class="min-h-[450px]">
                                <!-- <Bar data={entries_qtrstats_chart} y='ciks'/>		 -->
                            </Card.Content>								
                        </Tabs.Content>

                        <Tabs.Content value="new_closed" class="space-y-2">
                            <Card.Content class="min-h-[450px]">
                                    <!-- <Line data={entries_qtrstats_chart} y='open_close'	/>	 -->
                                    <!-- <MultiLine
                                        {categoryColours}
                                        {multiSeriesFlatData}
                                        {dataByCategory}
                                        />							 -->
                            </Card.Content>								
                        </Tabs.Content>

                    </Tabs.Root>					
                </Card.Content>
            </Tabs.Content>

            <Tabs.Content value="assets" class="space-y-2">	
                <Card.Content class="min-h-[450px]">

                    <!-- <Bar data={entries_qtrstats_chart} y='assets'/>								 -->
                </Card.Content>
            </Tabs.Content>

            <Tabs.Content value="positions" class="space-y-2">								
                <Card.Content class="min-h-[450px]">
                    <Tabs.Root>
                        <div class="flex items-center justify-center gap-2">

                            <Tabs.List>
                                <Tabs.Trigger class="flex-grow text-center" value="totals">Totals</Tabs.Trigger>
                                <Tabs.Trigger class="flex-grow text-center" value="ratio_oc">Open/Close</Tabs.Trigger>
                            </Tabs.List>
                        </div>

                        <Tabs.Content value="totals" class="space-y-2">
                            <Card.Content class="min-h-[450px]">
                                    <!-- <Bar data={entries_qtrstats_chart} y='positions'/>								 -->
                            </Card.Content>								
                        </Tabs.Content>
                        <Tabs.Content value="ratio_oc" class="space-y-2">
                            <Card.Content class="min-h-[450px]">
                                    <!-- <Line data={entries_qtrstats_chart} y='open_close' -->
                                    />								
                            </Card.Content>								
                        </Tabs.Content>

                    </Tabs.Root>


                </Card.Content>
            </Tabs.Content>

        </Tabs.Root>
    </Card.Root>
</div>



<!-- ///////////////////// -->
<div class="ml-4 gap-2 w-1/5">
    <h2 class="text-3xl font-bold tracking-tight ml-4  my-4">Toggle Group 1</h2>
        <ToggleGroup.Root type="single" bind:value={selectedStr} variant="outline">
            <ToggleGroup.Item value="a">Totals</ToggleGroup.Item>
            <ToggleGroup.Item value="r">Open/Close</ToggleGroup.Item>
        </ToggleGroup.Root>
</div>
<!-- ///////////////////// -->


<!-- ///////////////////// -->
<div class="ml-4 gap-2 w-1/5">
    <h2 class="text-3xl font-bold tracking-tight ml-4  my-4">Toggle Group 2</h2>
        <ToggleGroupUX variant="fill-light" bind:value={selectedStr}>
            <ToggleOption value="all">a</ToggleOption>
            <ToggleOption value="missed">b</ToggleOption>
            <ToggleOption value="calls">r</ToggleOption>
            
            <!-- <ToggleGroup.Root type="single" bind:value={selectedStr}>
                <ToggleGroup.Item value="a">Totals</ToggleGroup.Item>
                <ToggleGroup.Item value="r">Open/Close</ToggleGroup.Item>
            </ToggleGroup.Root> -->
        </ToggleGroupUX>
        Toggle value: {selectedStr}
</div>
<!-- ///////////////////// -->

<!--  Line chart from layerchart-->

<!-- <h1 class="text-2xl text-amber-500 ml-4 my-4"> Line Chat from layerchart - Real Data</h1> -->

<!-- <Line data={entries_qtrstats_chart} 
y="open_close"
showRule={true} /> -->

<!-- <h1 class="text-2xl text-amber-500 ml-4  my-4"> MultiLine Chat from layerchart - Synthetic Data</h1>
<MultiLine
/> -->


<!-- <h2 class="text-3xl font-bold tracking-tight ml-4  my-4">Switch</h2>
<div class="flex items-center gap-2">
    <Switch 
    id="add-partial-qtr"
    class="ml-auto"
    bind:checked={showIncomple}
    >
</Switch>
<Label for="add-partial-qtr">Show partial Qtr</Label>
</div> -->
<!-- onCheckedChange={handleCheckedChange} -->


<!-- <h2 class="text-3xl font-bold tracking-tight ml-4  my-4">MultiLine Chat from layerchart - Real Data</h2> -->
<!-- <MultiLine
{categoryColours}
{multiSeriesFlatData}
{dataByCategory}
{series_columns}
/> -->

<!-- <h2 class="text-3xl font-bold tracking-tight ml-4  my-4">myPlot - Real Data</h2>
<MyPlot options={plotOptions} /> -->


<!-- <h2 class="text-3xl font-bold tracking-tight ml-4  my-4">observablePlot - Synthetic Data </h2>
<ObservablePlot 
	options={{
		title: 'A simple bar chart',
		marks: [Plot.barY([1,2,4,8])],
	}}
    fixedWidth={true}
    width={200} 
    /> -->

<!-- ///////////// -->

<h2 class="text-3xl font-bold tracking-tight ml-4  my-4">observablePlot  - Real Data </h2>
<!-- <ObservablePlot 
	options={{
        title: 'Assets and Investors',
        subtitle: 'This is a subtitle',
        marginLeft: 46,
		marks: [Plot.lineY(entries_qtrstats_chart, {x: "date", y: "assets", stroke: "teal", tip: "x"}),
        // Plot.lineY(entries_qtrstats_chart, {x: "date", y: "ciks", stroke: "blue", tip: "x"})
    ]        
	}} 
    fixedWidth={false}
    width={800} 
    class="px-4"
    /> -->

    <!-- class="px-4 stroke-2 stroke-amber-500 text-red-400" -->
    <!-- stroke in class- regulates the color of the axis Y numbers -->

<!-- <div class="mx-4">
    <ObservablePlot 
	options={{
        title: 'A more complex bar chart',
		subtitle: 'Using date ticks. Try setting interval to "quarter".',
		x: { interval: 'year' },
		marks: [
            Plot.barY([
                {date: Date.UTC(2018,0,1), value:1},
				{date: Date.UTC(2019,0,1), value:2},
				{date: Date.UTC(2020,0,1), value:4},
				{date: Date.UTC(2021,0,1), value:8}
			], { x: 'date', y: 'value', fill: '#999' }), 
			Plot.barY([
                {date: Date.UTC(2018,0,1), value:2},
				{date: Date.UTC(2019,0,1), value:1.5},
				{date: Date.UTC(2020,0,1), value:6},
				{date: Date.UTC(2021,0,1), value:7}
			], { 
                x: 'date',
				y: 'value',
				fill: 'red',
				insetLeft:20,
				insetRight: 20,
				mixBlendMode: 'multiply'
			})]
        }}
            fixedWidth={true}
            width={200}  />
</div> -->


					<!-- /////////////////////////////////////////////////////// Start /////////////////////////////////////////////////////// -->
					<!-- <Card.Root class="col-span-3">
						<Card.Header class="flex justify-between">
							<Card.Title class="flex items-center gap-2">Top 10

							<div class="flex items-center gap-2"> -->
									<!-- <form data-sveltekit-keepfocus data-sveltekit-noscroll class="flex items-center">   --> -->
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
								
									<!-- </form> -->
									<!-- <h3 class="font-semibold leading-none tracking-tight text-chart">{quarters[+quarter_id]}</h3>
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
							</div> -->
							
							<!-- </Card.Title>
						</Card.Header>

						<Card.Content>
								<ObservablePlot options={optionsTopTenTwrrYahoo}  />
						</Card.Content>
					</Card.Root> -->



<!-- Times line component Start ////////////////////////// -->
				<!-- <Card.Root class="">

					<Card.Content class="mt-2">
						<ul class="timeline timeline-vertical [--timeline-col-start:7rem]">
							<li>
								<div class="timeline-start">{new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}</div>
								<div class="timeline-middle">
									<svg  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" 
									fill="currentColor" 
									class="w-5 h-5"><path 
									fill-rule="evenodd" 
									d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" /></svg>
								</div>
								<div class="timeline-end timeline-box bg-background">Last Data Load</div>
								<hr/>
							</li>

						<li>
							{#if entries_totals.at(0)?.incomplete_qtr}
								<hr/>
								<div class="timeline-start">{entries_totals.at(0)?.incomplete_qtr}</div>
								<div class="timeline-middle">
									<svg  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" 
									fill="currentColor" 
									class="w-5 h-5"><path 
									fill-rule="evenodd" 
									d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" /></svg>
								</div>
								<div class="timeline-end timeline-box bg-background flex items-center">
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
							<div class="timeline-start">{entries_totals.at(0)?.last_full_qtr}</div>
							<div class="timeline-middle">
								<svg  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" 
								fill="currentColor" 
								class="w-5 h-5"><path 
								fill-rule="evenodd" 
								d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" /></svg>
							</div>
							<div class="timeline-end timeline-box bg-background">Last Full Quarter</div>
						</li>
						</ul>
					</Card.Content>
				</Card.Root> -->
                
                <!-- Times line component End ////////////////////////// -->

<!-- Card with multiple tabs and table Start ////////////////////////// -->

<!-- <Card.Root class={isCardExpanded ? 'col-span-7' : 'col-span-4'}>
    <Tabs.Root>
        <Tabs.List class=' flex mt-2 mx-6'>
            <Tabs.Trigger class="flex-grow text-center" value="performance">Performance</Tabs.Trigger>
            <Tabs.Trigger class="flex-grow text-center" value="value">Value</Tabs.Trigger>
                            <Tabs.Trigger class="flex-grow text-center" value="superinvestors">Superinvestors</Tabs.Trigger>
                            <Tabs.Trigger class="flex-grow text-center" value="assets">Assets</Tabs.Trigger>
                            <Tabs.Trigger class="flex-grow text-center" value="positions">Positions</Tabs.Trigger>
                        </Tabs.List>

                        <Tabs.Content value="performance" class="space-y-2">

                            <Card.Content class="max-h-[400px]">
                                    <DataTable data={entries_for_table}/>

                            </Card.Content>								
                        </Tabs.Content>

                        <Tabs.Content value="value" class="space-y-2">
                            <Card.Content > -->
                                <!-- <div class="h-[400px] p-4 border rounded group">
                                    <AreaClipped  data={entries_qtrstats_chart} y='value'/>	
                                </div> -->
                                <!-- <Button class="m-1"
                                on:click={toggleCardSize}
                                >
                                <Maximize />
                                </Button>							 -->
                            <!-- </Card.Content>
                        </Tabs.Content>	 -->
                        
                        <!-- <Tabs.Content value="superinvestors" class="space-y-2">								
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
                        </Tabs.Content> -->


                        <!-- <Tabs.Content value="assets" class="space-y-2">								
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
                        </Tabs.Content> -->
                        

                        <!-- <Tabs.Content value="positions" class="space-y-2">								
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
                </Card.Root> -->

<!-- Card with multiple tabs and table End ////////////////////////// -->