<template>
  <div id="watermark-canvas">
  </div>
</template>
<script>
import {ref, reactive, onMounted, getCurrentInstance, toRefs, computed, watch, nextTick,onUnmounted} from 'vue';

export default {
  props: {
    //显示的水印文本
    inputText: {
      type: String,
      default: '我是水印'
    },
    //是否允许通过js或者开发者工具等途径修改水印DOM节点（水印的id，attribute属性，节点的删除）
    //true为允许，默认不允许
    inputAllowDele: {
      type: Boolean,
      default: false
    },
    //是否在销毁组件时去除水印节点（前提是允许用户修改DOM，否则去除后会再次自动生成）
    // true会，默认不会
    inputDestroy: {
      type: Boolean,
      default: false
    },
    // 父级元素名称
    fatherIdElement:{
      type: String,
      default: ''
    }
  },
  setup(props) {
    let data = reactive({
      maskDiv: {} //当前显示的水印div节点DOM对象
    })
    watch(
        () => props.inputText,
        () => {
          nextTick(()=>{
            removeMaskDiv()
          })
        }
    );
    const init = (fatherIdElement) => {
      let fatherEl = document.getElementById(fatherIdElement)
      fatherEl.style.position = 'relative'
      fatherEl.style.overflow = 'hidden'
      let canvas = document.createElement('canvas')
      canvas.id = 'canvas'
      canvas.width = '200' //单个水印的宽高
      canvas.height = '130'
      data.maskDiv = document.createElement('div')
      let ctx = canvas.getContext('2d')
      ctx.font = 'normal 18px Microsoft Yahei' //设置样式
      ctx.fillStyle = 'rgb(112, 113, 114, 0.1)' //水印字体颜色
      ctx.rotate(30 * Math.PI / 180) //水印偏转角度
      ctx.fillText(props.inputText, 30, 20)
      let src = canvas.toDataURL('image/png')
      data.maskDiv.style.position = 'absolute'
      data.maskDiv.style.zIndex = '9999'
      data.maskDiv.id = '_waterMark'
      data.maskDiv.style.top = '30px'
      data.maskDiv.style.left = '0'
      data.maskDiv.style.width = '100%'
      data.maskDiv.style.height = '100%'
      data.maskDiv.style.pointerEvents = 'none'
      data.maskDiv.style.backgroundImage = 'URL(' + src + ')'
      // 水印节点插到body下
      document.getElementById(fatherIdElement).appendChild(data.maskDiv)
    }

    const Monitor = () => {
      let body = document.getElementById('watermark-canvas')
      let options = {
        childList: true,
        attributes: true,
        characterData: true,
        subtree: true,
        attributeOldValue: true,
        characterDataOldValue: true
      }
      let observer = new MutationObserver(callback)
      observer.observe(body, options)  //监听body节点
    }
    //DOM改变执行callback
    const callback = (mutations, observer) => {
      //当attribute属性被修改
      if (mutations[0].target.id === '_waterMark') {
        removeMaskDiv()
      }
      //当id被改变时
      if (mutations[0].attributeName === 'id') {
        removeMaskDiv()
        init()
      }
      //当节点被删除
      if (mutations[0].removedNodes[0] && mutations[0].removedNodes[0].id === '_waterMark') {
        init(props.fatherIdElement)
      }
    }

    /* public */
    //手动销毁水印DOM
    const removeMaskDiv = () => {
      document.getElementById(props.fatherIdElement).removeChild(data.maskDiv)
    }
    //手动生成水印
    const createMaskDiv = () => {
      init()
    }
    onMounted(() => {
      nextTick(() => {
        //创建水印节点
        init(props.fatherIdElement)
        if (!props.inputAllowDele) {
          // 设置水印节点修改的DOM事件
          Monitor()
        }
      });
    })
    onUnmounted(()=>{
      if (props.inputDestroy){
        removeMaskDiv()
      }
    })
    return {
      ...toRefs(data)
    }
  }
}
</script>
