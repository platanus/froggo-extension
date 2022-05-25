<template>
  <div>
    <div class="flex items-center w-full">
      <img
        v-if="organizationAvatar"
        :src="organizationAvatar"
        class="w-6 h-6 rounded-full"
      >
      <div
        v-else
        class="w-6 h-6 bg-gray-400 rounded-full"
      />
      <p
        class="ml-1.5 text-sm"
      >
        {{ organizationName }}
      </p>
    </div>
    <div
      class="flex flex-col mt-2 border divide-y border-gray-light divide-gray-light"
    >
      <pr-item
        v-for="pr in pullRequests"
        :key="pr.pullRequest.id"
        :pull-request="pr"
        @show-details="showDetails"
      />
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import prItem from './pr-item.vue';

export default {
  components: { prItem },
  props: {
    pullRequests: {
      type: Array,
      required: true,
    },
    organizationId: {
      type: Number,
      required: true,
    },
  },
  computed: {
    ...mapState([
      'organizations',
    ]),
    organization() {
      return this.organizations.find(organization => organization.id === this.organizationId).attributes;
    },
    organizationName() {
      return this.organization.login;
    },
    organizationAvatar() {
      return this.organization.avatarUrl;
    },
  },
  methods: {
    showDetails(id) {
      this.$emit('show-details', id);
    },
  },
};
</script>
