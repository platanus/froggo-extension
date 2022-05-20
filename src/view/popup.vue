<template>
  <div
    class="h-screen bg-white font-body"
  >
    <div
      class="flex justify-between items-center px-4 h-12 bg-froggo-blue-dark"
    >
      <div
        class="flex items-center space-x-4"
      >
        <img
          :src="require('@/assets/logo.svg')"
        >
        <img
          class="w-20"
          :src="require('@/assets/froggo-text.svg')"
        >
      </div>
      <img
        v-if="userAvatarUrl"
        class="w-8 h-8 bg-gray-200 rounded-full"
        :src="userAvatarUrl"
      >
    </div>
    <div
      v-if="loading"
      class="flex justify-center items-center mt-32"
    >
      <img
        :src="require('@/assets/images/loading.svg')"
      >
    </div>
    <pr-details
      v-else-if="showDetails"
      :pull-request="selectedPullRequest"
      @hide-details="hideDetails"
    />
    <pr-list
      v-else
      :pull-requests="pullRequests"
      @show-details="selectPR"
    />
  </div>
</template>

<script>
import '@/assets/styles/index.css';
import { mapActions, mapState } from 'vuex';
import prApi from '../api/pull-requests';
import PrList from '../components/pr-list.vue';
import PrDetails from '../components/pr-details.vue';

export default {
  name: 'App',
  components: {
    PrList,
    PrDetails,
  },
  data() {
    return {
      pullRequests: [],
      selectedPRId: null,
      showDetails: false,
      loading: true,
    };
  },
  mounted() {
    this.getUserInfo();
    this.getOpenPRs();
    this.fetchOrganizations();
  },
  computed: {
    ...mapState([
      'userAvatarUrl',
      'userId',
      'userLogin',
    ]),
    selectedPullRequest() {
      return this.pullRequests.find((pr) => pr.pullRequest.id === this.selectedPRId);
    },
  },
  methods: {
    ...mapActions([
      'fetchCurrentUser',
      'fetchPreferences',
      'fetchOrganizations',
    ]),
    selectPR(id) {
      this.selectedPRId = id;
      this.showDetails = true;
    },
    hideDetails() {
      this.selectedPRId = null;
      this.showDetails = false;
      this.getOpenPRs();
    },
    getOpenPRs() {
      this.loading = true;
      prApi.getOpenPRs().then(res => {
        this.pullRequests = res.data.response.openPrs;
        this.loading = false;
      });
    },
    copyToClipboard(text) {
      navigator.clipboard.writeText(text);
    },
    getUserInfo() {
      this.fetchCurrentUser();
    },
  },
  watch: {
    userId(val) {
      if (val) this.fetchPreferences();
    },
  },
};
</script>

<style>
body {
  width: 558px;
  height: 470px;
  overflow: hidden;
}
</style>
