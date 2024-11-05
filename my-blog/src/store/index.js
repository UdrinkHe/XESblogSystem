import Vue from 'vue';
import Vuex from 'vuex';
import auth from './modules/auth';
import idCount from './modules/idCount';
import post from './modules/post';
import pageStatus from './modules/pageStatus';
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
   
  },
  mutations: {
    
  },
  actions: {
   
  },
  getters: {
    
  },
  modules: {
    auth,
    idCount,
    post,
    pageStatus
  }
});
