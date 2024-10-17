<template>
    <div id="editor-block">
        <div class="editorNav">
            <myLeftNav :navData="navData"></myLeftNav>
        </div>
        <div class="editorMain">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
import myLeftNav from '../normalComponents/myLeftNav.vue'
export default {
    name: 'editorBlock',
    components: {
        myLeftNav
    },
    data() {
        return {
            navData: [
                {name: '创作管理', path: '/editorBlock/creationManagement'},
                {name: '稿件数据', path: '/editorBlock/creationStatistics'},
            ]
        }
    },
    computed:{
       
    }
}
</script>
<style lang="scss" scoped>
    #editor-block {
        display: flex;
        position: relative;
        width: 85%;
        margin: 0 auto;
    }
    .editorMain{
        flex: 1;
    }
    .editorNav {
        position: sticky;
        top: 0;
        width: 200px;
        height: 150px;
        background-color:#ffffff;
        text-align: center;
    }
</style>
