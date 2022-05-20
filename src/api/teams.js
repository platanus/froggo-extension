import api from './index';

export default {
  getTeams(organizationId) {
    return api({
      method: 'get',
      url: `/organizations/${organizationId}/froggo_teams`,
    });
  },
};
