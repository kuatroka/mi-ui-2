<script lang="ts">
    import { page } from '$app/stores'
    import type { ComponentProps } from 'svelte';
    import { Maximize } from "lucide-svelte";

    import { ToggleGroup as ToggleGroupUX, ToggleOption, TogglePanel } from 'svelte-ux';
    import { createDateSeries } from '../../../node_modules/layerchart/dist/utils/genData';
    

    import AreaSimple from "$lib/components/layerchart/area-simple/area-simple.svelte";
    import AreaClipped from "$lib/components/layerchart/area-simple/area-clipped-tooltip.svelte";
    import Line from "$lib/components/layerchart/line/line.svelte"
    import Bar from '$lib/components/layerchart/bar/bar.svelte'

    import * as Card from "$lib/components/ui/card";
	import * as Tabs from "$lib/components/ui/tabs";
    import { Switch } from "$lib/components/ui/switch";
	import { Toggle } from "$lib/components/ui/toggle";
    import * as ToggleGroup from "$lib/components/ui/toggle-group";
	import { Label } from "$lib/components/ui/label";
    import { Button } from "$lib/components/ui/button";


    import DataTable from "$lib/components/datatable-sup-overview/data-table.svelte";
    $: pathname = $page.url.pathname;
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
    
    

    $: entries_qtrstats_chart = entries_qtrstats.filter(entry => entry.open_close_ratio !== null).map(entry => ({
			date: new Date(entry.quarter_end_date),
			value: entry.ttl_value_all_ciks_per_qtr,
			assets: entry.ttl_num_assets_all_ciks_per_qtr,
			ciks: entry.ttl_num_ciks_per_qtr,
			positions: entry.ttl_num_positions_per_qtr,
      open_close: entry.open_close_ratio
	}));

    let data2 = createDateSeries({
    count: 100,
    min: 0.80,
    max: 1.5,
    value: 'number',
    keys: ['assets', 'baseline'],
  });

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

</script>
{#each entries_qtrstats_chart.slice(0,8) as entry }
<p>{entry.date} - {entry.open_close}</p>
    
{/each}

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
<div>

    <AreaSimple />
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

  
  
  