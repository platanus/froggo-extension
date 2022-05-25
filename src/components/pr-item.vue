<template>
  <div
    class="px-2.5 py-2 flex justify-between items-center h-13"
  >
    <div
      class="flex flex-col"
    >
      <div
        class="flex items-center w-72"
      >
        <img
          :src="require('@/assets/images/pr.svg')"
        >
        <p
          class="text-xs font-bold ml-1.5 truncate"
        >
          {{ prTitle }}
        </p>
        <img
          class="ml-0.5 cursor-pointer"
          :src="require('@/assets/images/copy.svg')"
          @click="copyToClipboard(prUrl)"
        >
      </div>
      <p
        class="mt-1 text-xs text-froggo-gray"
      >
        Abierto {{ prCreatedAt | toRelative }}
      </p>
    </div>
    <div
      class="flex space-x-2.5 items-center"
    >
      <div
        v-if="reviewers.length === 0"
        class="text-xs italic"
      >
        Sin revisor(es) asignado(s)
      </div>
      <img
        v-else
        v-for="reviewer in reviewers"
        :key="reviewer.id"
        class="w-6 h-6 rounded-full border-2 border-froggo-yellow"
        :src="reviewer.avatarUrl"
      >
      <img
        class="rotate-180 cursor-pointer"
        :src="require('@/assets/images/chevron-left.svg')"
        @click="showDetails"
      >
    </div>
  </div>
</template>
<script>

export default {
  props: {
    pullRequest: {
      type: Object,
      required: true,
    },
  },
  computed: {
    prId() {
      return this.pullRequest.pullRequest.id;
    },
    prTitle() {
      return this.pullRequest.pullRequest.title;
    },
    prUrl() {
      return this.pullRequest.pullRequest.htmlUrl;
    },
    prCreatedAt() {
      return this.pullRequest.pullRequest.createdAt;
    },
    reviewers() {
      return this.pullRequest.reviewers;
    },
  },
  methods: {
    showDetails() {
      this.$emit('show-details', this.prId);
    },
    copyToClipboard(text) {
      navigator.clipboard.writeText(text);
    },
  },
};
</script>
