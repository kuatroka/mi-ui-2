<script lang="ts">
	import DataTable from "$lib/components/datatable-sup-overview/data-table.svelte";
	export let data;
	$: entries_cik = data.ciks;

</script>

<div class="container mx-auto py-10">
	<DataTable data={entries_cik}
	/>
</div>