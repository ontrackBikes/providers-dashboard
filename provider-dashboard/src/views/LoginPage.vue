<template>
  <b-container class="my-5">
    <div class="my-2">
      <b-img
        src="https://lessor-dashboard.web.app/img/ontrack-logo.1ea9ca24.png"
        center
        alt="Ontrack"
        style="max-width: 160px"
      ></b-img>
    </div>
    <b-row class="justify-content-center">
      <b-col cols="12" md="6" lg="4">
        <b-card
          title="Provider Dashboard"
          class="text-center text-primary bg-light"
          style="border-radius: 2rem"
        >
          <b-form
            @submit.prevent="login"
            class="d-flex flex-column align-items-center"
          >
            <div class="my-2 w-75">
              <b-form-group label-for="mobile">
                <b-form-input
                  type="text"
                  id="mobile"
                  v-model="mobile"
                  required
                  placeholder="Enter phone number"
                  class="text-center"
                  style="border-radius: 8px"
                ></b-form-input>
              </b-form-group>
            </div>

            <div class="w-75">
              <b-form-group label-for="password">
                <b-form-input
                  type="password"
                  id="password"
                  v-model="password"
                  required
                  placeholder="Enter password"
                  class="text-center"
                  style="border-radius: 8px"
                ></b-form-input>
              </b-form-group>
            </div>

            <div class="text-end my-2 w-75">
              <b-button type="submit" variant="primary" block>Login</b-button>
            </div>
          </b-form>
        </b-card>
      </b-col>
    </b-row>

    <!-- b-toast for displaying error messages -->
    <b-toast v-model="showToast" variant="danger" title="Error" solid>
      {{ errorMessage }}
    </b-toast>
  </b-container>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      mobile: "",
      password: "",
      errorMessage: "",
      showToast: false, // Add this variable to control the toast visibility
    };
  },
  methods: {
    async login() {
      try {
        const response = await axios.post(
          "http://localhost:3000/api/daily-rentals/provider/login",
          {
            mobile: this.mobile,
            password: this.password,
          }
        );

        const data = response.data;

        if (data.error === 0) {
          localStorage.setItem("provider_token", data.token);
          this.$router.push("/");
        } else {
          this.errorMessage = data.message || "Invalid credentials";
          this.showToast = true; // Show the toast on error
        }
      } catch (error) {
        this.errorMessage =
          error.response?.data?.message || "An unexpected error occurred";
        this.showToast = true; // Show the toast on error
      }
    },
  },
};
</script>
