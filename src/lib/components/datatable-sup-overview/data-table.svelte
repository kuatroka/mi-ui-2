<script lang="ts">
	import type { Cik } from "$lib/server/db/types";
	import { goto } from "$app/navigation";
	import { page } from '$app/stores'
	import debounce from 'debounce';	
	import { format, truncate } from 'svelte-ux';

	
	import {createTable, Subscribe, Render,	createRender} from "svelte-headless-table";
	import {addSortBy, addPagination,	addTableFilter,
		addSelectedRows,addHiddenColumns, addResizedColumns	} from "svelte-headless-table/plugins";

	import { writable, type Writable } from "svelte/store";
	import * as Table from "$lib/components/ui/table";
	import  Actions  from "./data-table-actions.svelte";
	import { Button } from "$lib/components/ui/button";
	import { CaretSort, ChevronDown, ChevronUp } from "radix-icons-svelte";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
	import { Input } from "$lib/components/ui/input";


	export let order_by: string = "";
	export let order_dir: string = "";

	export let data: Cik[]; 
	const entries: Writable<Cik[]> = writable([]);
	$: $entries = data;

	const table = createTable(entries, {
		resize: addResizedColumns(),
		sort: addSortBy({
			serverSide: true,
			toggleOrder: ['desc', 'asc']
		}),
		page: addPagination({
			serverItemCount: writable(data[0].num_entries ),
			serverSide: true,
			
		}),
		filter: addTableFilter({serverSide: true}),
		select: addSelectedRows(),
		hide: addHiddenColumns()
	});

	const columns = table.createColumns([	
		table.column({
			header: "CIK",
			accessor: "cik",
			plugins: { sort: { disable: false }, 
			filter: { exclude: false }
		}
		}),
		

		table.column({ header: "Investor", accessor: "cik_name",
			cell: ({ value }) => {
				return value.toUpperCase();
			}}),

		

		table.column({
			header: "Compound Return(cons)",
			accessor: "cum_twrr_cons",
			cell: ({ value }) => {
				const formatted = format(value/100, "percent");
				return formatted;
    },
			plugins: {
				sort: {
					disable: false
				},
				filter: {
					exclude: true
				}
			}
		}),


		table.column({
			header: "Compound Return",
			accessor: "cum_twrr_yahoo",
			cell: ({ value }) => {
				const formatted = format(value/100, "percent");
				return formatted;
			},	
				}),
		
		table.column({
			header: "Last Qtr Return",
			accessor: "qtr_return_yahoo",
			cell: ({ value }) => {
				const formatted = format(value/100, "percent");
				return formatted;
			},	
				}),
		
		table.column({
			header: "Value",
			accessor: "value",
			cell: ({ value }) => {
				const formatted = format(value, "metric", { maximumSignificantDigits: 4 });
				return '$' + formatted;
    },	
		}),
		
		table.column({
			header: "# of Assets",
			accessor: "num_assets",
			cell: ({ value }) => {
				const formatted = format(value, "integer");
				return formatted;
    },	
		}),

		table.column({
			header: "Active",
			accessor: "active_from",
			plugins: { sort: { disable: false }, 
			filter: { exclude: false }
		}
		}),
		
		// table.column({
		// 	header: "",
		// 	accessor: ({ cik }) => cik,
		// 	cell: (item) => {
		// 		return createRender(Actions, { id: item.value });
		// 	},
		// 	plugins: {
		// 		sort: {
		// 			disable: true
		// 		}
		// 	},
		// }),
	]);

	const {
		headerRows,
		pageRows,
		tableAttrs,
		tableBodyAttrs,
		flatColumns,
		pluginStates,
	} = table.createViewModel(columns);

	// const {pageSize, pageIndex } = pluginStates.page;

	const { sortKeys } = pluginStates.sort;
	const { columnWidths } = pluginStates.resize;

	const { hiddenColumnIds } = pluginStates.hide;
	const hideableCols = ["cum_twrr_cons", "cik", "qtr_return_yahoo", "qtr_return_yahoo"];
	const initialHiddenColumnIds = ['cik', 'cum_twrr_cons', 'qtr_return_yahoo'];
	const ids = flatColumns.map((c) => c.id);
	let hideForId = Object.fromEntries(ids.map((id) => [id, !initialHiddenColumnIds.includes(id)]));
	
	$: $hiddenColumnIds = Object.entries(hideForId)
	.filter(([, hide]) => !hide)
	.map(([id]) => id);

	
	let { pageIndex, pageSize } = pluginStates.page;

	$: q = $page.url.searchParams.get('q') || '';
	$: skip_param = Number($page.url.searchParams.get('skip') || 0);
	$: limit_param = Number($page.url.searchParams.get('limit') || 0);

	$: filter = q || '';
	$: $pageSize =  limit_param || 7;
	$: $pageIndex = (skip_param / limit_param) || 0;


	$:_totalRows = data[0].num_entries;
	$: _totalPages = Math.ceil(_totalRows / $pageSize)


	const { selectedDataIds } = pluginStates.select;
	

	$: _sortKeys = $sortKeys;
	
	$: _totalViewedEntries = ($pageIndex * $pageSize + $pageRows.length)

	$: _hasNextPage = $pageIndex + 1 < _totalPages;
	$: _hasPreviousPage = $pageIndex > 0;

	$: order_by = _sortKeys[0]?.id || '';
	$: order_dir = _sortKeys[0]?.order || '';

	export const pathname = $page.url.pathname;

	const handleFilterChange = debounce(() => {
	goto(`${pathname}?limit=${$pageSize}&skip=${$pageSize * $pageIndex}&q=${filter}&order_by=${order_by}&order_dir=${order_dir}`,
		{  replaceState: true, keepFocus: true });
  }, 200);


</script>

<div class="w-full">
	<div class="mb-4 flex items-center gap-4">
		<Input
		class="max-w-sm" 
		placeholder="Search investors..."
		type="search"
		bind:value={filter}
		on:input={handleFilterChange} 
	/>
	
		<DropdownMenu.Root>
			<DropdownMenu.Trigger asChild let:builder>
				<Button variant="outline" class="ml-auto" builders={[builder]}>
					Columns <ChevronDown class="ml-2 h-4 w-4" />
				</Button>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content>
				{#each flatColumns as col}
					{#if hideableCols.includes(col.id)}
						<DropdownMenu.CheckboxItem
							bind:checked={hideForId[col.id]}
						>
							{col.header}
						</DropdownMenu.CheckboxItem>
					{/if}
				{/each}
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</div>
	<div class="rounded-md border">
		<Table.Root {...$tableAttrs}>
			<Table.Header>
				{#each $headerRows as headerRow}
					<Subscribe rowAttrs={headerRow.attrs()}>
						<Table.Row>
							{#each headerRow.cells as cell (cell.id)}
								<Subscribe
									attrs={cell.attrs()}
									let:attrs
									props={cell.props()}
									let:props
								>
								<!-- class="max-w-[14ch]" -->
								<!-- class="w-1/7" -->
								<Table.Head 
									{...attrs}
									>
										{#if props.sort.disabled}
											<Render of={cell.render()} />
										{:else}
										<Button variant="ghost" on:click={(e) => {
											props.sort.toggle(e);
											handleFilterChange();
										}}>
											<Render of={cell.render()} />
											
											{#if props.sort.order === 'asc'}
												<ChevronUp class="ml-2 h-4 w-4" />
											{:else if props.sort.order === 'desc'}
												<ChevronDown class="ml-2 h-4 w-4" />
												{:else}
												<CaretSort class="ml-2 h-4 w-4" />
											{/if}
										</Button>
										{/if}
									</Table.Head>
								</Subscribe>
							{/each}
						</Table.Row>
					</Subscribe>
				{/each}
			</Table.Header>
			<Table.Body {...$tableBodyAttrs}>
				{#each $pageRows as row (row.id)}
					<Subscribe rowAttrs={row.attrs()} let:rowAttrs>
						<Table.Row
							{...rowAttrs}
							data-state={$selectedDataIds[row.id] && "selected"}
						>
							{#each row.cells as cell (cell.id)}
								<Subscribe attrs={cell.attrs()} let:attrs>
									<Table.Cell 
										{...attrs}
									
									>
                                    {#if cell.id === 'cik_name'}
                                    <!-- <a href="/{row.cells[0].id}"  -->
                                        <!-- // the below works but extremely inneficient -->
                                        <!-- <a href="/{data.find(d => d.cik_name === cell.value)?.cik}" -->
                                        <!-- <a href="/{row.cells.find(c => c.id === 'cik')?.value}"   -->
                                            <a href="/superinvestors/{row.original.cik}"
                                            >{truncate(cell.value, 22).toUpperCase()}</a>

									{:else if ['cum_twrr_yahoo', 'qtr_return_yahoo', 'cum_twrr_cons'].includes(cell.id)}
											<div class:text-center={cell.render()} class:text-green-500={cell.value > 0} class:text-red-500={cell.value <= 0}>
												{cell.render()}
												<!-- <Render of={cell.render()} /> -->
											</div>

											{:else if [ 'value', 'num_assets', 'cik', 'cum_twrr_yahoo', 'qtr_return_yahoo', 'cum_twrr_cons'].includes(cell.id)}
											<div class="text-center">{cell.render()}
											</div>
												
                                    {:else}
                                        <Render of={cell.render()} />
                                    {/if}
									</Table.Cell>
								</Subscribe>
							{/each}
						</Table.Row>
					</Subscribe>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>
	<div class="flex items-center justify-end space-x-2 py-4">
		<div class="flex-1 text-sm text-muted-foreground">
			{_totalViewedEntries} of 
			{_totalRows} Entries
		</div>
		<Button 
			variant="outline"
			size="sm" 
			on:click={() => {$pageIndex = $pageIndex - 1;
							handleFilterChange();}}
			disabled={!_hasPreviousPage}>Previous</Button>
		<div class="flex text-sm text-muted-foreground">
			{$pageIndex + 1} of {_totalPages} Pages			
		<!-- <span> {$pageIndex + 1} out of {$pageCount}</span> -->
		</div>

		<Button
			variant="outline"
			size="sm"
			disabled={!_hasNextPage}
			on:click={() => {
				$pageIndex = $pageIndex + 1,
				handleFilterChange()
			}}>Next</Button
		>
	</div>
</div>


<!-- #TODO: Server side search and paginatin mostly work, but needs refinement. Sort is not implemented yet at all -->