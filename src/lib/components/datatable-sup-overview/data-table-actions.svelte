<script lang="ts">
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
    import { Button } from "$lib/components/ui/button";
    import MdiDotsHorizontal from '~icons/mdi/dots-horizontal'
    export let id: string;
  </script>
  <DropdownMenu.Root >
    <DropdownMenu.Trigger asChild let:builder>
      <Button
        variant="ghost"
        builders={[builder]}
        size="icon"
        class="relative w-8 h-8 p-0"
      >
        <span class="sr-only">Open menu</span>
        <MdiDotsHorizontal class="w-4 h-4" />
      </Button>
    </DropdownMenu.Trigger>
    <DropdownMenu.Content>
      <DropdownMenu.Group>
        <DropdownMenu.Label>Actions</DropdownMenu.Label>
        <DropdownMenu.Item on:click={() => navigator.clipboard.writeText(id)}>
          Copy payment ID
        </DropdownMenu.Item>
      </DropdownMenu.Group>
      <DropdownMenu.Separator />
      <DropdownMenu.Item>View customer</DropdownMenu.Item>
      <DropdownMenu.Item>View payment details</DropdownMenu.Item>
    </DropdownMenu.Content>
  </DropdownMenu.Root>