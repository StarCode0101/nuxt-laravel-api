<template>
  <div>
    <form method="post" @click.prevent="send">
      <button
        class="bg-green-600 rounded-lg px-4 py-2 shadow-md font-semibold"
        type="submit"
      >
        Resend
      </button>
    </form>
  </div>
</template>
<script>
export default {
  layout: "empty",
  data() {
    return {
      form: {
        email: "",
      },
      message: "",
      errors: [],
    };
  },

  methods: {
    async send() {
      try {
        await this.$axios.get("sanctum/csrf-cookie");
        await this.$axios.post("/api/email/verification-notification").then((resp) => {
          this.message = resp.data.message;
        });
      } catch (error) {
        this.errors = error.response.data.errors;
      }
    },
  },
};
</script>
