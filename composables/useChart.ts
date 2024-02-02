import { onBeforeUnmount, onMounted, ref, nextTick, unref } from 'vue'
import type { Ref } from 'vue'
import * as echarts from 'echarts'
import type { EChartsType } from 'echarts'

export const useChart = (refChart: Ref<null | HTMLDivElement>) => {
  const funcFetchOption = ref<() => Promise<Record<string, any>>>(() => Promise.resolve({}))
  const updateFuncFetchOption = (func: () => Promise<Record<string, any>>) => {
    funcFetchOption.value = func
  }

  let myChart: null | EChartsType = null

  const resizeMyChart = () => {
    if (!myChart) return
    myChart.resize()
  }

  const initChart = async () => {
    await nextTick()
    // 获取配置项
    const options = await funcFetchOption.value()
    // 基于准备好的dom，初始化echarts实例
    console.log(unref(refChart))
    myChart = echarts.init(unref(refChart))
    // 绘制图表
    myChart.setOption(options)
  }

  onBeforeUnmount(() => {
    if (myChart) {
      myChart.dispose()
    }
    window.removeEventListener('resize', resizeMyChart)
  })
  onMounted(async () => {
    console.log('toStart')
    await initChart()
    window.addEventListener('resize', resizeMyChart)
  })

  return {
    updateFuncFetchOption
  }
}
