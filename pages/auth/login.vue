<template>
  <div
    class="flex flex-col w-full max-w-md mx-auto px-4 py-8 mt-24 bg-white rounded-lg shadow-md dark:bg-gray-800 sm:px-6 md:px-8 lg:px-10"
  >
    <template v-if="mustVerify">
      <div class="flex-col bg-white w-full">
        <div class="flex w-full justify-between">
          <div
            class="text-center w-1/2 py-1.5 cursor-pointer"
            @click="
              tab.code = true;
              tab.recovery = false;
            "
            ref="qrCode"
            :class="tab.code ? ' border-red-600 border-b-2' : ''"
          >
            Qr Code
          </div>
          <div
            class="text-center w-1/2 py-1.5 cursor-pointer"
            ref="recCodes"
            @click="
              tab.code = false;
              tab.recovery = true;
            "
            :class="tab.recovery ? ' border-red-600 border-b-2' : ''"
          >
            Recovery Code
          </div>
        </div>
        <template v-if="tab.code"
          ><ValidationObserver v-slot="{ handleSubmit }">
            <form class="mt-5" @submit.prevent="handleSubmit(verify)">
              <template v-if="verifyMessage"
                ><p class="px-2 py-2 bg-red-500 rounded text-white mt-2">
                  {{ verifyMessage }}
                </p></template
              >
              <p v-else class="px-2 py-2 bg-yellow-300 rounded text-white mt-2">
                Verfiy with a code
              </p>

              <ValidationProvider rules="required" v-slot="{ errors }">
                <div class="form-control">
                  <label class="label">
                    <span class="label-text">Code</span>
                  </label>
                  <div class="relative">
                    <input
                      type="number"
                      v-model="recoveryForm.code"
                      placeholder="Enter a code"
                      class="w-full pr-16 input input-primary input-bordered"
                      autocomplete="one-time-code"
                    />
                    <button
                      class="absolute top-0 right-0 rounded-l-none btn btn-primary"
                      type="submit"
                    >
                      Submit
                    </button>
                  </div>
                  <label class="label" v-if="errors[0]">
                    <h5 href="#" class="label-text-alt text-red-600">
                      {{ errors[0] }}
                    </h5>
                  </label>
                </div>
              </ValidationProvider>
            </form>
          </ValidationObserver></template
        >
        <template v-if="tab.recovery"
          ><ValidationObserver v-slot="{ handleSubmit }">
            <form class="mt-5" @submit.prevent="handleSubmit(verify)">
              <template v-if="verifyMessage"
                ><p class="px-2 py-2 bg-red-500 rounded text-white mt-2">
                  {{ verifyMessage }}
                </p></template
              >
              <p v-else class="px-2 py-2 bg-yellow-300 rounded text-white mt-2">
                Verfiy with a recovery code
              </p>

              <ValidationProvider rules="required" v-slot="{ errors }">
                <div class="form-control">
                  <label class="label">
                    <span class="label-text">Code</span>
                  </label>
                  <div class="relative">
                    <input
                      inputmode="text"
                      v-model="recoveryForm.recovery_code"
                      placeholder="Enter verification code"
                      class="w-full pr-16 input input-primary input-bordered"
                      autocomplete="one-time-code"
                    />
                    <button
                      class="absolute top-0 right-0 rounded-l-none btn btn-primary"
                      type="submit"
                    >
                      Submit
                    </button>
                  </div>
                  <label class="label" v-if="errors[0]">
                    <h5 href="#" class="label-text-alt text-red-600">
                      {{ errors[0] }}
                    </h5>
                  </label>
                </div>
              </ValidationProvider>
            </form>
          </ValidationObserver>
        </template>
      </div>
    </template>
    <template v-else>
      <div
        class="self-center mb-6 text-xl font-light text-gray-600 sm:text-2xl dark:text-white"
      >
        Login To Your Account
      </div>
      <p class="px-1 py-2 rounded bg-red-500 text-white self-center" v-if="message">
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
          <form
            action="#"
            autoComplete="off"
            @submit.prevent="handleSubmit(login)"
            method="POST"
          >
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

            <ValidationProvider rules="required" v-slot="{ errors }">
              <div class="form-control">
                <label class="label">
                  <span class="label-text font-bold">Password</span>
                </label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  class="input input-bordered"
                  :class="[{ 'input-error': errors[0] }, { 'input-success': !errors[0] }]"
                  v-model="form.password"
                />
              </div>
              <label class="label" v-if="errors[0]">
                <h5 href="#" class="label-text-alt text-red-600">{{ errors[0] }}</h5>
              </label>
            </ValidationProvider>

            <div class="flex items-center mb-6">
              <div class="flex ml-auto">
                <nuxt-link
                  to="/auth/forgot-password"
                  class="inline-flex text-xs font-thin text-gray-500 sm:text-sm dark:text-gray-100 hover:text-gray-700 dark:hover:text-white"
                >
                  Forgot Your Password?
                </nuxt-link>
              </div>
            </div>
            <div class="flex w-full" ref="submitWrapper">
              <button
                type="submit"
                class="py-2 px-4 bg-purple-600 hover:bg-purple-700 focus:ring-purple-500 focus:ring-offset-purple-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
              >
                Login
              </button>
            </div>
          </form>
        </ValidationObserver>
      </div></template
    >

    <div class="flex items-center justify-center mt-6">
      <nuxt-link
        to="/auth/register"
        class="inline-flex items-center text-xs font-thin text-center text-gray-500 hover:text-gray-700 dark:text-gray-100 dark:hover:text-white"
      >
        <span class="ml-2"> You dont't have an account? </span></nuxt-link
      >
    </div>
  </div>
</template>
<script>
import { ValidationProvider, ValidationObserver } from "vee-validate";
export default {
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  middleware: "auth",
  auth: "guest",
  layout: "empty",
  data() {
    return {
      tab: { code: null, recovry: null },
      form: {
        email: "",
        password: "",
      },
      recoveryForm: {
        code: "",
        recovery_code: "",
      },
      recovery: false,
      mustVerify: false,
      errors: [],
      responseErrors: null,

      verifyMessage: "",
      message: "",
    };
  },

  mounted() {
    this.tab.code = true;
  },
  methods: {
    async login() {
      try {
        await this.$axios.get("sanctum/csrf-cookie");
        await this.$axios
          .$post("/api/login", this.form)
          .then((response) => {
            if (response.two_factor) {
              this.mustVerify = true;
            } else {
              this.$auth.loginWith("laravelSanctum", { data: this.form });
            }
          })
          .catch((error) => {
            this.responseErrors = error.response.data.errors;
            this.message = error.response.data.message;
          });
      } catch (error) {
        this.responseErrors = error.response.data.errors;
      }
    },
    async verify() {
      try {
        await this.$axios.post("/api/two-factor-challenge", this.recoveryForm);
        this.login();
      } catch (error) {
        this.responseErrors = error.response.data.errors;
        this.verifyMessage = error.response.data.message;
      }
    },
    user() {
      this.$axios.get("/user").then((response) => {
        console.log(response.data);
      });
    },
  },
};
</script>
