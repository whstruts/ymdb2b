<template>
    <div class="company">
      <div class="company-title">
        <div class="company-text">物流配送说明</div>
      </div>
      <div class="company-body" style="color: #333333">
        <div class="company-content">
          <!-- <h2>一、药满多简介</h2><br /> -->
          <!-- <p class="company-introduction">药满多由华源康信（武汉）医药有限公司独立开发、设计、制作的专业级B2B医药电商平台，整合众多生产企业及医药批发企业10多万药品资源，自营200多家上游生产企业高毛利品种，充分利用互联网电商优势，优化传统医药供应链体系，降低采购成本，提高采购效率，给合作商、采购商提供多样化的增值服务。</p>
          <span>药满多获准国家相关部门颁发执业证书：</span> -->
          <p style="font-size: 14px">
            1、药满多配根据订单的实际情况合理安排快递和物流，详细标准依具体收货地区而定。
            <br />
            2、订单生成后，预计发货时间是基于您即时付款后计算出的时间。
            <br />
          </p>
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