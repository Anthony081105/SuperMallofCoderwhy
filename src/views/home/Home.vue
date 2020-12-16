<!--  -->
<template>
  <div id="home">
      <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
      
      <tab-control 
          :titles="['流行','新款','精选']" 
          @tabClick='tabClick'
          ref="tabControl1"
          class="tab-control"
          v-show="isTabFixed"></tab-control>
      <scroll class="content"
            ref="scroll" 
            :probe-type='3' 
            @scroll="contentScroll"
            :pull-up-load='true'
            @pullingUp='loadMore'>
        <home-swiper :banners='banners' @swpierImageLoad="swpierImageLoad"></home-swiper>
        <recommend-view :recommends='recommends'></recommend-view>
        <feature-view></feature-view>
        <tab-control 
          :titles="['流行','新款','精选']" 
          @tabClick='tabClick'
          ref="tabControl2"
         ></tab-control>
        <goods-list :goods='showGoods'></goods-list>
      </scroll>

      <back-top @click.native="backClick" v-show="isShowBackTop"></back-top>
      
  </div>
</template>

<script>
import NavBar from 'components/common/navbar/NavBar'
import TabControl from 'components/content/tabControl/TabControl'
import GoodsList from 'components/content/goods/GoodsList'
import Scroll from 'components/common/scroll/Scroll'
import BackTop from 'components/content/backTop/BackTop'

import HomeSwiper from './childComps/HomeSwiper'
import RecommendView from './childComps/RecommenView'
import FeatureView from './childComps/FeatureView'


import {getHomeMutidata,getHomeGoods} from 'network/home'
import {debounce} from 'common/utils'


export default {
  data () {
    return {  
      banners:[],
      recommends:[],
      goods:{
        'pop':{page:0, list:[]},
        'new':{page:0, list:[]},
        'sell':{page:0, list:[]}
      },
      currentType:'pop',
      isShowBackTop:false,
      tabOffsetTop:0,
      isTabFixed:false,
    };
  },
  components: {
    NavBar,
    TabControl,
    GoodsList,
    Scroll,
    BackTop,

    HomeSwiper,
    RecommendView,
    FeatureView
  },
  created () {
    // 1.请求轮播图数据
    this.getHomeMutidata()
    // 2.请求商品数据
    this.getHomeGoods('pop')
    this.getHomeGoods('new')
    this.getHomeGoods('sell')

    
    
    },
  mounted () {
    //1.监听item中图片加载完成
    const refresh = debounce(this.$refs.scroll.refresh,200)
    this.$bus.$on('itemImageLoad',()=>{
      // console.log('-----');
      // this.$refs.scroll.refresh()
      refresh()
    })
    
    
    
  },
  methods: {
      
      // 网络请求相关方法
      getHomeMutidata(){
        getHomeMutidata().then(res=>{
        this.banners = res.data.banner.list;
        this.recommends = res.data.recommend.list;
        })
      },
      getHomeGoods(type){
        let page=this.goods[type].page + 1
        // console.log(page);
        getHomeGoods(type,page).then(res=>{
          // 扩展运算符
          this.goods[type].list.push(...res.data.list);
          this.goods[type].page +=1;
          
          this.$refs.scroll.finishPullUp()
        })
      },
      contentScroll(position){
        // console.log(position);
        if(0-position.y>1000){
          this.isShowBackTop = true;
        }
        else if(0-position.y<1000){
          this.isShowBackTop = false;
        }

        // 2.决定tabControl是否吸停
        this.isTabFixed = (-position.y) >this.tabOffsetTop
      },

      // 事件监听相关方法
      tabClick(index){
        // console.log(index);
        switch (index){
          case 0:
            this.currentType ='pop'
            break
          case 1:
            this.currentType ='new'
            break
          case 2:
            this.currentType ='sell'
            break
        }
        this.$refs.tabControl1.currentIndex =index;
        this.$refs.tabControl2.currentIndex =index;
      },
      backClick(){
        this.$refs.scroll.scrollTo(0,0,500)
      },
      loadMore(){
        // console.log('loadMore');
        this.getHomeGoods(this.currentType)
        // this.$refs.scroll.scroll.refresh()
      },
      swpierImageLoad(){
        this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop;
      }
    },
    computed: {
        showGoods(){
          return this.goods[this.currentType].list
        }
      }
}

</script>

<style scoped>
  #home{
    /* padding-top:44px ; */
    /* 视口vh */
    height: 100vh;
    position: relative;
  }

  .home-nav{
    background-color:var(--color-tint);
    color:#fff;
    
    /* position: fixed;
    left: 0;
    right: 0;
    top: 0;
    z-index: 10; */
  }

  /* .content{
    height: calc(100% - 93px);
    overflow: hidden;
    margin-top: 51px;
  } */
  .content{
    overflow: hidden;
    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }

  .tab-control{
    position: relative;
    z-index: 10;
  }
  
</style>