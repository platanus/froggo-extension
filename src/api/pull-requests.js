import api from './index';

export default {
  getOpenPRs() {
    return api({
      method: 'get',
      url: 'github_users/open_prs',
    });
  },
  addReviewer(data) {
    data.from = 'extension';

    return api({
      method: 'post',
      url: 'pull_request_reviewer/add',
      data,
    });
  },
};
