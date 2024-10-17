export default {
  namespaced: true,
  state: {
    idCount: 0
  },
  mutations: {
    setIdCount(state) {
      state.idCount = state.idCount + 1;
    }
  },
  getters: {
    idCount: state => state.idCount
  }
}