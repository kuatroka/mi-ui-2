<script lang="ts">
    import { page } from '$app/stores'
    import AreaSimple from "$lib/components/layerchart/area-simple/area-simple.svelte";
    import Bar from '$lib/components/layerchart/bar/bar.svelte'

    import * as Card from "$lib/components/ui/card";
	import * as Tabs from "$lib/components/ui/tabs";

    import DataTable from "$lib/components/datatable-sup-overview/data-table.svelte";
    $: pathname = $page.url.pathname;
	export let data;
	$: entries_cik = data.ciks;
    $: entries_qtrstats = data.qtrStats
    $: entries_qtrstats_chart = entries_qtrstats.map(entry => ({
			date: new Date(entry.quarter_end_date),
			value: entry.ttl_num_assets_all_ciks_per_qtr
	}));

</script>

<div>
<Bar data={entries_qtrstats_chart}/>

</div>
<div>

    <AreaSimple />
</div>


<div>


<Card.Root class="col-span-4 mt-4">
    <Tabs.Root class="Root">
    <Tabs.List class='w-full flex'>
        <Tabs.Trigger class="flex-grow text-center" value="performance">Performance</Tabs.Trigger>
        <Tabs.Trigger class="flex-grow text-center" value="value">Value</Tabs.Trigger>
        <Tabs.Trigger class="flex-grow text-center" value="assets" disabled>Assets</Tabs.Trigger>
        <Tabs.Trigger class="flex-grow text-center" value="positions" disabled>Positions</Tabs.Trigger>
    </Tabs.List>
</Tabs.Root>

    <!-- <Tabs.Content value="performance" class="space-y-2">

    </Tabs.Content>
    <Tabs.Content value="value" class="space-y-2">

    </Tabs.Content>
    <Tabs.Content value="assets" class="space-y-2">

    </Tabs.Content>
    <Tabs.Content value="positions" class="space-y-2">

    </Tabs.Content> -->
    <Card.Header>
        <Card.Title>Overview</Card.Title>
    </Card.Header>
    <Card.Content>
        <DataTable data={entries_cik} {pathname}/>
        <!-- <AreaSimple /> -->
    </Card.Content>
</Card.Root>
</div>