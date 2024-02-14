<script lang="ts">
	import { cn } from "$lib/utils";
	import { page } from "$app/stores";

	let className: string | undefined | null = undefined;
	export { className as class };

	$: isActive = (href: string) => $page.url.pathname === href;
</script>

<nav class={cn("flex items-center space-x-4 lg:space-x-6", className)}>
	<a
		href="/"
		class:text-primary={isActive('/')}
		class="text-sm font-medium transition-colors hover:text-primary {isActive('/') ? '' : 'text-muted-foreground'}"
	>
		Home
	</a>

	<a
		href="/superinvestors"
		class:text-primary={isActive('/superinvestors')}
		class="text-sm font-medium transition-colors hover:text-primary {isActive('/superinvestors') ? '' : 'text-muted-foreground'}"
	>
		Superinvestors
	</a>

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
