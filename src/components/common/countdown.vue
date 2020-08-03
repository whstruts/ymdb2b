<template>
  <div class="timeBox">
    <span class="value" v-if="pageData.day > 0" style="display: none">{{ pageData.day }}</span><span class="label"
                                                                                                     v-if="pageData.day > 0" style="display: none">天</span>
    <span class="value">{{ pageData.hour }}</span><span class="label">:</span>
    <span class="value">{{ pageData.minute }}</span><span class="label">:</span>
    <span class="value">{{ pageData.second }}</span>
  </div>
</template>

<script>
  export default {
    name: 'countdown',
    props: {
      time: {
        type: Number
      }
    },
    created() {
      this.interval = setInterval(() => {
        const endTime = this.time - (new Date() / 1000 | 0);
        if (endTime <= 0) {
          clearInterval(this.interval)
          this.$emit('countdownClose');
        }
        let date = {
          day: Math.floor(endTime / 86400),
          hour: Math.floor(endTime % 86400 / 3600),
          minute: Math.floor(endTime % 3600 / 60),
          second: Math.floor(endTime % 3600 % 60)
        }

        Object.keys(date).forEach(value => {
          if (date[value].toString().length < 2 && value !== 'day') {
            this.pageData[value] = "0" + date[value]
          } else {
            this.pageData[value] = date[value]
          }
        })
      }, 1000);
    },
    beforeDestroy() {
      clearInterval(this.interval)
    },
    data() {
      return {
        interval: null,
        pageData: {
          day: '0',
          hour: '00',
          minute: '00',
          second: '00'
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .timeBox {
    .value {
      display: inline-block;
      background: #605751;
      color: #fff;
      text-align: center;
      line-height: 46px;
      font-size: 22px;
      font-weight: bold;
      width: 45px;
      height: 46px;
      margin-top: 20px;
    }
    .label {
      font-size: 22px;
      font-weight: bold;
      color: #605751;
      padding: 0px 5px;
    }
  }

</style>
