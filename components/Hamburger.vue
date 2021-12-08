<template>
  <div class="flex flex-col justify-center">
    <div class="relative sm:max-w-xl mx-auto">
      <button
        class="w-14 h-14 relative focus:outline-none bg-transparent rounded"
        @click="toggle"
      >
        <div
          id="dd"
          class="block w-1 absolute left-5 top-6 transform -translate-x-1/2 -translate-y-1/2"
        >
          <span
            class="block absolute h-0.5 w-5 text-white bg-current transform transition duration-500 ease-in-out"
            :class="{ ' rotate-45 ': active, ' -translate-y-1.5 ': !active }"
          ></span>
          <span
            class="block absolute h-0.5 w-4 text-white bg-current transform transition duration-500 ease-in-out"
            :class="{ 'opacity-0': active }"
          ></span>
          <span
            class="block absolute h-0.5 w-5 text-white bg-current transform transition duration-500 ease-in-out"
            :class="{ '-rotate-45': active, ' translate-y-1.5': !active }"
          ></span>
        </div>
      </button>
    </div>
  </div>
</template>
<script>
export default {
  name: "Hamburger",
  data() {
    return {
      active: false,
    };
  },
  methods: {
    toggle() {
      this.active = !this.active;
      this.$emit("toggle", this.active);
    },
  },
  computed: {},
};
</script>
