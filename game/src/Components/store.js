import { writable } from 'svelte/store';

export const dimensions = writable({
    width: 0,
    height: 0
});