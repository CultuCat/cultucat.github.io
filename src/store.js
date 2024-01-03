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
      state.user.user.imatge = img;
    },
    clearUser(state) {
      state.user = null;
    },
    setProfileData(state, data) {
      state.profileData = data;
    },
    setUserLanguage(state, language) {
      if (state.user && state.user.user) {
        state.user.user.language = language;
      }
    },
  },
  actions: {
    loginUser({ commit }, user) {
      commit("setUser", user);
    },
    logoutUser({ commit }) {
      commit("clearUser");
    },
    setUserLanguage({ commit }, language) {
      commit("setUserLanguage", language);
    },
  },
  getters: {
    user: (state) => state.user,
    profileData: (state) => state.profileData,
  },
  plugins: [createPersistedState()],
});
