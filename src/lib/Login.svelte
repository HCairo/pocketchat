<script lang="ts">
    import { currentUser, pb } from "./pocketbase";

    let username: string;
    let password: string;

    // Fonction de connexion
    async function login() {
        await pb.collection('users').authWithPassword(username, password);
    }

    // Fonction d'inscription
    async function signUp() {
        try {
            const data = {
                username,
                password,
                passwordConfirm: password,
                name: username,
            };
            const createdUser = await pb.collection('users').create(data);
            await login();
        } catch (err) {
            console.error(err);
        }
    }

    // Fonction de déconnexion
    function signOut() {
        pb.authStore.clear();
    }
</script>

<!-- Affichage conditionnel en fonction de l'état de connexion de l'utilisateur -->
{#if $currentUser}
    <p>Connecté en tant que {$currentUser.username}
    <button on:click={signOut}>Se déconnecter</button>
    </p>
{:else}
    <form on:submit|preventDefault>

        <input
            placeholder="Nom d'utilisateur"
            type="text"
            bind:value={username}
        />

        <input
            placeholder="Mot de passe"
            type="password"
            bind:value={password}
        />
        <button on:click={signUp}>S'inscrire</button>
        <button on:click={login}>Se connecter</button>
    </form>
{/if}