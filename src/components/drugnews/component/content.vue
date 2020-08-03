<template>
  <div class="layout">
    <div v-for="(item ,index) in newslists.data" :key="index">
      <div class="layout-box" @click="newsdetails(item.id)">
        <div class="layout-content flex-wrp">
            <div class="content-title flex-item">
              {{item.title}}
            </div>
             <span class="content-foot">
              {{item.createTime}}
            </span>
            <!-- <div
              class="content-body" v-html="item.content"
            ></div> -->
            <!-- <div class="content-foot">
              <div class="browse">{{item.createTime}}</div>
            </div> -->
        </div>
      </div>
    </div>
    <!-- <div class="setting_pagination" v-if="newslists.total>0">
      <el-pagination
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      layout="total, sizes, prev, pager, next, jumper"
      :page-sizes="[5,10, 50, 100, 150]"
      small
      :total="newslists.total" :current-page.sync="newslists.currentPage"
      :page-size="newslists.pageSize">
      </el-pagination>
      <el-button type="primary" size="mini" plain>确 定</el-button>
    </div> -->
    <div class="reset-pagination" v-if="newslists.total > 0">
        <el-pagination @current-change="handleCurrentChange"
                       background
                       prev-text="上一页"
                       next-text="下一页"
                       layout="prev, pager,next, jumper"
                       :page-sizes="[10, 50, 100, 150]"
                       :total="newslists.total" :current-page.sync="newslists.currentPage"
                       :page-size="newslists.pageSize">
        </el-pagination>
        <el-button class="sure-btn" plain>确 定</el-button>
      </div>
  </div>
</template>
           
<script>
import API from '../../../api/api_drug'

export default {
  name:"contentWrap",
  data() {
    return {
      newslists:{
        data: [],
        total: 0,
        pageSize: 10,
        currentPage: 1
      }
    }
  },
  created() {
    this.newsinfo();
  },
  methods: {
    newsdetails(id) {
      API.newsdetilas({id:id}).then(res =>{
        if(res.code ==0 ){
          console.log(res);
          this.$router.push({
            path:'/drugnews/newsdetails?id='+id
          })
        }
      }) 
    },

    newsinfo() {
        let params= {
        limit: this.newslists.pageSize,
        page: this.newslists.currentPage    
        }
        // console.log(this.newslists.pageSize);
        
      API.newslists(params).then(res => {
        if (res.code == 0) {
          this.newslists.data = res.page.rows
          this.newslists.total = res.page.total
        }
      })
    },
    //分页
    handleCurrentChange(val) {
      this.newslists.currentPage = val;
      this.newsinfo();
    },
    handleSizeChange(val) {
      this.newslists.pageSize = val;
      this.newsinfo();
    },
  },
}
</script>
<style lang=scss scoped>
  .layout {
    width: 100%;
    box-sizing: border-box;
  }
  .layout-box {
    /* padding: 30px 40px; */
    /* margin: 0 30px; */
    /* height: 150px; */
    border-bottom: 1px dotted #F0F0F0;
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
    padding: 15px 15px;
  }
  .content-title {
    font-size: 14px;
    overflow: hidden;
  }
  .content-title:hover {
    color:#2F9FFE;
  }
  .content-body {
    font-size: 13px;
    height: 44px;
    width: 700px;
    line-height: 22px;
    overflow: hidden;
    margin-bottom: 25px;
    word-wrap:break-word;
  }
  .content-foot {
    color: #999999;
  }
  .content-foot .browse {
    display: inline;
  }
  .setting_pagination {
    text-align: center;
    .number {
      margin: 0 3px ; 
    }
  }
  .el-pager li:last-child {
    line-height: 25px !important;
    height: 25px !important ;
  }
  .el-pagination {
    display: inline-block;
  }
  .el-button--primary.is-plain {
    display: inline-block;
  }
</style>