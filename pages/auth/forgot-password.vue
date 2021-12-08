<template>
  <div
    class="flex flex-col w-full max-w-md mx-auto px-4 py-8 mt-24 bg-white rounded-lg shadow-md dark:bg-gray-800 sm:px-6 md:px-8 lg:px-10"
  >
    <div
      class="self-center mb-6 text-xl font-light text-gray-600 sm:text-2xl dark:text-white"
    >
      Reset Password
    </div>
    <p class="text-blue-700 text-xs text-center">
      Type your password we will send you a password reset link
    </p>
    <p
      v-if="message"
      class="bg-green-500 text-white text-md text-center px-2 py-3 mt-2 rounded-md"
    >
      {{ message }}
    </p>
    <div class="mt-8">
      <div v-if="responseErrors" class="bg-red-50 border-l-8 border-red-900 mb-2">
        <div class="flex items-center">
          <div class="p-2">
            <div class="flex items-center">
              <div class="ml-2">
                <svg
                  class="h-8 w-8 text-red-900 mr-2 cursor-pointer"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  @click="responseErrors = null"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p class="px-6 py-4 text-red-900 font-semibold text-lg">
                Please fix the following errors.
              </p>
            </div>
            <div class="px-16 mb-4">
              <li
                v-for="(error, key) in responseErrors"
                v-bind:key="key"
                class="text-md font-bold text-red-500 text-sm"
              >
                {{ `${key}:  ${error}` }}
              </li>
            </div>
          </div>
        </div>
      </div>
      <ValidationObserver v-slot="{ handleSubmit }">
        <form autoComplete="off" @submit.prevent="handleSubmit(submit)" method="POST">
          <ValidationProvider rules="required|email" v-slot="{ errors }">
            <div class="form-control">
              <label class="label">
                <span class="label-text font-bold">Email</span>
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                class="input input-bordered"
                :class="[{ 'input-error': errors[0] }, { 'input-success': !errors[0] }]"
                v-model="form.email"
              />
            </div>
            <label class="label" v-if="errors[0]">
              <h5 href="#" class="label-text-alt text-red-600">{{ errors[0] }}</h5>
            </label>
          </ValidationProvider>

          <div class="flex items-center mb-6">
            <div class="flex ml-auto">
              <nuxt-link
                to=""
                class="inline-flex text-xs font-thin text-gray-500 sm:text-sm dark:text-gray-100 hover:text-gray-700 dark:hover:text-white"
              >
                Forgot Account?
              </nuxt-link>
            </div>
          </div>
          <div class="flex w-full" ref="submitWrapper">
            <button
              type="submit"
              class="py-2 px-4 bg-purple-600 hover:bg-purple-700 focus:ring-purple-500 focus:ring-offset-purple-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
            >
              Send
            </button>
          </div>
        </form>
      </ValidationObserver>
    </div>
    <div class="flex items-center justify-center mt-6">
      <nuxt-link
        to="/auth/login"
        class="inline-flex items-center text-xs font-thin text-center text-gray-500 hover:text-gray-700 dark:text-gray-100 dark:hover:text-white"
      >
        <span class="ml-2"> Already have an account? </span></nuxt-link
      >
    </div>
  </div>
</template>

<script>
import { ValidationObserver, ValidationProvider } from "vee-validate";

export default {
  components: {
    ValidationObserver,
    ValidationProvider,
  },
  layout: "empty",
  auth: "guest",
  data() {
    return {
      form: {
        email: "",
      },

      message: null,
      errors: [],
      responseErrors: null,
    };
  },

  methods: {
    async submit() {
      try {
        await this.$axios.get("sanctum/csrf-cookie");
        await this.$axios.post("api/forgot-password", this.form).then((response) => {
          if (response.success) {
          }
          this.message = response.data.message;
          console.log(this.message);
          console.log(response);
        });
      } catch (error) {
        this.responseErrors = error.response.data.errors;
      }
    },
  },
};
</script>
