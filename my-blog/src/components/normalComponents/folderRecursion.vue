<!--处理文件收藏夹递归-->
<template>
    <div id="folderRecursion">
        <!--先创建一个el-submenu-->
        <el-submenu :index="fatherFolder.id"  >
            <template slot="title">
                <i  class="el-icon-folder"></i>
                <span @click.stop="handleClick(fatherFolder.id)" :title="fatherFolder.name">{{fatherFolder.name}}</span>
            </template>
            <!--调用递归-->
            <template v-for="item in fatherFolder.sonFolder">
                <folderRecursion v-if="item.sonFolder" :fatherFolder="item" :key="item.id" />
                <el-menu-item v-else :index="item.id" :key="item.id" @click.native.stop="handleClick(item.id)">
                    <i class="el-icon-folder"></i>
                    <span>{{item.name}}</span>
                </el-menu-item>
            </template>
        </el-submenu>
    </div>
</template>
<script>
import folderRecursion from './folderRecursion.vue';
import { mapMutations } from 'vuex';
export default {
    name : 'folderRecursion',
    components : {
        folderRecursion
    },
    props : {
        fatherFolder : {
            type : Object,
            default : () => {}
        }
    },
    methods : {
        ...mapMutations('post',['setMyCollectionId']),
        handleClick(id) {
            this.setMyCollectionId(id);
        },
    }
}
</script>
