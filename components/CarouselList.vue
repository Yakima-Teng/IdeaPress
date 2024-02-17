<template>
  <div class="carousel-list">
    <el-carousel
      :interval="4000"
      type="card"
      height="300px"
    >
      <el-carousel-item
        v-for="item in carousels"
        :key="item.id"
      >
        <a
          :href="item.link"
          target="_blank"
          rel="noopenner noreferrer"
          :style="{ backgroundImage: `url(${item.img})` }"
          class="img"
        />
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script lang="ts" setup>
interface IProps {
  carousels: TS.ICarousel[]
}
defineProps<IProps>()
</script>

<style lang="scss" scoped>
.carousel-list {
  .el-carousel__item {
    &:nth-child(2n) {
      background-color: #99a9bf;
    }
    &:nth-child(2n + 1) {
      background-color: #d3dce6;
    }

    .img {
      display: block;
      opacity: 1;
      width: 100%;
      height: 100%;
      margin: 0;
      background: transparent scroll no-repeat center center;
      background-size: cover;
      box-sizing: border-box;
      border: 1px solid rgba(200, 200, 200, 1);
    }
  }
}
</style>
