<template>
  <div class="flex flex-col justify-center items-center mx-auto max-w-md min-h-screen">
    <div>
      <div class="py-4 px-4 rounded shadow-2xl mt-16">
        <div class="flex flex-col items-center space-y-4">
          <h3 class="text-white text-lg font-semibold text-center">
            Two Factor Authentication
          </h3>
          <p class="text-white text-center">
            Add additional security to your account using two factor authentication by
            using either a recover code or an authenticator app like Google Authenticator.
          </p>
          <div class="alert alert-success" v-if="twoFactorEnabled">
            <div class="flex-1">
              <label class="text-sm">You have enabled two factor authentication.</label>
            </div>
          </div>
          <div class="alert alert-error" v-else>
            <div class="flex-1">
              <label class="text-sm"
                >You have not enabled two factor authentication.</label
              >
            </div>
          </div>

          <template v-if="!twoFactorEnabled">
            <form @submit.prevent="enable">
              <button type="submit" class="btn btn-sm btn-success hover:bg-green-800">
                enable
              </button>
            </form>
          </template>
          <template v-else>
            <form @submit.prevent="disable">
              <button type="submit" class="btn btn-sm btn-error hover:bg-red-800">
                Disable
              </button>
            </form>
          </template>
          <template v-if="twoFactorEnabled">
            <div class="flex-col bg-white w-full">
              <div class="flex w-full justify-between">
                <div
                  class="text-center w-1/2 py-1.5 cursor-pointer"
                  @click="showQrCodeTab"
                  ref="qrCode"
                  :class="tab1.active"
                >
                  Qr Code
                </div>
                <div
                  class="text-center w-1/2 py-1.5 cursor-pointer"
                  ref="recCodes"
                  @click="showRecCodeTab"
                  :class="tab2.active"
                >
                  Recovery Code
                </div>
              </div>
              <div class="w-full h-auto pb-5 px-3.5">
                <template v-if="tab1.active">
                  <template v-if="twoFactorEnabled && qrCode.length == 0">
                    <form class="flex justify-center mt-2" @submit.prevent="showQrCode">
                      <button
                        type="submit"
                        class="btn btn-sm btn-success hover:bg-green-800"
                      >
                        Show QR Code
                      </button>
                    </form>
                  </template>
                  <div class="flex-1" v-if="qrCode">
                    <div class="mt-3">
                      <p class="text-left">
                        Two factor authentication is now enabled. Scan the following QR
                        code using your phone's authenticator application.
                      </p>
                    </div>
                    <div class="flex justify-center pt-3" v-html="qrCode"></div>
                  </div>
                  <template v-if="!twoFactorEnabledAndComfirmed">
                    <ValidationObserver v-slot="{ handleSubmit }">
                      <div class="alert alert-warning mt-4">
                        <div class="flex-1">
                          <label
                            >!!! You have to verify a code to be sure you have properly
                            setup an authenticator before enabling two facror
                            authentication</label
                          >
                        </div>
                      </div>
                      <form @submit.prevent="handleSubmit(confirmTwoFA)">
                        <template v-if="conFirmMessage"
                          ><p class="px-2 py-2 bg-red-500 rounded text-white mt-2">
                            {{ conFirmMessage }}
                          </p></template
                        >
                        <ValidationProvider rules="required" v-slot="{ errors }">
                          <div class="form-control">
                            <label class="label">
                              <span class="label-text">Code</span>
                            </label>
                            <div class="relative">
                              <input
                                type="number"
                                v-model="code"
                                oninput="javascript: if(this.value.length > this.maxlength) this.value.slice(0,this.maxlength)"
                                placeholder="Enter verification code"
                                class="w-full pr-16 input input-primary input-bordered"
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
                </template>
                <template v-if="tab2.active">
                  <template v-if="twoFactorEnabled && recCodes.length == 0">
                    <form
                      class="flex justify-center mt-2"
                      @submit.prevent="showRecoveryCodes"
                    >
                      <button
                        type="submit"
                        class="btn btn-sm btn-success hover:bg-green-800"
                      >
                        Show Codes
                      </button>
                    </form>
                  </template>
                  <div class="flex-1" v-if="recCodes.length > 0">
                    <div class="mt-3">
                      <p class="text-left">
                        Store these recovery codes in a secure password manager. They can
                        be used to recover access to your account if your two factor
                        authentication device is lost, this can only be used if you have
                        confirmed setting up the QR code.
                      </p>
                    </div>
                    <div class="w-75 bg-gray-200 rounded p-3">
                      <div v-for="(code, index) in recCodes" :key="index">
                        <p class="px-1.5 py-2 font-bold">{{ code }}</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      class="btn btn-primary mt-2 w-full"
                      v-if="recCodes.length > 0"
                      @click.prevent="regenerateRecoveryCodes"
                    >
                      Regenerate Recovery Codes
                    </button>
                  </div></template
                >
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>

    <div
      class="flex justify-center items-center w-full min-h-screen absolute"
      :class="openConfirm ? 'bg-black bg-opacity-50' : ''"
      v-if="openConfirm"
    >
      <div class="bg-gray-200 py-8 px-8 rounded max-w-md h-1/4">
        <ValidationObserver v-slot="{ handleSubmit }">
          <button
            type="button"
            class="btn btn-sm btn-circle"
            @click.prevent="openConfirm = !openConfirm"
          >
            X
          </button>
          <div class="alert alert-warning mt-4">
            <div class="flex-1">
              <label class="text-sm"
                >Please comfirm your password before you can setup your two factor
                authentication</label
              >
            </div>
          </div>
          <span
            class="flex justify-center text-red-400 italic mb-4"
            v-if="errors.password"
            >{{ errors.password[0] }}</span
          >
          <form @submit.prevent="handleSubmit(confirmPassword)">
            <ValidationProvider rules="required" v-slot="{ errors }">
              <div class="form-control">
                <label class="label">
                  <span class="label-text">Password</span>
                </label>
                <div class="relative">
                  <input
                    type="password"
                    v-model="form.password"
                    placeholder="Enter your password"
                    class="w-full pr-16 input input-primary input-bordered"
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
      </div>
    </div>
  </div>
</template>
<script>
import { ValidationObserver, ValidationProvider } from "vee-validate";

export default {
  components: {
    ValidationProvider,
    ValidationObserver,
  },

  head() {
    return {
      bodyAttrs: {
        class: "bg-purple-900 bg-gradient-to-tl from-red-900 to-red-700;",
      },
    };
  },
  middleware: ["auth"],
  data: () => ({
    tab1: { active: null },
    tab2: { active: null },
    active: { "border-red-600": true, "border-b-2": true },
    openConfirm: false,
    isEnabled: false,
    isTwoFactorConmfirmed: false,
    isPasswordConfirmed: false,
    code: "",
    qrCode: "",
    recCodes: [],
    form: {
      password: "",
    },
    errors: [],
    message: "",
    conFirmMessage: "",
  }),
  computed: {
    twoFactorEnabled() {
      return this.isEnabled || this.$auth.user.two_factor_secret ? true : false;
    },

    twoFactorEnabledAndComfirmed() {
      return this.isTwoFactorConmfirmed || this.$auth.user.two_factor_confirmed
        ? true
        : false;
    },
  },
  mounted() {
    this.tab1.active = this.active;

    this.isEnabled = this.$auth.user.two_factor_secret ? true : false;
    this.isTwoFactorConmfirmed = this.$auth.user.two_factor_confirmed ? true : false;

    if (this.isEnabled) {
      this.showQrCode();
      this.showRecoveryCodes();
    }
  },
  methods: {
    showQrCodeTab() {
      this.tab1.active = this.active;
      this.tab2.active = null;
    },
    showRecCodeTab() {
      this.tab1.active = null;
      this.tab2.active = this.active;
    },

    async confirmPasswordStatus() {
      try {
        await this.$axios.$get("/api/user/confirmed-password-status").then((resp) => {
          this.isPasswordConfirmed = resp.confirmed;
        });
      } catch (error) {
        console.log(error.response);
      }
    },
    async confirmPassword() {
      try {
        await this.$axios.$post("/api/user/confirm-password", this.form);

        if (this.isEnabled) {
          this.showQrCode();
          this.showRecoveryCodes();
        } else if (this.isEnabled == false) {
          this.enable();
        } else {
          this.disable();
        }

        this.openConfirm = false;
      } catch (error) {
        this.errors = error.response.data.errors;
      }
    },
    async enable() {
      try {
        await this.$axios.$post("/api/user/two-factor-authentication");
        this.isEnabled = true;
        this.isTwoFactorConmfirmed = false;
        this.showQrCode();
        this.showRecoveryCodes();
      } catch (error) {
        //if the user hasn't comfirm password this error is called and shows modal
        if (error.response.data.message) {
          this.message = error.response.data.message;
          this.openConfirm = true;
        }
      }
    },
    async disable() {
      try {
        await this.$axios.$delete("/api/user/two-factor-authentication");
        await this.$auth.fetchUser();
        this.isEnabled = false;
        this.isTwoFactorConmfirmed = false;
      } catch (error) {
        //if the user hasn't comfirm password this error is called and shows modal
        if (error.response.data.message) {
          this.message = error.response.data.message;
          this.openConfirm = true;
        }
      }
    },
    async showQrCode() {
      try {
        await this.$axios.$get("/api/user/two-factor-qr-code").then((resp) => {
          this.qrCode = resp.svg;
        });
      } catch (error) {
        console.log(error.response);
        if (error.response.status === 423) {
          this.openConfirm = true;
        }
      }
    },
    async showRecoveryCodes() {
      try {
        await this.$axios.$get("/api/user/two-factor-recovery-codes").then((resp) => {
          this.recCodes = resp;
        });
      } catch (error) {
        if (error.response.data.message) {
          if (error.response.status === 423) {
            this.openConfirm = true;
          }
          this.message = error.response.data.message;
        }
      }
    },
    async regenerateRecoveryCodes() {
      try {
        await this.$axios.$post("/api/user/two-factor-recovery-codes").then(() => {
          this.showRecoveryCodes();
        });
      } catch (err) {
        console.log(err);
      }
    },

    async confirmTwoFA() {
      try {
        await this.$axios.get("sanctum/csrf-cookie");
        await this.$axios.$post("/api/2fa-confirm", { code: this.code });
        await this.$auth.fetchUser();
      } catch (error) {
        if (error.response.status == 403) {
          this.conFirmMessage = error.response.data;
        }
      }
    },
    logout() {
      this.$auth.logout();
    },
  },
};
</script>
