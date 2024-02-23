<script lang="ts">

    import * as d3 from 'd3';
    import { Chart, type EChartsOptions } from '$lib/components/echarts'

    import { page } from '$app/stores'
    import type { ComponentProps } from 'svelte';
    import { Maximize } from "lucide-svelte";
    import { Timeline, TimelineItem, Button as ButtonFlowbite } from 'flowbite-svelte';
    import { ArrowRightOutline } from 'flowbite-svelte-icons';

    import { ToggleGroup as ToggleGroupUX, ToggleOption, TogglePanel } from 'svelte-ux';
    import {Rule} from 'layerchart'
    import { createDateSeries } from '../../../node_modules/layerchart/dist/utils/genData';
    let data2 = createDateSeries({
    count: 100,
    min: 0.80,
    max: 1.5,
    value: 'number',
    keys: ['assets', 'baseline'],
  });

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
    $: {console.log(entries_totals[0].last_load_date);}
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

    let variant: ComponentProps<ToggleGroupUX>['variant'] = 'default';
    let size: ComponentProps<ToggleGroupUX>['size'] = 'md';
    let rounded: ComponentProps<ToggleGroupUX>['rounded'] = true;
    let inset: ComponentProps<ToggleGroupUX>['inset'] = false;
    let gap: ComponentProps<ToggleGroupUX>['gap'] = false;
    let vertical: ComponentProps<ToggleGroupUX>['vertical'] = false;
    let showPanes = false;

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

    // options for eCharts 
    const options: EChartsOptions = {
        xAxis: {
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        type: 'category',
        },
        yAxis: {
        type: 'value',
        },
        series: [
        {
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            type: 'bar',
        },
        ],
    };



</script>

<h2 class="text-3xl font-bold tracking-tight ml-4  my-4">Layerchart - Synthetic Data</h2>
<div>
    <AreaSimple />
</div>

<!-- <h2 class="text-3xl font-bold tracking-tight ml-4  my-4">eCharts - Synthetic Data</h2>
<div class="app">
    <Chart options={options} />
</div> -->


<h2 class="text-3xl font-bold tracking-tight ml-4  my-4">Observable Plot Type 1 - Synthetic Data</h2>
<div on:mousemove={onMousemove} bind:this={div} role="img"></div>


<h2 class="text-3xl font-bold tracking-tight ml-4  my-4">Flowbite-svelte - Timeline</h2>

<Card.Content class="mt-2">
<Timeline>
    <TimelineItem svgClass="pb-2"  title="Today" date={new Date().toDateString()}>
    </TimelineItem>
    <TimelineItem title="Application UI code in Tailwind CSS" date={new Date(entries_totals[0].last_load_date).toDateString()}>
      <p class="text-base font-normal text-gray-500 dark:text-gray-400">All of the pages and components are first designed in Figma and we keep a parity between the two versions even as we update the project.</p>
    </TimelineItem>
    <TimelineItem title="Application UI code in Tailwind CSS" date="April 2022">
      <p class="text-base font-normal text-gray-500 dark:text-gray-400">Get started with dozens of web components and interactive elements built on top of Tailwind CSS.</p>
      <Button color="alternative">Learn more<ArrowRightOutline class="ms-2 w-3 h-3" />        
      </Button>
    </TimelineItem>
  </Timeline>
</Card.Content>

<h2 class="text-3xl font-bold tracking-tight ml-4  my-4">DaisyUI - Timeline</h2>
<Card.Content class="mt-2">
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
</Card.Content>



<!-- {#each entries_qtrstats_chart.slice(0,4) as entry }
<p>{entry.date} - {entry.open_close}</p>
    
{/each} -->
<!-- <pre>{JSON.stringify(multiSeriesFlatData.reverse().slice(0,4), null, 2)}</pre> -->

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

<div class="my-4">
<Bar 
data={entries_qtrstats_chart}
/>

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
                </Card.Content>								
            </Tabs.Content>

            <Tabs.Content value="value" class="space-y-2">
                <Button class="m-1 ml-6"
                on:click={toggleCardSize}
                >
                <Maximize />
                </Button>
                <Card.Content class="min-h-[450px]">
                    
                    <AreaClipped  data={entries_qtrstats_chart} y='value'/>	
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
                                <Bar data={entries_qtrstats_chart} y='ciks'/>		
                            </Card.Content>								
                        </Tabs.Content>

                        <Tabs.Content value="new_closed" class="space-y-2">
                            <Card.Content class="min-h-[450px]">
                                    <Line data={entries_qtrstats_chart} y='open_close'	/>	
                                    <MultiLine
                                        {categoryColours}
                                        {multiSeriesFlatData}
                                        {dataByCategory}
                                        />							
                            </Card.Content>								
                        </Tabs.Content>

                    </Tabs.Root>					
                </Card.Content>
            </Tabs.Content>

            <Tabs.Content value="assets" class="space-y-2">	
                <Card.Content class="min-h-[450px]">

                    <Bar data={entries_qtrstats_chart} y='assets'/>								
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
                                    <Bar data={entries_qtrstats_chart} y='positions'/>								
                            </Card.Content>								
                        </Tabs.Content>
                        <Tabs.Content value="ratio_oc" class="space-y-2">
                            <Card.Content class="min-h-[450px]">
                                    <Line data={entries_qtrstats_chart} y='open_close'
                                    />								
                            </Card.Content>								
                        </Tabs.Content>

                    </Tabs.Root>




                </Card.Content>
            </Tabs.Content>

        </Tabs.Root>
    </Card.Root>
</div>

<Card.Content class="mt-2 inline-grid gap-2">
        <ToggleGroup.Root type="single" bind:value={selectedStr} variant="outline">
            <ToggleGroup.Item value="a">Totals</ToggleGroup.Item>
            <ToggleGroup.Item value="r">Open/Close</ToggleGroup.Item>
          </ToggleGroup.Root>
</Card.Content>





<div class="inline-grid gap-2">
        <ToggleGroupUX variant="fill-light" bind:value={selectedStr}>
            <ToggleOption value="all">a</ToggleOption>
            <ToggleOption value="missed">b</ToggleOption>
            <ToggleOption value="calls">r</ToggleOption>
            
            <!-- <ToggleGroup.Root type="single" bind:value={selectedStr}>
                <ToggleGroup.Item value="a">Totals</ToggleGroup.Item>
                <ToggleGroup.Item value="r">Open/Close</ToggleGroup.Item>
            </ToggleGroup.Root> -->
        </ToggleGroupUX>
    </div>


Toggle value: {selectedStr}

<!--  Line chart from layerchart-->

<h1 class="text-2xl text-amber-500 ml-4 my-4"> Line Chat from layerchart - Real Data</h1>

<!-- <Line data={entries_qtrstats_chart} 
y="open_close"
showRule={true} /> -->

<!-- <h1 class="text-2xl text-amber-500 ml-4  my-4"> MultiLine Chat from layerchart - Synthetic Data</h1>
<MultiLine
/> -->

<h2 class="text-3xl font-bold tracking-tight ml-4  my-4">MultiLine Chat from layerchart - Real Data</h2>

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


<!-- <MultiLine
{categoryColours}
{multiSeriesFlatData}
{dataByCategory}
{series_columns}
/> -->

<h2 class="text-3xl font-bold tracking-tight ml-4  my-4">Observable Plot  Type 1 - Real Data</h2>
<MyPlot options={plotOptions} />


<h2 class="text-3xl font-bold tracking-tight ml-4  my-4">Observable Plot Type 2 - Synthetic Data </h2>
<ObservablePlot 
	options={{
		title: 'A simple bar chart',
		marks: [Plot.barY([1,2,4,8])],
	}}
    fixedWidth={true}
    width={200} 
    />

<h2 class="text-3xl font-bold tracking-tight ml-4  my-4">Observable Plot Type 2 - Real Data </h2>
<ObservablePlot 
	options={{
        title: 'Assets and Investors',
        subtitle: 'This is a subtitle',
        marginLeft: 46,
		marks: [Plot.lineY(entries_qtrstats_chart, {x: "date", y: "assets", stroke: "teal", tip: "x"}),
        Plot.lineY(entries_qtrstats_chart, {x: "date", y: "ciks", stroke: "blue", tip: "x"})
    ]        
	}} 
    fixedWidth={true}
    width={400} 
    class="px-4"
    />
    <!-- class="px-4 stroke-2 stroke-amber-500 text-red-400" -->
    <!-- stroke in class- regulates the color of the axis Y numbers -->

<div class="mx-4">
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
        </div>




<style>
.app {
    width: 100vw;
    height: 100vh;
}
</style>