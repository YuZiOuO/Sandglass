<template>
  <div
    style="
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      height: 48px;
      padding: 0 24px;
      align-items: center;
    "
  >
    <div></div>
    <NavBarMenu />
    <div style="display: flex; justify-content: flex-end">
      <NavBarDropdown />
    </div>
  </div>
</template>

<script setup lang="ts">
import NavBarDropdown from './NavBarDropdown.vue'
import NavBarMenu from './NavBarMenu.vue'
</script>
