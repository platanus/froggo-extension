<template>
  <div
    class="flex flex-col p-4"
  >
    <p
      class="text-lg font-bold"
    >
      Mis PRs abiertos
    </p>
    <div
      v-for="(prList, key) in prsByOrganization"
      :key="key"
      class="flex flex-col mt-6"
    >
      <pr-per-organization
        :pull-requests="prList"
        :organization-id="key"
        @show-details="showDetails"
      />
    </div>
  </div>
</template>
<script>
import groupBy from 'lodash/groupBy';
import { mapState } from 'vuex';
import PrPerOrganization from './pr-per-organization.vue';

export default {
  components: { PrPerOrganization },
  props: {
    pullRequests: {
      type: Array,
      required: true,
    },
  },
  computed: {
    ...mapState([
      'organizations',
    ]),
    prsByOrganization() {
      return groupBy(this.pullRequests, ({ pullRequest }) => pullRequest.organizationId.toString());
    },
  },
  methods: {
    showDetails(id) {
      this.$emit('show-details', id);
    },
  },
};
</script>
