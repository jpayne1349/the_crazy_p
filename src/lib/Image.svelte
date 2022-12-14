<script lang='ts'>

export let src: string;
export let alt: string;

import { onMount } from 'svelte';
import { fly } from 'svelte/transition';

  let loaded = false;
  let thisImage: HTMLElement;

  onMount(() => {
    thisImage.onload = () => {
      loaded = true
    }
  }) 

</script>


<img {src} {alt} class:loaded bind:this={thisImage} in:fly={{x:50}}/>


<style>
  img {
    opacity: 0;
    transition: opacity 2000ms ease-out;
  }
  img.loaded {
    opacity: 1;
  }
</style>

