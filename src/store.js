// En store.js
import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";

export default createStore({
  state: {
    user: null,
    profileData: {},
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    setUserImg(state, img) {
      console.log(state.user);
      state.user.user.imatge = img;
    },
    clearUser(state) {
      state.user = null;
    },
    setProfileData(state, data) {
      state.profileData = data;
    },
  },
  actions: {
    loginUser({ commit }, user) {
      commit("setUser", user);
    },
    logoutUser({ commit }) {
      commit("clearUser");
    },
  },
  getters: {
    user: (state) => state.user,
    profileData: (state) => state.profileData,
  },
  plugins: [createPersistedState()],
});
