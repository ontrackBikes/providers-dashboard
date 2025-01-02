<template>
  <div>
    <div v-if="loading">Loading...</div>
    <div v-if="error">{{ error }}</div>
    <div v-if="bookings.length">
      <ul>
        <li v-for="booking in bookings" :key="booking.id">
          {{ booking.details }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      bookings: [],
      loading: false,
      error: null,
      city: "1",
      vehicle: "Honda Dio 100",
      model: "Honda Dio",
    };
  },
  mounted() {
    this.fetchBookingsData();
  },
  methods: {
    async fetchBookingsData() {
      const providerToken = localStorage.getItem("provider_token");
      if (!providerToken) {
        this.error = "Provider token not found";
        return;
      }

      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get(
          "http://localhost:3000/api/daily-rentals/provider/bookings",
          {
            params: {
              city: this.city,
              vehicle: this.vehicle,
              model: this.model,
              limit: 10,
              offset: 0,
            },
            headers: {
              Authorization: `Bearer ${providerToken}`, // Use the token from localStorage
            },
          }
        );
        this.bookings = response.data;
      } catch (err) {
        this.error = "Failed to fetch bookings";
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
