<script lang="ts">
    import '../../app.pcss';
    import { ModeWatcher } from "mode-watcher";
	import { Button } from "$lib/components/ui/button";
	import { Sun, Moon } from "radix-icons-svelte";
	import { toggleMode } from "mode-watcher";

</script>

<ModeWatcher />
<div class="grid grid-flow-col justify-between p-2">
	<nav class="flex gap-8">
		<a href="/">Home</a>
		<a href="/about">About</a>
	</nav>

	<Button on:click={toggleMode} variant="outline" size="icon">
		<Sun
		class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
		/>
		<Moon
		class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
		/>
		<span class="sr-only">Toggle theme</span>
	</Button>	
</div>


<slot />