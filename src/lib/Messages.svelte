<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { currentUser, pb } from './pocketbase';

  let newMessage: string;
  let messages: any[] = [];
  let unsubscribe: () => void;

  // Fonction appelée lors du montage du composant
  onMount(async () => {
    // Récupérer les messages initiaux
    const resultList = await pb.collection('messages').getList(1, 50, {
      sort: 'created',
      expand: 'user',
    });
    messages = resultList.items;

    // S'abonner aux messages en temps réel
    unsubscribe = await pb
      .collection('messages')
      .subscribe('*', async ({ action, record }) => {
        if (action === 'create') {
          // Récupérer l'utilisateur associé
          const user = await pb.collection('users').getOne(record.user);
          record.expand = { user };
          messages = [...messages, record];
        }
        if (action === 'delete') {
          messages = messages.filter((m) => m.id !== record.id);
        }
      });
  });

  // Désabonner des messages en temps réel
  onDestroy(() => {
    unsubscribe?.();
  });

  // Fonction pour envoyer un message
  async function sendMessage() {
    const data = {
      text: newMessage,
      user: $currentUser.id,
    };
    const createdMessage = await pb.collection('messages').create(data);
    newMessage = '';
  }
</script>

<!-- Affichage des messages -->
<div class="messages">
  {#each messages as message (message.id)}
    <div class="msg">
      <img
        class="avatar"
        src={`https://api.dicebear.com/9.x/notionists-neutral/svg?/${message.expand?.user?.username}.svg`}
        alt="avatar"
        width="40px"
      />
      <div>
        <small>
          Envoyé par @{message.expand?.user?.username}
        </small>
        <p class="msg-text">{message.text}</p>
      </div>
    </div>
  {/each}
</div>

<!-- Formulaire pour envoyer un nouveau message -->
<form on:submit|preventDefault={sendMessage}>
  <input placeholder="Message" type="text" bind:value={newMessage} />
  <button type="submit">Envoyer</button>
</form>