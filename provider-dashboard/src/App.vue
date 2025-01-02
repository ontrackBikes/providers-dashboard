<template>
  <div id="app">
    <div v-if="showNavbar">
      <b-navbar toggleable="lg" type="dark" variant="primary">
        <b-navbar-brand href="#">Provider Dashboard</b-navbar-brand>

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav>
            <b-nav-item to="/">Home</b-nav-item>
            <b-nav-item to="/bookings">Bookings</b-nav-item>
            <b-nav-item to="/vehicles">Vehicles</b-nav-item>
          </b-navbar-nav>

          <b-navbar-nav class="ml-auto">
            <b-nav-item-dropdown right>
              <template #button-content>
                <b-button size="sm" variant="light">
                  <em> {{ providerName }}</em>
                </b-button>
              </template>

              <!-- Conditional Rendering -->
              <template v-if="isLoggedIn">
                <b-dropdown-item to="/profile">Profile</b-dropdown-item>
                <b-dropdown-item @click="logout">Logout</b-dropdown-item>
              </template>
              <template v-else>
                <b-nav-item to="/login">Login</b-nav-item>
              </template>
            </b-nav-item-dropdown>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
    </div>
    <div><router-view></router-view></div>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      providerName: localStorage.getItem("provider_name") || "",
    };
  },
  computed: {
    showNavbar() {
      return !this.$route.meta.hideNavbar;
    },
    isLoggedIn() {
      return !!localStorage.getItem("provider_token");
    },
  },
  methods: {
    logout() {
      localStorage.removeItem("provider_token");
      this.$router.push("/login");
      console.log("User logged out.");
    },
  },
};
</script>

<style lang="scss">
@import "@/assets/styles/custom.scss"; // Import your custom SCSS
</style>
