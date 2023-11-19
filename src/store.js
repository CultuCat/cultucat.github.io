// En store.js
import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";
import axios from "axios";

export default createStore({
  state: {
    user: null,
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    clearUser(state) {
      state.user = null;
    },
    updateUserInState(state, updatedUserData) {
      state.user = { ...state.user, ...updatedUserData };
    },
  },
  actions: {
    loginUser({ commit }, user) {
      commit("setUser", user);
    },
    logoutUser({ commit }) {
      commit("clearUser");
    },
    async updateUser({ commit }, userId, formData) {
      try {
        // Realizar la solicitud PUT a la base de datos
        const response = await axios.put(`https://cultucat.hemanuelpc.es/users/${userId}/`, formData);

        // Después de una respuesta exitosa, actualizar el estado de Vuex
        commit("updateUserInState", response.data);
        return response.data;
      } catch (error) {
        // Manejar errores aquí
        console.error("Error al actualizar usuario:", error);
        throw error;
      }
    },
  },
  getters: {
    user: (state) => state.user,
  },
  plugins: [createPersistedState()],
});
