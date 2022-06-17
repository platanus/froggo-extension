<template>
  <div
    class="flex flex-col p-4 w-full"
  >
    <div
      class="flex justify-between items-center"
    >
      <div
        class="flex flex-row space-x-1.5 w-80 items-center"
      >
        <img
          class="cursor-pointer"
          :src="require('@/assets/images/chevron-left.svg')"
          @click="hideDetails"
        >
        <img
          class="h-3.5"
          :src="require('@/assets/images/pr.svg')"
        >
        <div
          class="text-sm font-bold truncate"
        >
          {{ prTitle }}
        </div>
        <img
          class="h-4 cursor-pointer"
          :src="require('@/assets/images/copy.svg')"
          @click="copyPrUrl()"
        >
      </div>
      <div
        class="text-xs text-froggo-gray"
      >
        Abierto {{ createdAt | toRelative }}
      </div>
    </div>
    <div
      class="flex flex-row justify-between mt-4 text-sm"
    >
      <div
        class="flex items-baseline space-x-1.5"
      >
        <p
          class="text-lg font-bold"
        >
          Asignar PR #{{ prNumber }}
        </p>
        <p
          class="text-xs"
        >
          de <span class="font-bold">{{ repositoryName }}</span>
        </p>
      </div>
    </div>
    <div
      class="flex flex-col mt-4"
    >
      <p
        class="text-xs"
      >
        Equipo
      </p>
      <div
        class="w-full"
      >
        <v-select
          v-if="teams.length"
          v-model="selectedTeam"
          class="w-full outline-none"
          :clearable="false"
          label="name"
          :options="teams"
          placeholder="Selecciona un equipo..."
          :searchable="false"
        />
        <div
          v-else
          class="flex justify-center py-4 text-sm text-gray-500"
        >
          Aún no perteneces a un equipo en esta organización
        </div>
      </div>
    </div>
    <div
      v-if="teams.length"
      class="flex flex-col mt-4"
    >
      <p
        class="text-xs"
      >
        Revisores disponibles
      </p>
      <div
        class="flex justify-between items-center mt-2 w-full"
      >
        <div>
          <button
            class="w-6 h-6 focus:outline-none"
            @click="$refs.userSlider.prev()"
          >
            <img
              :src="require('@/assets/images/chevron-left.svg')"
            >
          </button>
        </div>
        <div
          class="w-10/12"
        >
          <vue-horizontal
            ref="userSlider"
            :button="false"
          >
            <v-tooltip
              v-for="user in users"
              :key="user.id"
              class="flex justify-center items-center mx-2 mb-2 w-12 h-12 rounded-full shadow-md cursor-pointer"
              :class="user.colorClass"
            >
              <button
                @click="selectReviewer(user)"
              >
                <img
                  class="w-10 h-10 bg-white rounded-full"
                  :src="user.avatarUrl"
                >
              </button>
              <template #popper>
                <div
                  class="flex flex-col items-center"
                >
                  <p
                    class="text-base font-bold"
                  >
                    @{{ user.login }}
                  </p>
                  <div
                    v-if="user.tags.length"
                    class="flex flex-wrap flex-shrink gap-y-1 justify-center py-1 space-x-1 max-w-xs"
                  >
                    <div
                      v-for="tag in user.tags"
                      :key="tag.id"
                      class="flex-shrink-0 px-2 h-5 text-xs rounded-full bg-froggo-red"
                    >
                      {{ tag.name }}
                    </div>
                  </div>
                </div>
              </template>
            </v-tooltip>
          </vue-horizontal>
        </div>
        <div>
          <button
            class="w-6 h-6 focus:outline-none"
            @click="$refs.userSlider.next()"
          >
            <img
              class="rotate-180"
              :src="require('@/assets/images/chevron-left.svg')"
            >
          </button>
        </div>
      </div>
    </div>
    <div
      class="flex flex-col mt-2"
    >
      <p
        class="text-xs"
      >
        Revisores seleccionados
      </p>
      <div
        class="flex flex-wrap gap-x-2 mt-2"
      >
        <div
          v-for="(reviewer, index) in pullRequest.reviewers"
          :key="index"
          class="flex items-center px-2 my-1 space-x-2 h-8 rounded-2xl bg-froggo-blue"
        >
          <img
            :src="reviewer.avatarUrl"
            class="w-6 h-6 bg-gray-400 rounded-full border-2 border-froggo-green"
          >
          <div
            class="text-sm text-white"
          >
            {{ reviewer.login }}
          </div>
        </div>
        <div
          v-for="(reviewer) in newReviewers"
          :key="reviewer.id"
          class="flex items-center px-2 my-1 space-x-2 h-8 rounded-2xl bg-froggo-blue"
        >
          <img
            :src="reviewer.avatarUrl"
            class="w-6 h-6 bg-gray-400 rounded-full border-2 border-froggo-green"
          >
          <div
            class="text-sm text-white"
          >
            {{ reviewer.login }}
          </div>
          <img
            class="cursor-pointer"
            :src="require('@/assets/images/close.svg')"
            @click="removeReviewer(reviewer)"
          >
        </div>
      </div>
    </div>
    <div
      class="flex justify-center mt-6"
    >
      <button
        class="w-40 h-8 text-base text-white rounded-md shadow bg-froggo-green disabled:cursor-default disabled:bg-froggo-gray-light"
        :disabled="buttonDisabled"
        @click="addReviewers()"
      >
        {{ buttonLabel }}
      </button>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import VueHorizontal from 'vue-horizontal';
import vSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';
import prApi from '../api/pull-requests';
import teamsApi from '../api/teams';
import usersApi from '../api/users';
import colorFromScore from '../helpers/color-from-score';

export default {
  data() {
    return {
      newReviewers: [],
      teams: [],
      selectedTeam: null,
      users: null,
    };
  },
  components: {
    VueHorizontal,
    vSelect,
  },
  props: {
    pullRequest: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapState([
      'defaultOrganization',
      'defaultTeam',
      'userLogin',
    ]),
    prNumber() {
      return this.pullRequest.pullRequest.ghNumber;
    },
    prTitle() {
      return this.pullRequest.pullRequest.title;
    },
    prId() {
      return this.pullRequest.pullRequest.id;
    },
    prUrl() {
      return this.pullRequest.pullRequest.htmlUrl;
    },
    organizationId() {
      return this.pullRequest.pullRequest.organizationId;
    },
    repositoryName() {
      return this.pullRequest.pullRequest.repositoryName;
    },
    createdAt() {
      return this.pullRequest.pullRequest.createdAt;
    },
    buttonLabel() {
      return this.pullRequest.reviewers.length ? 'Guardar cambios' : 'Asignar';
    },
    buttonDisabled() {
      return this.newReviewers.length === 0;
    },
  },
  methods: {
    colorFromScore,
    hideDetails() {
      this.$emit('hide-details');
    },
    addReviewers() {
      const reviewers = this.newReviewers.map((reviewer) => reviewer.login);
      prApi.addReviewer({ reviewer: reviewers, pullRequestId: this.prId });
      this.hideDetails();
    },
    getTeams(organizationId) {
      teamsApi.getTeams(organizationId).then(res => {
        this.teams = res.data.data.map(team => ({
          id: team.id, ...team.attributes,
        })).filter(team => (
          team.members.some(member => member.login === this.userLogin)
        ));
      });
    },
    getRecommendations(teamId) {
      usersApi.getRecommendations(teamId, this.userLogin, { monthLimit: 3, froggoTeam: true })
        .then(res => {
          this.users = res.data.response.recommendations.all.map(user => ({
            ...user,
            name: user.name || user.login,
            colorClass: this.colorFromScore(user.score),
          }));
          this.$refs.userSlider.refresh();
        });
    },
    selectReviewer(user) {
      if (!this.pullRequest.reviewers.find((reviewer) => reviewer.id === user.id)) {
        this.newReviewers.push(user);
      }
    },
    removeReviewer(reviewer) {
      const index = this.newReviewers.indexOf(reviewer);
      this.newReviewers.splice(index, 1);
    },
    copyPrUrl() {
      navigator.clipboard.writeText(this.prUrl);
    },
  },
  mounted() {
    this.getTeams(this.organizationId);
    if (this.organizationId === this.defaultOrganization.id) {
      this.selectedTeam = this.defaultTeam;
    }
    this.getRecommendations(this.selectedTeam.id);
  },
  watch: {
    selectedTeam(team) {
      if (team) this.getRecommendations(team.id);
    },
  },
};
</script>
<style lang="scss">
.v-select .vs__dropdown-toggle {
  height: 3rem;
}
.v-select .vs__selected-options {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>
