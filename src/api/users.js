import api from './index';

export default {
  getRecommendations(teamId, userLogin, params) {
    return api({
      method: 'get',
      url: `/teams/${teamId}/users/${userLogin}/recommendations`,
      params,
    });
  },
  getCurrentUser() {
    return api({
      method: 'get',
      url: '/github_users/current',
    });
  },
  getPreferences(userId) {
    return api({
      method: 'get',
      url: `/github_users/${userId}/preferences`,
    });
  },
};
