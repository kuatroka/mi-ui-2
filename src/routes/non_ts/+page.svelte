<script lang="ts">

    // import * as aq from 'arquero';
    import { invalidate, goto } from '$app/navigation';


    import * as Plot from "@observablehq/plot";
    import ObservablePlot from '$lib/components/observableplot/Plot.svelte';
    export let data;

    let dataset: any[] = [];
$: { dataset = data.qtrStats.map(entry => ({
        date: new Date(entry.quarter_end_date),
        quarter: entry.quarter,
        stopped: entry.num_stopped_ciks,
        new: entry.num_new_ciks,
        value: entry.ttl_value_all_ciks_per_qtr
    }))
};


    // let aq_df = aq.from(data.qtrStats)
    //             .derive({
    //             quarter_end_date: d => aq.op.parse_date(d!.quarter_end_date)
    //             })
    //             .select(['quarter', 'quarter_end_date', 'num_stopped_ciks', 'num_new_ciks', 'ttl_value_all_ciks_per_qtr']);


    // let quarteres = aq_df.select('quarter')._data['quarter']['data'];
    // let quarteres2 = aq_df.select('quarter').totalRows();
    // let quarters = aq_df.select('quarter').array('quarter');
    let quarters = data.qtrStats.map(d => d.quarter);



    let sliderValue = quarters.length - 1; // Initial slider value
	export let quarterValue = quarters[quarters.length - 1];

    $: quarterValue = quarters[sliderValue];

    //////////////////
    const debounce = (callback: Function, wait = 300) => {
    let timeout: ReturnType<typeof setTimeout>;
 
    return (...args: any[]) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => callback(...args), wait);
    };
};

    // Function to update sliderValue and quarterValue when the slider is moved
    let updateSlider: (event: Event) => void;

    $: updateSlider = (event: Event) => {
        sliderValue = parseInt((event.target as HTMLInputElement).value);
        quarterValue = quarters[sliderValue];
        console.log(quarterValue);
        invalidate('slider:cik');
    };




</script>
{quarterValue}

<!-- <pre>{JSON.stringify(dataset.slice(0, 2)  , null, 2)}</pre> -->



<div class=" flex mt-4">
    <div class="mx-2 w-1/2 border border-red-300" >
        <div class="my-4 flex flex-col items-center">
            <form action="?/slider_value" method="get">
                <input  type="range" min="0" max={quarters.length - 1} value={sliderValue} on:input={updateSlider} step="1" />
                <p>Quarter: {quarterValue}</p>
            </form>
        </div>
        <ObservablePlot 
        options={{
            // width: 900,
            title: 'Started and Stopped Superinvestors',
            subtitle: 'Using date ticks. Try setting interval to "quarter".',
        // x: { interval: 'year' },
		marks: [
            Plot.barY(dataset.slice(1), { x: 'date', y: 'new', fill: 'steelblue', opacity: 0.7 }),
            Plot.barY(dataset.slice(1), { 
                x: 'date',
				y: 'stopped',
				fill: 'orange ',
				insetLeft:5,
				insetRight: 5,
				mixBlendMode: 'multiply',
			})        
        ]
    }}
            fixedWidth={false}
            />
    </div>         

    <div class="mx-4 w-1/2 border border-red-300" >
        <div class="my-4 flex flex-col items-center">
            <form action="?/slider_cik" method="get">
                <input type="hidden" name="quarter" value={quarterValue} />
                <input name="cik" type="range" min="0" max={quarters.length - 1} value={sliderValue} on:input={debounce(updateSlider)} step="1" />
                <p>Quarter: {quarterValue}</p>
            </form>
        </div>

            <ObservablePlot 
            options={{
                // width: 900,
                title: 'Started and Stopped Superinvestors',
                subtitle: 'Using date ticks. Try setting interval to "quarter".',
            // x: { interval: 'year' },
            marks: [
                Plot.lineY(dataset,{ x: "date", y: "value" } ),          
            ]
        }}
                fixedWidth={false}
                />
        </div>               

</div>


