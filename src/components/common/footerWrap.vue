<template>
  <div class="footer">
    <div class="service-list">
      <ul class="w1200">
        <li class="flex-wrp">
          <span class="icon">
            <img src="../../assets/img/icon_lz.png"/>
          </span>
          <div class="flex-item">
            <p class="name">正品行货，品类齐全</p>
            <p class="desc">百万好货，等你来选</p>
          </div>
        </li>
        <li class="flex-wrp">
          <span class="icon">
            <img src="../../assets/img/icon_che.png"/>
          </span>
          <div class="flex-item">
            <p class="name">专业服务，闪电配送</p>
            <p class="desc">专业物流，准时送达</p>
          </div>
        </li>
        <li class="flex-wrp">
          <span class="icon">
            <img src="../../assets/img/icon_qb.png"/>
          </span>
          <div class="flex-item">
            <p class="name">轻松采购，便捷支付</p>
            <p class="desc">一键采购，便捷无忧</p>
          </div>
        </li>
        <li class="flex-wrp">
          <span class="icon">
            <img src="../../assets/img/icon_good.png"/>
          </span>
          <div class="flex-item">
            <p class="name">品质保障，服务承诺</p>
            <p class="desc">品质护航，购物无忧</p>
          </div>
        </li>
      </ul>
    </div>
    <div class="footer-info">
      <p class="nav-bottom">
        <a href="javascript:;">互联网药品信息服务资格证书：（鄂）-经营性-2017-0014</a>
        <a href="http://www.miibeian.gov.cn/" target="_blank"> ICP备案证书号:鄂ICP备17026041号</a>
      </p>
      <div style="padding:20px 0;">
		 		<a target="_blank" href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=42010302001266" style="display:inline-block;text-decoration:none;height:20px;line-height:20px;"><img src="http://www.ymdb2b.com/images/gabeian.jpg" style="float:left;"><p style="float:left;height:20px;line-height:20px;margin: 0px 0px 0px 5px; color:#939393;">鄂公网安备 42010302001266号</p></a>
		 	</div>
      <p>
        <a href="javascript:;">© 2005-2019 药满多 版权所有，并保留所有权利。</a>
        <a href="javascript:;">湖北省武汉市江汉区发展大道176号兴城大厦B座8层</a>
        <a href="https://www.cnzz.com/stat/website.php?web_id=1271204291" target="_blank" title="站长统计">站长统计</a>
        &nbsp;<a href="javascript:;"> Tel: 027-85885785</a>
        &nbsp;<a href="javascript:;">E-mail: ymdb2b@ymdb2b.com</a>
      </p>
    </div>
  </div>
</template>
<script>
export default {
  name: 'footerWrap',
  data(){
    return {

    }
  }
}
</script>
<style lang="scss">
  .footer{
      .service-list{
        padding: 24px 0;
        min-width: 1200px;
        background-color: #4B4B4B;
      }
      ul{
        overflow: hidden;
        li{
          float: left;
          width: 25%;
          text-align: center;
          .flex-item{
            padding-left: 17px;
            .name{
              font-size: 16px;
              color: #fff;
            }
            .desc{
              font-size: 12px;
              color: #999999;
            }
          }
        }
      }
      .copyright{
        padding: 110px 0;
        font-size: 14px;
        color: #A9A9A9;
        text-align: center;
        background-color: #f8f8f8;
      }
      .footer-info{
        padding: 50px 0;
        font-size: 12px;
        color: #666;
        p{
          text-align: center;
        }
        text-align: center;
      }
    }
</style>
