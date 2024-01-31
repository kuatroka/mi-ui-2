<script lang="ts">
import Line from "$lib/components/layerchart/line/line.svelte"

import { createDateSeries } from '../../../node_modules/layerchart/dist/utils/genData';

    let data2 = createDateSeries({
    count: 200,
    min: 0.80,
    max: 1.5,
    value: 'number',
    keys: ['open_close'],
  });

  export let data;
	$: entries_cik = data.ciks;
    $: entries_qtrstats = data.qtrStats

    let original_qtrstats = data.qtrStats; // Store the original data
    let showIncomple = false; // State for the toggle
    $: if (showIncomple) {
		entries_qtrstats = original_qtrstats;
	} else {
        entries_qtrstats = original_qtrstats.filter(entry => entry.is_quarter_completed == 'YES');
    };


  $: entries_qtrstats_chart = entries_qtrstats.map(entry => ({
			date: new Date(entry.quarter_end_date),
			value: entry.ttl_value_all_ciks_per_qtr,
			assets: entry.ttl_num_assets_all_ciks_per_qtr,
			ciks: entry.ttl_num_ciks_per_qtr,
			positions: entry.ttl_num_positions_per_qtr,
            open_close: entry.open_close_ratio
	}));
</script>
<h1 class="text-3xl my-2"> Synthetic Data</h1>
{#each data2.slice(0,5) as entry }
<p>{entry.date} - {entry.open_close}</p>
    
{/each}

<Line data={data2} y="open_close"/>

<h1 class="text-3xl my-2"> Real Data</h1>
{#each entries_qtrstats_chart.slice(0,10) as entry }
<p>{entry.date} - {entry.open_close}</p>
    
{/each}

<Line data={entries_qtrstats_chart} y="open_close"/>