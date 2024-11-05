export default {
    namespaced: true,
    state: {
        isBgBlack: false
    },
    mutations: {
        setBgBlack(state, value){
            state.isBgBlack = value
        }
    }
}