<template>
  <nav class="absolute top-0 w-full flex flex-wrap items-center z-50 px-2 py-3">
    <div class="navbar w-full -mb-2 bg-transparent text-white">
      <div class="px-2 mx-2" :class="[isMobile ? 'flex-1' : 'flex-none']">
        <span class="text-lg font-bold"> 2FA </span>
      </div>
      <div v-if="!isMobile" class="flex-1 px-2 mx-2">
        <ul class="flex flex-row list-none space-x-3">
          <li
            v-if="$auth.loggedIn"
            class="bg-green-600 rounded-lg px-4 py-2 shadow-md font-semibold"
          >
            <a href="#" @click.prevent="logout">Logout</a>
          </li>

          <!--  <li
            v-if="!$auth.user.email_verified_at"
            class="bg-green-600 rounded-lg px-4 py-2 shadow-md font-semibold"
          >
            <nuxt-link to="/auth/verify" @click.prevent="logout">Verify email</nuxt-link>
          </li>
 -->
          <!--  <li
            v-if="!$auth.user.two_factor_comfirmed"
            class="bg-green-600 rounded-lg px-4 py-2 shadow-md font-semibold"
          >
            <nuxt-link to="/auth/two-factor-authentication" @click.prevent="logout"
              >2fa</nuxt-link
            >
          </li> -->
        </ul>
      </div>

      <div class="flex-none">
        <button class="btn btn-square btn-ghost" @click="onToggleMenu">
          <hamburger></hamburger>
        </button>
      </div>

      <div class="flex-none">
        <button class="btn btn-square btn-ghost" @click="onToggleMenu">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            class="inline-block w-6 h-6 stroke-current"
            width="400"
            height="500"
            id="demo"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </button>
      </div>
    </div>

    <div
      id="collapse"
      :class="{ 'h-0': collapsed }"
      ref="menu"
      v-if="isMobile"
      class="overflow-hidden lg:flex lg:justify-end flex-grow items-center text-gray-400 bg-white lg:bg-transparent lg:shadow-none"
    >
      <ul class="flex flex-col list-none space-x-3">
        <li>
          <NuxtLink to="/">Home</NuxtLink>
        </li>
      </ul>
    </div>
  </nav>
</template>
<script>
export default {
  name: "VoyageNavbar",

  data() {
    return {
      collapsed: false,
      isMobile: false,
      isMenu: false,
      mobileMenuClass: {
        flex: true,
      },
    };
  },

  methods: {
    onToggle: (active) => {},
    onToggleMenu() {
      //this.$store.commit("TOGGLEMENU");
      //alert("works on hms");
    },

    logout() {
      //this.$axios.get("sanctum/csrf-cookie");
      this.$auth.logout();
    },
  },

  created() {
    if (process.client) {
      if (screen.width <= 1024) {
        this.isMobile = true;
        this.collapsed = true;
      } else {
        this.isMobile = false;
      }
    }
  },

  mounted() {},
};
</script>
<style scoped></style>
