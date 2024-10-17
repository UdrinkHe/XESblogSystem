<template>
<div id="myPagination"><!--数据分页器-->
    <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="nowPage"
            :page-sizes="[10,20,50]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="dataLength">
    </el-pagination>
</div>
</template>

<script>

export default {
name: 'myPagination',
props:["nowPage","pageSize","dataLength"],
components: {
},
methods:{
    handleSizeChange(val){
        this.$emit('refresh','sizeChange',val)
    },
    handleCurrentChange(val){
        this.$emit('refresh','currentChange',val)
    }
}
}
</script>

<style>
</style>