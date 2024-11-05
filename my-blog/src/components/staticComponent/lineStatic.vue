<template>
    <div id="lineStaticComponent">
        <div ref="lineStatic">
            {{ option.title.text + option.series.length}}
        </div>
    </div>
</template>

<script>
//import * as echarts from 'echarts';
export default {
    name: 'lineStatic',
    mounted() {
        this.initChart();   
    },
    props:{
        echartTitle : {
            type: String,
            default: null
        },
        echartSeries : {
            type: Array,
            default: null
        }
    },
    computed:{
        option(){
            return {
                title: {
                    text: this.echartTitle
                },
                series: this.echartSeries
            };
        }
    },
    methods: {
        // initChart(){
        //     const chart = echarts.init(this.$refs.lineStatic,null,{
        //         width: 100,
        //         height: 100
        //     });
        //     const option = {
        //         title: {
        //             text: '折线图'
        //         }
        //     }
        //     chart.setOption(option);
        // }
    }
}
</script>
<style scoped>
#lineStatic{
    width: 100%;
    height: 100%;
}
</style>
