<template>
  <div>
    <b-container v-if="loading" class="text-center my-4">
      <div>
        <b-spinner label="Loading..." variant="primary"></b-spinner>
      </div>
    </b-container>
    <b-container v-else>
      <h4 class="my-4">Bookings</h4>

      <b-row>
        <b-col md="3" class="d-none d-md-block">
          <!-- Filter Section -->
          <div class="border p-3 rounded mb-4">
            <div class="d-flex justify-content-between align-items-center">
              <h6 class="mb-2">STATUS</h6>
              <a href="#" @click.prevent="clearFilters" class="text-primary">
                CLEAR ALL
              </a>
            </div>
            <hr />
            <b-form-group style="margin-bottom: 30px">
              <b-form-checkbox-group
                v-model="statusSelected"
                :options="bookingStatuses"
                stacked
              ></b-form-checkbox-group>
            </b-form-group>
          </div>
        </b-col>

        <b-col md="9">
          <!-- Filters for Mobile View -->
          <b-form-checkbox-group
            v-model="statusSelected"
            :options="bookingStatuses"
            class="d-md-none"
            style="
              display: flex;
              white-space: nowrap;
              max-width: 100%;
              overflow-x: auto;
            "
          ></b-form-checkbox-group>

          <div class="my-2">{{ count }} bookings found</div>

          <!-- Bookings Section -->
          <div v-if="filteredBookings.length">
            <b-card
              v-for="(booking, index) in filteredBookings"
              :key="index"
              class="my-2"
              @click="openBookingModal(booking)"
            >
              <b-badge :variant="booking.statusDetails.bgColor">
                {{ booking.statusDetails.name }}
              </b-badge>

              <div class="d-flex justify-content-between align-items-center">
                <h5>{{ booking.bookingId }}</h5>
              </div>

              <div>
                <p>
                  <strong>Pickup:</strong> {{ formatDate(booking.pickupTime) }}
                </p>
                <p><strong>Drop:</strong> {{ formatDate(booking.dropTime) }}</p>
                <p><strong>Amount:</strong> ₹{{ booking.amount }}</p>
                <p>
                  <strong>Booking Days:</strong> {{ booking.bookingDays }} days
                </p>
              </div>
            </b-card>
          </div>

          <div v-else class="text-center">
            <p>No bookings found or data is loading...</p>
          </div>
        </b-col>
      </b-row>
    </b-container>

    <!-- Modal for booking details -->
    <b-modal hide-footer v-model="showBookingModel" title="Booking Details">
      <div v-if="selectedBooking">
        <b-row>
          <b-col cols="6">
            <div class="font-weight-bold">Booking ID:</div>
            <div>
              {{ selectedBooking.bookingId || "N/A" }}
            </div>
          </b-col>
          <b-col cols="6">
            <div class="font-weight-bold">Status:</div>
            <div>
              {{ selectedBooking.statusDetails.name || "N/A" }}
            </div>
          </b-col>

          <b-col cols="6">
            <div class="font-weight-bold">Pickup:</div>
            <div>
              {{ formatDate(selectedBooking.pickupTime) || "N/A" }}
            </div>
          </b-col>
          <b-col cols="6">
            <div class="font-weight-bold">Drop:</div>
            <div>{{ formatDate(selectedBooking.dropTime) || "N/A" }}</div>
          </b-col>

          <b-col cols="6">
            <div class="font-weight-bold">Amount:</div>
            <div>₹{{ selectedBooking.amount || "N/A" }}</div>
          </b-col>
          <b-col cols="6">
            <div class="font-weight-bold">Booking Days:</div>
            <div>{{ selectedBooking.bookingDays || "N/A" }} days</div>
          </b-col>
          <b-col cols="6">
            <div class="font-weight-bold">Payment Status:</div>
            <div>
              {{ selectedBooking.paymentStatus === 1 ? "Paid" : "Pending" }}
            </div>
          </b-col>
        </b-row>
        <hr />

        <p><strong>Vehicle Model:</strong> {{ selectedBooking.model }}</p>

        <p>
          <strong>Payment Mode:</strong>
          {{ selectedBooking.paymentMode || "N/A" }}
        </p>
        <p>
          <strong>Created At:</strong>
          {{ formatDate(selectedBooking.createdAt) }}
        </p>
      </div>
    </b-modal>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      bookings: [],
      statusSelected: [], 
      modelSelected: [],
      loading: false,
      error: null,
      count: 0, 
      showBookingModel: false,
      selectedBooking: null,
      bookingStatuses: [
        { id: "upcoming", value: 0, text: "Upcoming" },
        { id: "active", value: 1, text: "Active" },
        { id: "completed", value: 2, text: "Completed" },
        { id: "expired", value: 3, text: "Expired" },
      ],
    };
  },
  mounted() {
    this.updateQueryParamUrl();
    this.fetchBookingsData();
  },
  watch: {
    statusSelected: {
      handler(newStatuses) {
        this.updateQueryParams(newStatuses);
        this.fetchBookingsData();
      },
      deep: true,
    },
  },
  computed: {
    filteredBookings() {
      return this.bookings.filter((booking) => booking != null);
    },
  },
  methods: {
    async fetchBookingsData() {
      const providerToken = localStorage.getItem("provider_token");
      if (!providerToken) {
        this.error = "Provider token not found. Please log in.";
        return;
      }

      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get(
          "http://localhost:3000/api/daily-rentals/provider/bookings",
          {
            params: { status: this.statusSelected, model: this.modelSelected },
            headers: { Authorization: providerToken },
          }
        );
        this.bookings = response.data.bookings || [];
        this.count = response.data.total || 0;
      } catch (err) {
        this.error = `Failed to fetch bookings: ${err.message}`;
      } finally {
        this.loading = false;
      }
    },
    formatDate(date) {
      return new Date(date).toLocaleString();
    },
    clearFilters() {
      this.statusSelected = [];
    },
    updateQueryParams(statuses) {
      const query = statuses.length ? { status: statuses.join(",") } : {};
      this.$router.replace({ query }).catch(() => {});
    },
    updateQueryParamUrl() {
      const queryStatuses = this.$route.query.status;
      if (queryStatuses) {
        this.statusSelected = queryStatuses.split(",").map(Number);
      }
    },
    openBookingModal(booking) {
      this.selectedBooking = booking;
      this.showBookingModel = true;
    },
  },
};
</script>

<style scoped>
/* Add your styles here */
</style>
