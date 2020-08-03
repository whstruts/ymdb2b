<template>
  <div class="news-pages">
    <div class="w1200 flex">
      <div class="news-left">
        <div class="news-breadcrumb">
          <el-breadcrumb separator-class="el-icon-arrow-right" >
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item :to="{path:'/drugnews/newslist'}" class="colorfontsize">药头条列表</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="news-content">
          <!-- <el-tabs v-model="activeName" @tab-click="handleClick" class="tabs">
            <el-tab-pane
              v-for="(item) in editableTabs"
              :key="item.name"
              :label="item.title"
              :name="item.name"
            >
              
            </el-tab-pane>
          </el-tabs> -->
          <content-wrap>
              </content-wrap>
        </div>
      </div>
    </div>
  </div>
</template>
           
<script>
import API from '../../api/api_drug'
import contentWrap from '../drugnews/component/content'

export default {
  components:{contentWrap},
  data() {
    return {
      activeName: '1',
      newslists:[],
    };
  },
  created() {
    // this.newsinfo()
  },
  methods: {
    // handleClick(tab, event) {
    //   console.log(tab, event);
    // },
    // newsinfo() {
    //   API.newslists({params:1}).then(res => {
    //     if (res.code == 0) {
    //       console.log(res);
    //      this.newslists = res.page.rows
    //     }
    //   })
    // }
  }
};
</script>
<style lang="scss">
  .news-pages {
    width: 100%;
    padding-top: 50px;
    background-color: #F6F6F6;
    .flex {
    display: flex;
    
  }
  .tabs {
    margin: 0 30px;
  }
  .news-left {
    flex: 2;
  }
  .news-content,
  .news-notice {
    background-color: #fff;
    margin-bottom: 100px;
  }
  .news-notice {
    min-height: 600px;
    text-align: center;
    font-size: 18px;
    height: 328px;
    line-height: 328px;
  }
  .news-right {
    flex: 1;
    margin-left: 10px;
  }
  .news-title {
    font-size: 18px;
    margin-bottom: 10px;
  }
  .news-breadcrumb {
    margin-bottom: 28px;
  }
  .colorfontsize span {
    color:#2F9FFE !important;
  }
  }
  
</style>