<template>
    <div class="company">
      <div class="company-title">
        <div class="company-text">药满多对公账户</div>
      </div>
      <div class="company-body" style="color: #333333">
        <div class="company-image">
          <img src="https://app.ymdb2b.com/commonStatic/dgzh/f52699ffa95228c0a854191e3928d18.png" alt="">
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