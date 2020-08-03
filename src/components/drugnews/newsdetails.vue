<template>
  <div class="news-page">
    <div class="w1200 flex">
      <div class="news-left">
        <div class="news-breadcrumb">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item :to="{path:'/drugnews/newslist'}">药头条列表</el-breadcrumb-item>
            <el-breadcrumb-item :to="{path:'/drugnews/newsdetails'}" class="fontsizecolor">药头条详情</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="news-content">
          <div class="news-title">{{data.title}}</div>
          <div  class="news-time" style="margin-bottom: 10px">
            <p>{{data.createTime}}</p>
            </div>
            <div class="news-body" v-html="data.content">
              <p></p>
            </div>
          </div>
      </div>
      <div class="news-right">
        <div class="hotnews" @click="hots">
          更多热文 >
        </div>
        <div class="hot-centent">
          <hotscontent-wrap @jump="jumproter"></hotscontent-wrap>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import API from '../../api/api_drug'
import hotscontentWrap from './component/hotscontent'
export default {
  components:{hotscontentWrap},
  data() {
    return {
      data:[],
      id: ''
    }
  },
  created() {
    let id= this.$route.query.id;
    this.id = id;
    if(id) {
      this.details(id)
    }
  },
  watch:{
    'id'(newVal){
      console.log(newVal)
    }
  },
  methods: {
     // 动态添加url参数
    funcUrlAdd(params, val) {
      let query = this.$route.query;
      let path = this.$router.history.current.path;
      let newQuery = JSON.parse(JSON.stringify(query));
      newQuery[params] = val;
      this[params] = val; // 赋值
      this.$router.replace(
        {path, query: newQuery}
      );
      this.details(val)
    },
    details(id) {
      API.newsdetilas({id:id}).then(res =>{
        if(res.code ==0 ){
          this.data = res.data
        }
      })
    },
    hots() {
      this.$router.push({
        path: './newslist'
      })
    },
    jumproter(id) {
      this.funcUrlAdd("id",id);
    }
  },
}
</script>
<style lang="scss">
  .news-page {
    width: 100%;
    padding-top: 50px;
    background-color: #F6F6F6;
    .flex {
      display: flex;

    }
    .news-left {
      flex: 2;
    }
    .news-right {
    flex: 1;
    margin-left: 10px;
    margin-top: 37px;
    }
    .news-content,
    .hot-centent {
      background-color: #fff;
    }
    .news-breadcrumb {
      margin-bottom: 62px;
    }
    .news-content {
      word-break: break-all;
      padding: 50px 80px 50px;
      margin-bottom: 100px;
    }
    .news-title {
      font-size: 16px;
      font-weight: 700;
      margin-bottom: 10px;
      text-align: center;
    }
    .news-time p{
      text-align: center;
      color: #999999
    }
    .name {
      display: inline-block;
      vertical-align: top;
      margin-top: 5px;
      margin-left: 10px;
      font-size: 14px
    }
    .news-body {
      font-size: 14px;
      width: 700px;
      word-wrap:break-word;
    }
    /* .news-body p {
      margin-bottom: 20px;
      color: #999;
      line-height: 22px;
    } */
    .news-body img {
      max-width: 700px;
    }
    .hotnews {
      cursor: pointer;
      font-size: 18px;
      margin-bottom: 5px;
      display: inline-block;
    }
    .fontsizecolor span {
      color: #2F9FFE !important;
    }
  }

</style>
