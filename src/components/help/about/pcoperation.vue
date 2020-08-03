<template>
    <div class="company">
      <div class="company-title">
        <div class="company-text">网站操作流程</div>
      </div>
      <div class="company-body" style="color: #333333">
        <h2>1.注册流程</h2>
        <div class="company-image">
          <img src="https://app.ymdb2b.com/commonStatic/liucheng/pczc/1.jpg" />
          <img src="https://app.ymdb2b.com/commonStatic/liucheng/pczc/2.jpg" />
          <img src="https://app.ymdb2b.com/commonStatic/liucheng/pczc/3.jpg" />
          <img src="https://app.ymdb2b.com/commonStatic/liucheng/pczc/4.jpg" />
          <img src="https://app.ymdb2b.com/commonStatic/liucheng/pczc/5.jpg" />
          <img src="https://app.ymdb2b.com/commonStatic/liucheng/pczc/6.jpg" />
        </div>
      </div>
       <div class="company-body" style="color: #333333">
        <h2>2.购买流程</h2>
        <div class="company-image">
          <img src="https://app.ymdb2b.com/commonStatic/liucheng/pcgm/1.jpg" />
          <img src="https://app.ymdb2b.com/commonStatic/liucheng/pcgm/2.jpg" />
          <img src="https://app.ymdb2b.com/commonStatic/liucheng/pcgm/3.jpg" />
          <img src="https://app.ymdb2b.com/commonStatic/liucheng/pcgm/4.jpg" />
          <img src="https://app.ymdb2b.com/commonStatic/liucheng/pcgm/5.jpg" />
          <img src="https://app.ymdb2b.com/commonStatic/liucheng/pcgm/6.jpg" />
        </div>
      </div>
      <div class="company-body" style="color: #333333">
        <h2>3.查看订单</h2>
        <div class="company-image">
          <img src="https://app.ymdb2b.com/commonStatic/liucheng/pcdd/1.jpg" />
          <img src="https://app.ymdb2b.com/commonStatic/liucheng/pcdd/2.jpg" />
          <img src="https://app.ymdb2b.com/commonStatic/liucheng/pcdd/3.jpg" />
        </div>
      </div>
    </div>
</template>
<script>
export default {
             
}
</script>
<style scoped lang=scss>
  .company {
    &-title {
      width: 980px;
      height: 40px;
      background:rgba(248,248,248,1);
      line-height: 40px;
    }
    &-text {
      margin-left: 23px;
      font-size: 14px;
      color:#333333;
      
    }
    &-body {
      width: 934px;
      /* height: 544px; */
      /* background-color: red; */
      margin: 40px auto;
    }
    &-content {
      h2 {
        font-weight: 600 !important;
      }
      span {
        font-weight: 560;
        font-size: 16px;
      }
    }
    &-introduction {
        font-size: 14px;
        text-indent:2em;  
    }
    &-image {
      img {
        width: 790px;
      }
      p {
        font-size: 15px;
        color: red
      }
      a {
        color: #2F9FFE;
      }
    }
  }   
</style>