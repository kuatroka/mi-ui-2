<script lang="ts">
    import { Button } from "$lib/components/ui/button";
	import { ModeWatcher } from "mode-watcher";
	import { toggleMode } from "mode-watcher";


    import MdiWeatherSunny from 'virtual:icons/mdi/weather-sunny'
    import MdiWeatherNight from 'virtual:icons/mdi/weather-night'
</script>

<ModeWatcher />

<Button on:click={toggleMode} variant="ghost" size="icon">
    <MdiWeatherSunny
    class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
    />
    <MdiWeatherNight
    class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
    />
    <span class="sr-only">Toggle theme</span>
</Button>

