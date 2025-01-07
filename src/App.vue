<template>
  <input class="button" type="file" @change="onFileChange" />
  <HelloWorld :url="url" />
</template>

<script lang="ts" setup>
import { ref } from "vue";
import HelloWorld from "./components/HelloWorld.vue";

const url = ref<string>('https://images.quarksb.com/2024-b0a85183df23.png');

function onFileChange(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    const blob = new Blob([file], { type: file.type });
    url.value = URL.createObjectURL(blob);
  }
}
</script>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
.button {
  position: fixed;
  right: 1em;
  top: 1em;
  padding: 0.5em 1em;
  font-size: 1em;
  background-color: #42b883;
  color: white;
  border: none;
  border-radius: 0.5em;
  cursor: pointer;
}
</style>
