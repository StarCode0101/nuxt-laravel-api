<template>
  <div>
    <!-- this is absolute so all main must be relative i could also have diffrent type of navbar-->
    <VoyageNavbar />
    <!-- then full screen menu partial which will be shown based on mobile or desktop -->

    <!-- then full backgroundImage landing-->
    <main>
      <Nuxt />
    </main>
    <!-- footer -->
  </div>
</template>
<script>
import VoyageNavbar from "~/layouts/partials/VoyageNavbar";
import _debounce from "lodash/debounce";

export default {
  components: {
    VoyageNavbar,
  },

  head() {
    return {
      bodyAttrs: {
        class: ["overflow-x-hidden"],
      },
    };
  },
  data() {
    return {
      isMobile: false,
    };
  },

  beforeMount() {
    if (process.client) {
      if (screen.width <= 1024) {
        this.isMobile = true;
      } else {
        this.isMobile = false;
      }
    }
  },
};
</script>
