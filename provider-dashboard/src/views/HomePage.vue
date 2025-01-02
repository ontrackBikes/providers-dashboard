<template>
  <div>
    <b-container class="my-4">
      <!-- Metrics Cards Row -->
      <b-row class="mb-4">
        <b-col
          v-for="(item, index) in cardData"
          :key="index"
          cols="6"
          md="3"
          sm="6"
        >
          <b-card
            :bg-variant="item.bgVariant"
            text-variant="white"
            class="metric-card my-2"
          >
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h2 class="mb-0">{{ item.value }}</h2>
                <div class="small">{{ item.label }}</div>
              </div>
              <b-icon :icon="item.icon" font-scale="1.5"></b-icon>
            </div>
          </b-card>
        </b-col>
      </b-row>

      <!-- Charts Row -->
      <b-row>
        <b-col cols="12" md="4">
          <b-card class="my-2">
            <div class="text-center my-4">
              <div class="position-relative d-inline-block">
                <canvas ref="progressChart" width="150" height="150"></canvas>
                <div
                  class="position-absolute top-50 start-50 translate-middle text-center"
                  style="transform: translate(-50%, -50%)"
                ></div>
                <h3 class="mb-0">785</h3>
                <small class="text-muted">Available Vehicle Today</small>
              </div>
            </div>

            <div class="my-6">
              <h6 class="my-2">Booked Vehicle Today</h6>
              <div
                v-for="(item, index) in bookingStats"
                :key="index"
                class="my-4"
              >
                <div class="d-flex justify-content-between my-2">
                  <span>{{ item.label }}</span>
                  <span>{{ item.value }}</span>
                </div>
                <b-progress
                  :value="item.value"
                  :variant="item.variant"
                  height="0.5rem"
                ></b-progress>
              </div>
            </div>
          </b-card>
        </b-col>

        <b-col cols="12" md="8">
          <b-card class="my-2">
            <div class="d-flex justify-content-between align-items-center my-4">
              <h5 class="mb-0">Reservation Statistic</h5>
              <div class="text-muted">
                <span class="mr-3">
                  <span class="badge bg-primary me-2">549</span> Check In
                </span>
                <span>
                  <span class="badge bg-danger me-2">327</span> Check Out
                </span>
              </div>
            </div>
            <canvas ref="reservationChart" height="182"></canvas>
          </b-card>
        </b-col>
      </b-row>

      <b-card>
        <b-button @click="getAddresses()"> get </b-button>
      </b-card>
    </b-container>
  </div>
</template>

<script>
import axios from "axios";
import Chart from "chart.js/auto";

export default {
  data() {
    return {
      cardData: [
        {
          value: 872,
          label: "Total",
          icon: "house-door", // Home icon for total
          bgVariant: "primary",
        },
        {
          value: 285,
          label: "Available",
          icon: "calendar-check", // Calendar check icon for available
          bgVariant: "success",
        },
        {
          value: 53,
          label: "Booked",
          icon: "check-circle", // Check circle icon for booked
          bgVariant: "warning",
        },
        {
          value: 78,
          label: "Under Service",
          icon: "tools", // Tools icon for under service
          bgVariant: "danger",
        },
        {
          value: 78,
          label: "Not Working",
          icon: "exclamation-circle", // Exclamation circle icon for not working
          bgVariant: "secondary",
        },
        {
          value: 78,
          label: "Ongoing Under Service",
          icon: "wrench", // Wrench icon for ongoing under service
          bgVariant: "warning",
        },
        {
          value: 78,
          label: "Water Wash",
          icon: "water", // Water icon for water wash
          bgVariant: "primary",
        },
        {
          value: 78,
          label: "Returned",
          icon: "reply", // Reply icon for returned
          bgVariant: "dark",
        },
      ],
      newBooking: 872,
      scheduledRoom: 285,
      checkIn: 53,
      checkOut: 78,
      availableRoom: 785,
      bookingStats: [
        { label: "Pending", value: 234, variant: "warning" },
        { label: "Done", value: 85, variant: "success" },
        { label: "Failed", value: 163, variant: "danger" },
      ],
      checkInBadge: 549,
      checkOutBadge: 327,
      cityId: 1,
      locality: "Indiranager",
    };
  },
  methods: {
    async getAddresses(cityId, locality) {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/daily-rentals/${cityId}/provider/addresses`,
          {
            params: {
              city: cityId,
              locality: locality,
            },

            headers: {
              Authorization: `Bearer ${localStorage.getItem("provider_token")}`, // Authorization header
            },
          }
        );

        const data = response.data;

        // Handle the response data here
        console.log(data);
      } catch (error) {
        console.error(
          "Error fetching addresses:",
          error.response?.data?.message || error.message
        );
      }
    },
  },
  mounted() {
    // Initialize Progress Chart
    new Chart(this.$refs.progressChart, {
      type: "doughnut",
      data: {
        datasets: [
          {
            data: [this.availableRoom, 215],
            backgroundColor: ["#0d6efd", "#e9ecef"],
            borderWidth: 0,
          },
        ],
      },
      options: {
        cutout: "80%",
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    });

    // Initialize Reservation Chart
    new Chart(this.$refs.reservationChart, {
      type: "line",
      data: {
        labels: [
          "Q1",
          "Q2",
          "Q3",
          "Q4",
          "Q5",
          "Q6",
          "Q7",
          "Q8",
          "Q9",
          "Q10",
          "Q11",
          "Q12",
        ],
        datasets: [
          {
            label: "Check In",
            data: [300, 400, 350, 500, 450, 400, 450, 400, 500, 450, 400, 450],
            borderColor: "#0d6efd",
            backgroundColor: "rgba(13, 110, 253, 0.1)",
            fill: true,
            tension: 0.4,
          },
          {
            label: "Check Out",
            data: [200, 300, 250, 350, 300, 350, 300, 350, 300, 350, 300, 320],
            borderColor: "#dc3545",
            backgroundColor: "rgba(220, 53, 69, 0.1)",
            fill: true,
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              display: true,
              color: "rgba(0,0,0,0.05)",
            },
          },
          x: {
            grid: {
              display: false,
            },
          },
        },
      },
    });
  },
};
</script>

<style lang="scss">
.metric-card {
  transition: transform 0.2s;
}

.metric-card:hover {
  transform: translateY(-5px);
}

.badge {
  padding: 0.5em 1em;
}

/* Custom color overrides */
.bg-primary {
  background-color: #2196f3 !important;
}

.bg-success {
  background-color: #4caf50 !important;
}

.bg-warning {
  background-color: #ff9800 !important;
}

.bg-danger {
  background-color: #f44336 !important;
}

@import "@/assets/styles/custom.scss";
</style>
