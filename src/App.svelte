<script lang="ts">
  import Login from "./lib/Login.svelte";
  import Messages from "./lib/Messages.svelte";
  import { currentUser, pb } from "./lib/pocketbase";

</script>

<h1>PocketChat</h1>

<Login />
{#if $currentUser}
<Messages />
{:else}
<p></p>
{/if}