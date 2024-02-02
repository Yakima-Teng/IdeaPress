<template>
  <div class="rectangle-boxes">
    <div class="block-line" />
    <div class="block-title">
      {{ title }}
    </div>
    <div class="block-desc">
      {{ desc }}
    </div>
    <div class="boxes">
      <div
        v-for="item in list"
        :key="item.title"
        class="box"
      >
        <div
          class="box-image"
          @click="openLink(item.link)"
        >
          <div
            class="img"
            :style="{ backgroundImage: `url('${item.imgUrl}')` }"
          />
        </div>
        <div class="box-title">
          {{ item.title }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
interface IListItem {
  title: string
  imgUrl: string
  link: string
}
interface IProps {
  title: string
  desc: string
  list: IListItem[]
}

defineProps<IProps>()

const openLink = (linkUrl: string) => {
  if (!linkUrl) {
    return
  }
  if (linkUrl.startsWith('http') && !linkUrl.startsWith(location.origin)) {
    window.open(linkUrl, '_blank')
    return
  }
  window.open(linkUrl, '_self')
}
</script>

<style lang="scss" scoped>
.rectangle-boxes {
  display: block;
  background-color: #ffffff;
  padding: 54px 20px 100px;
  max-width: 1200px;
  margin: 0 auto;
  .block-line {
    display: block;
    width: 24px;
    height: 4px;
    background-color: #3370ff;
    margin: 0 auto 12px;
    border-radius: 2px;
  }
  .block-title {
    display: block;
    text-align: center;
    font-size: 32px;
    font-weight: 700;
    margin: 1em 0;
  }
  .block-desc {
    display: block;
    text-align: center;
    font-size: 16px;
    line-height: 1.5;
    color: #646a73;
    margin-top: 30px;
  }
  .boxes {
    display: flex;
    align-items: flex-start;
    justify-content: space-evenly;
    flex-wrap: wrap;
    margin: 70px 0 0 -20px;
    text-align: center;
  }
  .box {
    display: block;
    width: 20%;
    margin-top: 10px;
    margin-left: 6%;
    &:nth-of-type(4n + 1) {
      margin-left: 0;
    }
    .box-image {
      position: relative;
      display: block;
      width: 100%;
      height: 0;
      padding-top: 80%;
      cursor: pointer;
      transition: 300ms all linear 0ms;
      background-color: #f5f5f5;
      &:hover {
        transform: scale(1.05) translateY(-1px);
        box-shadow: 0 6px 20px 0 rgba(0, 0, 0, 0.15);
      }
      .img {
        position: absolute;
        z-index: 1;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        padding: 10px;
        background: transparent scroll no-repeat center center;
        background-size: cover;
        background-clip: content-box;
        box-sizing: border-box;
      }
    }
    .box-title {
      display: block;
      font-size: 20px;
      font-weight: 600;
      margin-top: 30px;
      margin-bottom: 1em;
    }
  }
}
@media screen and (max-width: 800px) {
  .rectangle-boxes {
    .block-line {
      display: none;
    }
    .boxes {
      flex-wrap: wrap;
    }
    .box {
      width: 30%;
      margin-left: 5%;
      &:nth-of-type(3n + 1) {
        margin-left: 0;
      }
      &:nth-of-type(4n + 1) {
        margin-left: 0;
      }
    }
  }
}
@media screen and (max-width: 560px) {
  .rectangle-boxes {
    .box {
      width: 40%;
      margin-left: 2%;
      &:nth-of-type(2n + 1) {
        margin-left: 0;
      }
      &:nth-of-type(3n + 1) {
        margin-left: 0;
      }
      &:nth-of-type(4n + 1) {
        margin-left: 0;
      }
    }
  }
}

@media screen and (max-width: 430px) {
  .rectangle-boxes {
    .box {
      width: 80%;
      margin-left: 0;
      &:nth-of-type(2n + 1) {
        margin-left: 0;
      }
      &:nth-of-type(3n + 1) {
        margin-left: 0;
      }
      &:nth-of-type(4n + 1) {
        margin-left: 0;
      }
    }
  }
}
</style>
