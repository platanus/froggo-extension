import Vue from 'vue';
import Vuex from 'vuex';
import usersApi from '../api/users';
import organizationsApi from '../api/organizations';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    fetchingUser: false,
    userAvatarUrl: '',
    userId: null,
    userLogin: '',
    userError: null,
    fetchingPreferences: false,
    defaultOrganization: null,
    defaultTeam: null,
    defaultTime: '',
    preferencesError: null,
    fetchingOrganizations: false,
    organizations: [],
    organizationsError: null,
  },
  mutations: {
    setFetchingUser(state, payload) {
      state.fetchingUser = payload;
    },
    setUserAvatarUrl(state, payload) {
      state.userAvatarUrl = payload;
    },
    setUserId(state, payload) {
      state.userId = payload;
    },
    setUserLogin(state, payload) {
      state.userLogin = payload;
    },
    setUserError(state, payload) {
      state.userError = payload;
    },
    setFetchingPreferences(state, payload) {
      state.fetchingPreferences = payload;
    },
    setDefaultOrganization(state, payload) {
      state.defaultOrganization = payload;
    },
    setDefaultTeam(state, payload) {
      state.defaultTeam = payload;
    },
    setDefaultTime(state, payload) {
      state.defaultTime = payload;
    },
    setPreferencesError(state, payload) {
      state.preferencesError = payload;
    },
    setFetchingOrganizations(state, payload) {
      state.fetchingOrganizations = payload;
    },
    setOrganizations(state, payload) {
      state.organizations = payload;
    },
    setOrganizationsError(state, payload) {
      state.organizationsError = payload;
    },
  },
  actions: {
    fetchCurrentUser({ commit }) {
      commit('setFetchingUser', true);
      usersApi.getCurrentUser()
        .then(response => {
          commit('setFetchingUser', false);
          commit('setUserAvatarUrl', response.data.data.attributes.avatarUrl);
          commit('setUserId', parseInt(response.data.data.id, 10));
          commit('setUserLogin', response.data.data.attributes.login);
        })
        .catch(error => {
          commit('setFetchingUser', false);
          commit('setUserError', error);
        });
    },
    fetchPreferences({ commit }) {
      commit('setFetchingPreferences', true);
      usersApi.getPreferences(this.state.userId)
        .then(response => {
          commit('setFetchingPreferences', false);
          commit('setDefaultOrganization', response.data.data.attributes.defaultOrg);
          commit('setDefaultTeam', response.data.data.attributes.defaultTeam);
          commit('setDefaultTime', response.data.data.attributes.defaultTime);
        })
        .catch(error => {
          commit('setFetchingPreferences', false);
          commit('setPreferencesError', error);
        });
    },
    fetchOrganizations({ commit }) {
      commit('setFetchingOrganizations', true);
      organizationsApi.getOrganizations()
        .then(response => {
          commit('setFetchingOrganizations', false);
          commit('setOrganizations', response.data.data);
        })
        .catch(error => {
          commit('setFetchingOrganizations', false);
          commit('setOrganizationsError', error);
        });
    },
  },
  modules: {
  },
});
