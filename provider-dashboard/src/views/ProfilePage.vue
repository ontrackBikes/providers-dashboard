<template>
  <div>
    <b-container>
      <b-row class="my-4">
        <b-col>
          <h2>Provider Profile</h2>
        </b-col>
      </b-row>

      <b-row class="mt-4">
        <b-col>
          <b-card v-if="profile" class="mb-4">
            <h4>{{ profile.name || "NA" }}</h4>
            <p><strong>ID:</strong> {{ profile._id || "NA" }}</p>
            <p><strong>Email:</strong> {{ profile.email || "NA" }}</p>
            <p><strong>Phone:</strong> {{ profile.mobile || "NA" }}</p>
            <p><strong>Address:</strong> {{ profile.address || "NA" }}</p>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      profile: null, // Holds the provider profile data
    };
  },
  mounted() {
    this.fetchProfile();
  },
  methods: {
    async fetchProfile() {
      try {
        const providerToken = localStorage.getItem("provider_token"); // Retrieve the token from localStorage

        if (!providerToken) {
          console.log("Provider token not found in localStorage");
        }

        const response = await axios.get(
          `http://localhost:3000/api/daily-rentals/provider/profile`,
          {
            headers: {
              Authorization: providerToken,
            },
          }
        );

        this.profile = response.data.provider;
        localStorage.setItem("provider_name", response.data.provider.name);
      } catch (error) {
        console.log("Error fetching provider profile:", error.message);
      }
    },
  },
};
</script>

<style>
/* No additional styles added to align with your preferences */
</style>
