<template>
    <div class="company">
      <div class="company-title">
        <div class="company-text">收货说明</div>
      </div>
      <div class="company-body" style="color: #333333">
        <div class="company-content">
          <p style="font-size: 14px">
            1. 签收时与配送人员当面核对：商品、配件、商品数量及发货清单、发票（如有）、赠品（如有）等
            <br />
            2. 如存在包装破损、商品错误、商品短缺、商品存在质量问题等影响签收的情况，您可以拒收全部商品。或者快递在场情况下联系客服处理。
            <br />
            3. 为了保护您的权益，建议您尽量不要委托他人代为签收；如由他人代为签收商品而没有在配送人员在场的情况下验货，则视为您所订购商品的包装无任何问题，药满多有权不接受以此为由的退换货。
            <br />
            4. 为了方便日后可能出现的退换货流程，请保留商品外包装箱7天
            药满多不接受无理由拒收。在您收到商品后，如对药满多的商品有任何不满意，在商品包装干净，完好且未经拆封，未经使用的前提下，您可以与药满多客服联系提出退货要求，药满多客服人员将对您的退货要求做出判断后方可办理退货处理。具体办法请参见“退换货政策”如您验收商品时发现商品短缺、配送错误、包装破损、商品存在质量问题等，您可以拒收全部或部分商品，相关的赠品，配件或捆绑商品应一起当场拒收。
            若同一顾客二次无理由退货，药满多将对其视作“恶意订购”，今后对该顾客帐户仅做款到发货处理，敬请谅解!
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