<template>
  <el-card
    class="card-view"
    :style="{
      backgroundColor: randomColor(),
    }"
  >
    <div id="myChart" :style="{width: pxData.wpx+'px',height: pxData.hpx+'px'}"></div>
  </el-card>
</template>

<script>
import { request } from '@/api/service'
export default {
  sort: 6,
  title: 'Tendance des Connexions',
  name: 'userLogin',
  icon: 'el-icon-s-data',
  description: 'Évolution des connexions utilisateurs',
  height: 28,
  width: 20,
  isResizable: true,
  props: {
    pxData: {
      type: Object,
      require: false,
      default: () => ({
        wpx: 0,
        hpx: 0
      })
    }
  },
  watch: {
    pxData: {
      handler () {
        if (this.myChart) {
          this.myChart.resize({ width: this.pxData.wpx, height: this.pxData.hpx })
        }
      },
      immediate: true,
      deep: true
    }
  },
  data () {
    this.myChart = null
    return {
      data: [],
      radio: '7'
    }
  },
  methods: {
    initGet () {
      request({
        url: '/api/system/datav/login_user/'
      }).then((res) => {
        this.data = res.data.login_user
        this.drawLine(this.data)
      })
    },
    randomColor () {
      const color = ['#fffff']
      const ran = Math.floor(Math.random() * 4)
      return color[ran]
    },
    drawLine () {
      const xAxisData = this.data.map(item => item.day)
      const seriesData = this.data.map(item => item.count)

      const option = {
        title: {
          text: 'Tendance des Connexions',
          textStyle: {
            color: '#666666',
            fontSize: 14,
            fontWeight: '600'
          },
          left: 'left'
        },
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          textStyle: {
            color: '#666'
          },
          axisPointer: {
            lineStyle: {
              color: '#999',
              type: 'dotted',
              width: 1
            }
          },
          formatter: params => {
            const param = params[0]
            return `<div style="padding: 8px;"><div style="color: #333;">${param.name}</div><div style="color: #FFA500;">${param.value} connexion(s)</div></div>`
          }
        },
        legend: {
          data: ['Connexions'],
          textStyle: {
            color: '#666',
            fontSize: 12
          }
        },
        grid: {
          top: 40,
          left: 50,
          right: 65,
          bottom: 60
        },
        xAxis: {
          data: xAxisData,
          boundaryGap: false,
          axisLine: {
            lineStyle: {
              color: '#aaa',
              width: 1
            }
          },
          axisLabel: {
            interval: 'auto',
            maxInterval: 1,
            rotate: 0,
            textStyle: {
              color: '#333',
              fontSize: 12
            }
          }
        },
        yAxis: {
          axisLine: {
            lineStyle: {
              color: '#aaa',
              width: 1
            }
          },
          axisLabel: {
            textStyle: {
              color: '#333',
              fontSize: 12
            }
          },
          splitLine: {
            lineStyle: {
              color: '#ddd',
              type: 'dotted',
              width: 1
            }
          }
        },
        series: [
          {
            name: 'Connexions',
            type: 'line',
            data: seriesData,
            symbol: 'circle',
            smooth: true,
            symbolSize: 6,
            lineStyle: {
              color: 'rgba(0, 128, 255, 0.8)',
              width: 2
            },
            itemStyle: {
              color: 'rgba(0, 128, 255, 0.8)',
              borderColor: 'rgba(0, 128, 255, 1)',
              borderWidth: 1
            },
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: 'rgba(140,189,250, 0.8)'
                  },
                  {
                    offset: 1,
                    color: 'rgba(0, 128, 255, 0)'
                  }
                ]
              }
            }
          }
        ]
      }

      this.myChart.setOption(option)
    }
  },
  mounted () {
    this.myChart = this.$echarts.init(document.getElementById('myChart'))
    this.initGet()
    this.drawLine()
  }
}
</script>

<style scoped lang="scss">
.card-view {
  color: $color-primary;
}
.el-card{
  height: 100%;
}
::v-deep .el-card__body {
  width: 100%;
  height: 100%;
}

.el-radio-button__inner {
  border-radius: 20px;
}
</style>
