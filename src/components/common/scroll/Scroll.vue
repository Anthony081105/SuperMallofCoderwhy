<!-- 封装 Better-Scroll  -->
<template>
  <div class="wrapper" ref="wrapper">
      <div class="content">
          <slot></slot>
      </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll'

export default {
  data () {
    return {
        scroll:null,
    };
  },
  props: {
      probeType:{
          type:Number,
          default:0
      },
      pullUpLoad:{
          type:Boolean,
          default:false
      }
  },
  mounted () {
    //   1.创建BScroll对象
        this.scroll = new BScroll(this.$refs.wrapper,{
            click:true,
            probeType:this.probeType,
            pullUpLoad:this.pullUpLoad
        })
        // 2.监听滚动的位置
        if(this.probeType ===2 || this.probeType ===3){
            this.scroll.on('scroll',(position)=>{
            // console.log(position);
            this.$emit('scroll', position)
          })
        }
        // 3.监听上拉获取资源
        if(this.pullUpLoad){
            this.scroll.on('pullingUp',()=>{
            // console.log('上拉加载更多');
            this.$emit('pullingUp')
            })
        }

  },
  methods: {
      scrollTo(x,y,time=300){
          this.scroll && this.scroll.scrollTo && this.scroll.scrollTo(x,y,time)
      },
      finishPullUp(){
          this.scroll && this.scroll.finishPullUp()
      },
      refresh(){
        //   console.log('refresh调用');
          this.scroll && this.scroll.refresh &&this.scroll.refresh()
      }

  }

}

</script>