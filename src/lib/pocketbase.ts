import PocketBase from 'pocketbase';
import { writable } from 'svelte/store';

// Crée une instance de PocketBase pointant vers le serveur local
export const pb = new PocketBase('http://127.0.0.1:8090'); 

// Crée un store Svelte pour l'utilisateur actuel
export const currentUser = writable(pb.authStore.model);

// Met à jour le store lorsqu'il y a un changement dans l'état d'authentification
pb.authStore.onChange((auth) => {
    console.log('authStore changed', auth);
    currentUser.set(pb.authStore.model);
});