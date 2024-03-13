<script lang="ts">
	import { cn } from "$lib/utils";
	import { page } from "$app/stores";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
	import { Button } from "$lib/components/ui/button";

	let className: string | undefined | null = undefined;
	export { className as class };

	$: isActive = (href: string) => $page.url.pathname === href;

	// Define the dropdown item routes
    const dropdownRoutes = ['/overview', '/superinvestors', '/assets', '/positions'];

    // Reactive statement to check if the current route is one of the dropdown item routes
    $: isDropdownRouteActive = dropdownRoutes.some(route => $page.url.pathname.startsWith(route));
</script>

<nav class={cn("flex items-center space-x-4 lg:space-x-6", className)}>
	<a
		href="/"
		class:text-primary={isActive('/')}
		class="text-sm font-medium transition-colors hover:text-primary {isActive('/') ? '' : 'text-muted-foreground'}"
	>
		Home
	</a>

	<DropdownMenu.Root>
		<DropdownMenu.Trigger asChild let:builder>
			<Button
            variant="ghost"
            class="w-16 h-8 p-0 text-muted-foreground  hover:text-primary {isDropdownRouteActive ? 'text-primary' : ''}"
            builders={[builder]}
        >Insights</Button>
		</DropdownMenu.Trigger>
		<DropdownMenu.Content class="w-32">
			<DropdownMenu.Item href="/overview">Overview</DropdownMenu.Item>
			<DropdownMenu.Item href="/superinvestors">Superinvestors</DropdownMenu.Item>
			<DropdownMenu.Item href="/assets">Assets</DropdownMenu.Item>
			<DropdownMenu.Item href="/positions">Positions</DropdownMenu.Item>
		</DropdownMenu.Content>
	</DropdownMenu.Root>

	<a
		href="/shadcn-table"
		class:text-primary={isActive('/shadcn-table')}
		class="text-sm font-medium transition-colors hover:text-primary {isActive('/shadcn-table') ? '' : 'text-muted-foreground'}"
	>
		Table
	</a>

	<a
	href="/faq"
	class:text-primary={isActive('/faq')}
	class="text-sm font-medium transition-colors hover:text-primary {isActive('/faq') ? '' : 'text-muted-foreground'}"
>
	FAQ
</a>
	<a
	href="/playground"
	class:text-primary={isActive('/playground')}
	class="text-sm font-medium transition-colors hover:text-primary {isActive('/playground') ? '' : 'text-muted-foreground'}"
>
	playground
	</a>


</nav>
