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

export const gridUsage = `<script>
  import { Card, Col, Container, Row } from '@sveltier/ui';

  const accounts = [
    { id: 1, name: 'Current account', note: '•• 4821' },
    { id: 2, name: 'Savings', note: 'Instant access' },
    { id: 3, name: 'Travel', note: 'Euro wallet' }
  ];
</script>

<Container>
  <!-- One card a line on a phone, two from sm (600px), three from md (960px). -->
  <Row>
    {#each accounts as account (account.id)}
      <Col cols={12} sm={6} md={4}>
        <Card title={account.name} subtitle={account.note} />
      </Col>
    {/each}
  </Row>
</Container>`;

export const gridSplit = `<script>
  import { Col, Row } from '@sveltier/ui';
</script>

<!-- A statement and its summary: stacked on a phone, eight columns and four from md. -->
<Row gap={34} align="start">
  <Col cols={12} md={8}>…</Col>
  <Col cols={12} md={4}>…</Col>
</Row>`;
