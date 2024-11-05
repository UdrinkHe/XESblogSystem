<template>
<div id="scheduleStatistic" class="p20">
    <lineStatic :echartTitle="this.echartTitle" :echartSeries="this.echartSeries"></lineStatic>
    <button @click="getEchartSeries">获取折线图数据</button>
</div>
</template>

<script>
import lineStatic from '../staticComponent/lineStatic.vue';
export default {
name: 'scheduleStatistic',
components: {
    lineStatic
},
data(){
    return {
        echartTitle: '折线图',
        echartSeries: []
    }
},
methods: {
    getEchartSeries(){
        this.echartSeries.push({
            name: '折线图',
            type: 'line',
            data: [1,2,3,4,5,6,7,8,9,10]
        });
    }
}
}
</script>

<style>

</style>