<script lang="ts">
  export let show = false;
  export let iframeName: string;
  export let iframeSrc: string;
  export let handleIframeRef: (iframeRef: HTMLIFrameElement) => void;
  export let handleClose: () => void;

  const isMobile = window.innerWidth < 640;

  let iframeRef: HTMLIFrameElement;
  let dialogRef: HTMLDialogElement;

  let dragging = false;
  let startX = 0;
  let startY = 0;
  let offsetX = isMobile ? 0 : window.innerWidth - 20 - 400;
  let offsetY = isMobile ? 0 : 20;

  $: if (iframeRef) handleIframeRef(iframeRef);
  $: show ? dialogRef?.showModal() : dialogRef?.close();

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
    dialogRef?.close();
    handleClose();
  };
</script>

<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<dialog
  bind:this={dialogRef}
  class="popup_container"
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
</dialog>

<style>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    outline: none;
    border: none;
  }

  dialog {
    box-shadow: none;
  }
  dialog::backdrop {
    background-color: transparent;
  }

  .popup_container[open] {
    overscroll-behavior: none;
    z-index: 2147483646;
    display: grid;
    position: fixed;
    grid-template-rows: auto 1fr;
    overflow: hidden;
    background-color: white;
    cursor: move;
    filter: drop-shadow(0 10px 8px rgb(0 0 0 / 0.04))
      drop-shadow(0 4px 3px rgb(0 0 0 / 0.1));
    animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  @media (max-width: 640px) {
    .popup_container {
      width: 100vw;
      max-width: 100vw;
      height: 100dvh;
      max-height: 100dvh;
      border-radius: 0;
    }
  }
  @media (min-width: 640px) {
    .popup_container {
      width: 400px;
      height: 600px;
      border-radius: 0.75rem;
    }
  }

  .popup_nav {
    padding-top: 0.5rem;
    padding-left: 1rem;
    padding-bottom: 0.5rem;
    background-color: #f3f4f6;
  }
  .popup_nav_close {
    border-radius: 1rem;
    width: 2rem;
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

  @keyframes zoom {
    from {
      transform: scale(0.9);
    }
    to {
      transform: scale(1);
    }
  }
</style>
