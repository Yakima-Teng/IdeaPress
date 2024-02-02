<template>
  <div class="hero-banner">
    <div class="slogan">
      <div class="site-title">
        {{ mainTitle }}
      </div>
      <div class="site-desc">
        {{ subTitle }}
      </div>
      <div class="buttons">
        <a
          v-for="(item, idx) in buttonList"
          :key="idx"
          :href="item.link"
          target="_blank"
          class="button"
        >
          <span>{{ item.label }}</span>
        </a>
      </div>
      <slot name="default" />
    </div>
  </div>
</template>

<script lang="ts" setup>
interface IButton {
  label: string
  link: string
}

interface IProps {
  mainTitle: string
  subTitle: string
  buttonList: IButton[]
}

defineProps<IProps>()
</script>

<style lang="scss" scoped>
.hero-banner {
  text-shadow: 0 1px 3px rgba(0,0,0,.4), 0 0 30px rgba(0,0,0,.075);
  display: block;
  height: 500px;
  box-sizing: border-box;
  padding-top: 20px;
  background-color: #7b4397;
  background-image: url('../assets/images/bg-pattern.png'), linear-gradient(20deg, #48c274, #247cdc);
  color: #ffffff;
  .slogan {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    height: calc(100% - 20px);
    .site-title {
      font-size: 56px;
      line-height: 1.8;
    }
    .site-desc {
      font-size: 40px;
      line-height: 1.5;
    }
    .buttons {
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 15px 0;
      .button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 8px 12px;
        border-radius: 4px;
        border: 1px solid;
        color: #ffffff;
        text-decoration: none;
        &:nth-of-type(n + 2) {
          margin-left: 8px;
        }
        &:nth-of-type(4n + 1) {
          background-color: rgb(51, 122, 183);
          border-color: rgb(46, 109, 164);
        }
        &:nth-of-type(4n + 2) {
          background-color: rgb(217, 83, 79);
          border-color: rgb(212, 63, 58);
        }
        &:nth-of-type(4n + 3) {
          background-color: rgb(240, 173, 78);
          border-color: rgb(238, 162, 54);
        }
        &:nth-of-type(4n) {
          background-color: rgb(92, 184, 92);
          border-color: rgb(76, 174, 76);
        }
        span {
          background-color: rgba(0, 0, 0, 0.1);
          padding: 4px 8px;
          border-radius: 3px;
        }
      }
    }
  }
}
</style>
