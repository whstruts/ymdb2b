<template>
  <div class="layout">
    <div v-for="(item ,index) in newslists.data" :key="index" v-if="index < 3">
      <div class="layout-box"  @click="newsdetails(item.id)">
        <div class="layout-content">
          <div class="content">
            <div class="content-title">
              <h3>{{item.title}}</h3>
            </div>
            <div
              class="content-body"
            >{{item.createTime}}</div>
            <!-- <div class="content-foot">
              <i class="iconfont icon-tupian-copy-copy"></i>
              <div class="browse">{{item.browse}}</div>
            </div> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import API from '../../../api/api_drug'
export default {
  name:'hotscententWrap',
  props:{},
   data() {
    return {
      newslists:{
        data: [],
      }
    }
  },
  created() {
    this.newinfo()
  },
  methods: {
    newinfo() {
      API.newslists().then(res => {
        if (res.code == 0) {
          this.newslists.data = res.page.rows
          this.newslists.total = res.page.total
        }
      })
    },
    newsdetails(id) {
      this.$emit('jump',id)
    }
  },
}
</script>
<style scoped>
  .layout {
    width: 100%;
    box-sizing: border-box;
  }
  .layout-box {
    padding: 30px 20px;
    /* margin: 0 30px; */
    /* height: 120px; */
    border-bottom: 1px solid #F0F0F0;
  }
  .layout-box:hover {
    background-color: #fcfcfc;
    cursor: pointer;
  }
  .img img {
    margin-right: 20px
  }
  .layout-content {
    display: flex;
  }
  .content-title h3 {
    font-size: 17px;
    margin-bottom: 15px;
  }
  .content-title h3:hover {
    color:#1a5eb1;
  }
  .content-body {
    font-size: 13px;
    height: 44px;
    line-height: 22px;
    overflow: hidden;
    margin-bottom: 25px;
    color: #999999;
  }
  .content-foot {
    color: #999999;
  }
  .content-foot .browse {
    display: inline;
  }
</style>
