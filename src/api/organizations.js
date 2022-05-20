import api from './index';

export default {
  getOrganizations() {
    return api({
      method: 'get',
      url: '/organizations',
    });
  },
};
