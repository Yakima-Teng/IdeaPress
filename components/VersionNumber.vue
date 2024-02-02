<template>
  <div class="version-number">
    <div class="left">
      {{ left }}
    </div>
    <div class="right">
      {{ right }}
    </div>
  </div>
</template>

<script lang="ts" setup>
interface IProps {
  left: string
  right: string
}
defineProps<IProps>()
</script>

<style lang="scss" scoped>
.version-number {
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  font-size: 12px;
  color: #ffffff;
  font-weight: normal;
  .left {
    background-color: #555555;
    padding: 3px 6px;
  }
  .right {
    background-color: #97ca00;
    padding: 3px 6px;
  }
}
</style>
