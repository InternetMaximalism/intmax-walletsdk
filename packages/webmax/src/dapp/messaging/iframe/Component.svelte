<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let show = false;
  export let iframeName: string;
  export let iframeSrc: string;
  export let handleIframeRef: (iframeRef: HTMLIFrameElement) => void;
  export let handleClose: () => void;

  let iframeRef: HTMLIFrameElement;

  let dragging = false;
  let startX = 0;
  let startY = 0;
  let offsetX = window.innerWidth - 20 - 400;
  let offsetY = 20;

  $: if (iframeRef) handleIframeRef(iframeRef);

  const onMouseDown = (e: MouseEvent) => {
    dragging = true;
    startX = e.clientX - offsetX;
    startY = e.clientY - offsetY;
  };
  const onMouseUp = () => {
    dragging = false;
  };
  const onMouseMove = (e: MouseEvent) => {
    if (!dragging) return;
    offsetX = e.clientX - startX;
    offsetY = e.clientY - startY;
  };

  const onClose = () => {
    show = false;
    handleClose();
  };
</script>

<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<div
  role="dialog"
  class="popup_container"
  style:display={show ? "grid" : "none"}
  style="left: {offsetX}px; top: {offsetY}px"
  on:mousedown|preventDefault|stopPropagation={onMouseDown}
  on:mouseup|preventDefault|stopPropagation={onMouseUp}
  on:mousemove|preventDefault|stopPropagation={onMouseMove}
>
  <div class="popup_nav">
    <button class="popup_nav_close" on:click={onClose}></button>
  </div>
  <div class="iframe_container">
    <iframe
      bind:this={iframeRef}
      class="iframe_main"
      title={iframeName}
      src={iframeSrc}
    />
  </div>
</div>

<style>
  .popup_container {
    position: fixed;
    grid-template-rows: auto 1fr;
    width: 400px;
    height: 600px;
    overflow: hidden;
    border-radius: 0.75rem;
    background-color: white;
    cursor: move;
    filter: drop-shadow(0 10px 8px rgb(0 0 0 / 0.04))
      drop-shadow(0 4px 3px rgb(0 0 0 / 0.1));
  }
  .popup_nav {
    padding-top: 0.5rem;
    padding-left: 1rem;
    padding-bottom: 0.5rem;
    background-color: #f3f4f6;
  }
  .popup_nav_close {
    border-radius: 1rem;
    width: 1rem;
    height: 1rem;
    background-color: #ef4444;
  }

  .iframe_container {
    overflow: hidden;
  }

  .iframe_main {
    width: 100%;
    height: 100%;
    border: none;
  }
</style>
