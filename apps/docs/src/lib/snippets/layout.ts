// Code samples for the layout pages, shown on the pages and in llms-full.txt.

export const appLayoutUsage = `<!-- src/routes/+layout.svelte -->
<script>
  import { mdiBank, mdiCreditCard, mdiMagnify, mdiSwapHorizontal } from '@mdi/js';
  import { page } from '$app/state';
  import {
    AppBar,
    AppLayout,
    Button,
    Icon,
    List,
    ListItem,
    Main,
    NavigationDrawer,
    UIProvider
  } from '@sveltier/ui';
  import { monolith } from '@sveltier/ui/themes/monolith';

  let { children } = $props();

  const pages = [
    { title: 'Accounts', href: '/accounts', icon: mdiBank },
    { title: 'Payments', href: '/payments', icon: mdiSwapHorizontal },
    { title: 'Cards', href: '/cards', icon: mdiCreditCard }
  ];
</script>

<UIProvider themes={monolith}>
  <AppLayout>
    <AppBar title="Ledger">
      {#snippet actions()}
        <Button icon variant="text" color="neutral" aria-label="Search">
          <Icon path={mdiMagnify} />
        </Button>
      {/snippet}
    </AppBar>
    <NavigationDrawer>
      <List nav>
        {#each pages as item (item.href)}
          <ListItem
            title={item.title}
            href={item.href}
            active={page.url.pathname.startsWith(item.href)}
          >
            {#snippet prepend()}<Icon path={item.icon} />{/snippet}
          </ListItem>
        {/each}
      </List>
    </NavigationDrawer>
    <Main>{@render children()}</Main>
  </AppLayout>
</UIProvider>`;

export const appLayoutCorner = `<!-- The bar first: it runs across the top, the drawer starts under it. -->
<AppLayout>
  <AppBar title="Ledger" />
  <NavigationDrawer>…</NavigationDrawer>
  <Main>…</Main>
</AppLayout>

<!-- The drawer first: it runs the full height, the bar sits beside it. -->
<AppLayout>
  <NavigationDrawer>…</NavigationDrawer>
  <AppBar title="Ledger" />
  <Main>…</Main>
</AppLayout>`;

export const appLayoutRail = `<script>
  import { mdiChevronLeft, mdiChevronRight } from '@mdi/js';
  import { Icon, List, ListItem, NavigationDrawer } from '@sveltier/ui';

  let rail = $state(false);
</script>

<!-- From the breakpoint up, rail narrows the drawer to its icons. -->
<NavigationDrawer {rail}>
  <List nav>…</List>
  <!-- margin-block-start: auto puts the toggle at the bottom of the drawer. -->
  <List nav style="margin-block-start: auto">
    <ListItem title={rail ? 'Expand' : 'Collapse'} onclick={() => (rail = !rail)}>
      {#snippet prepend()}<Icon path={rail ? mdiChevronRight : mdiChevronLeft} />{/snippet}
    </ListItem>
  </List>
</NavigationDrawer>`;
