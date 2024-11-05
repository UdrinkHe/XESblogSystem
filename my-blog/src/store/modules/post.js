export default {
    namespaced: true,
    state: {
        myCollectionId:null,//我的收藏，显示收藏夹的id
    },
    mutations: {
      setMyCollectionId(state,id){
        state.myCollectionId = id;
      }
    },
    actions: {
        
    },
    getters: {
        myCollectionId: state => state.myCollectionId
    }
}