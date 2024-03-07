<script lang="ts">

    import { Chart, type EChartsOptions } from '$lib/components/echarts'
    // import * as Plot from "@observablehq/plot";
    // import MyPlot from '$lib/components/observableplot/Plot.svelte'
    

    import AreaSimple from "$lib/components/layerchart/area-simple/area-simple.svelte";



// 
    // import ObservablePlot from '$lib/components/observableplot/observablePlot.svelte';


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



</script>

<!-- <h2 class="text-3xl font-bold tracking-tight ml-4  my-4">Layerchart - Real Data - # Assets</h2>
<div>
    <AreaSimple  data={entries_qtrstats.map(entry => ({
        date: new Date(entry.quarter_end_date),
        value: entry.ttl_num_assets_all_ciks_per_qtr,
    }))
    } />
</div> -->




<!-- <h2 class="text-3xl font-bold tracking-tight ml-4  my-4">MyPlot  - Real Data </h2>

<ObservablePlot 
	options={{
        // fixedWidth: true,
    width:1800 ,
    title: 'Assets and Investors',
    subtitle: 'This is a subtitle',
        marginLeft: 46,
		marks: [Plot.lineY(entries_qtrstats_chart, {x: "date", y: "assets", stroke: "teal", tip: "x"}),
        // Plot.lineY(entries_qtrstats_chart, {x: "date", y: "ciks", stroke: "blue", tip: "x"})
    ]        
}} 
    class="px-4 w-full"
/> -->
    

<h2 class="text-3xl font-bold tracking-tight ml-4  my-4">eCharts - Real Data</h2>
<div class="app">
    <Chart options={options} />
</div>



<!-- /// this is a MUST HAVE for eCharts -->
<style>
    .app {
        width: 100%;
        height: 100vh;
    }
</style>