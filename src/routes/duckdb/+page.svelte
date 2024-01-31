<script lang='ts'>
	import { entries } from 'svelte-ux';

    export let data;

    // let el = data.fortytwo || [];



</script>
{#each data.entries as entry }
    <p>{entry.cik} - {entry.quarter}</p>
    
{/each}
