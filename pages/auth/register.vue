<template>
  <div
    class="flex flex-col w-full max-w-md mx-auto px-4 py-8 mt-24 bg-white rounded-lg shadow-md dark:bg-gray-800 sm:px-6 md:px-8 lg:px-10"
  >
    <div
      class="self-center mb-2 text-xl font-light text-gray-800 sm:text-2xl dark:text-white"
    >
      Create a new account
    </div>
    <span
      class="justify-center text-sm text-center text-gray-500 flex-items-center dark:text-gray-400"
    >
      Already have an account ?
      <nuxt-link
        to="/auth/login"
        class="text-sm text-blue-500 underline hover:text-blue-700"
      >
        Sign in
      </nuxt-link>
    </span>
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
        <form action="#" method="post" @submit.prevent="handleSubmit(register)">
          <div class="flex flex-col md:flex-row md:space-x-1 -mr-1">
            <ValidationProvider rules="required|name" v-slot="{ errors }">
              <div class="form-control">
                <label class="label">
                  <span class="label-text font-bold">First Name</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter your first name"
                  class="input input-bordered"
                  :class="[{ 'input-error': errors[0] }, { 'input-success': !errors[0] }]"
                  v-model="form.firstname"
                />
              </div>
              <label class="label" v-if="errors[0]">
                <h5 href="#" class="label-text-alt text-red-600">
                  {{ errors[0] }}
                </h5>
              </label>
            </ValidationProvider>
            <ValidationProvider rules="required|name" v-slot="{ errors }">
              <div class="form-control">
                <label class="label">
                  <span class="label-text font-bold">Last name</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter your last name"
                  class="input input-bordered"
                  :class="[{ 'input-error': errors[0] }, { 'input-success': !errors[0] }]"
                  v-model="form.lastname"
                />
              </div>
              <label class="label" v-if="errors[0]">
                <h5 href="#" class="label-text-alt text-red-600">
                  {{ errors[0] }}
                </h5>
              </label>
            </ValidationProvider>
          </div>
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
              <h5 href="#" class="label-text-alt text-red-600">
                {{ errors[0] }}
              </h5>
            </label>
          </ValidationProvider>

          <ValidationProvider rules="required|min:7|password:7" v-slot="{ errors }">
            <div class="form-control">
              <label class="label">
                <span class="label-text font-bold">Password</span>
              </label>
              <div class="relative">
                <input
                  type="password"
                  placeholder="Enter your password"
                  class="input input-bordered w-full"
                  :class="[{ 'input-error': errors[0] }, { 'input-success': !errors[0] }]"
                  v-model="form.password"
                  ref="inputRef"
                />
                <span
                  class="absolute top-3 right-2 text-2xs font-bold cursor-pointer p-1 text-white rounded-md"
                  :class="[show ? 'bg-blue-400' : 'bg-blue-600']"
                  @click="toggleShow"
                  >{{ showText }}</span
                >
              </div>
            </div>
            <label class="label" v-if="errors[0]">
              <h5 href="#" class="label-text-alt text-red-600">
                {{ errors[0] }}
              </h5>
            </label>

            <button class="mt-2 btn btn-primary w-full" type="submit">register</button>
          </ValidationProvider>
        </form>
      </ValidationObserver>
    </div>
  </div>
</template>
<script>
import { ValidationObserver, ValidationProvider } from "vee-validate";
export default {
  layout: "empty",
  middleware: "auth",
  auth: "guest",
  components: {
    ValidationProvider,
    ValidationObserver,
  },

  data() {
    return {
      form: {
        firstname: "",
        lastname: "",
        email: "",
        password: "",
      },

      show: false,
      showText: "SHOW",
      errors: [],
      responseErrors: null,
    };
  },
  methods: {
    async register() {
      //let data = { form.firstname, lastname, email, password };
      try {
        await this.$axios.get("sanctum/csrf-cookie");
        await this.$axios.post("api/register", this.form);
        await this.$auth.loginWith("laravelSanctum", { data: this.form });
      } catch (error) {
        console.log(error);
        //if (error.response.status === 422) {
        this.responseErrors = error.response.data.errors;
        //}
      }
    },

    toggleShow() {
      this.show = !this.show;
      if (this.show) {
        this.showText = "HIDE";
        this.$refs.inputRef.type = "text";
      } else {
        this.showText = "SHOW";
        this.$refs.inputRef.type = "password";
      }
    },
  },
};
</script>
