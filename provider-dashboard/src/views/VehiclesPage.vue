<template>
  <div>
    <b-container>
      <div v-if="loading" class="text-center my-4">
        <b-spinner label="Loading..." variant="primary"></b-spinner>
      </div>

      <div v-if="error" class="alert alert-danger" role="alert">
        {{ error }}
      </div>

      <h4 class="my-4">Vehicles</h4>

      <b-row>
        <!-- Filter Section -->
        <b-col md="3">
          <div class="border p-3 rounded mb-4 d-none d-md-block">
            <div class="d-flex justify-content-between align-items-center">
              <h6 class="mb-2">MODELS</h6>
              <a
                href="#"
                @click.prevent="clearModelFilter"
                class="text-primary"
              >
                CLEAR ALL
              </a>
            </div>
            <hr />
            <div>
              <b-form-group>
                <b-form-checkbox-group
                  v-model="selectedModels"
                  :options="modelOptions"
                  stacked
                ></b-form-checkbox-group>
              </b-form-group>
            </div>
          </div>
        </b-col>

        <!-- Vehicles Section -->
        <b-col md="6">
          <div class="d-flex justify-content-between align-items-center">
            <p>{{ vehicles.length }} vehicles found</p>
            <b-button
              v-b-toggle.filter
              class="d-md-none"
              variant="outline-primary"
              >Filter</b-button
            >
          </div>
          <div v-if="vehicles.length">
            <b-card
              v-for="(vehicle, index) in vehicles"
              :key="index"
              class="my-2"
            >
              <b-row class="align-items-center">
                <!-- Image on the left -->
                <b-col md="2">
                  <b-img
                    :src="vehicle.model.image300"
                    fluid
                    alt="Vehicle Image"
                  ></b-img>
                </b-col>

                <!-- Text on the right -->
                <b-col md="10">
                  <div>
                    <h6>{{ vehicle.registrationNumber }}</h6>
                    <h6>{{ vehicle.model.name }}</h6>
                    <b-badge :variant="vehicle.statusDetails.bgColor">
                      {{ vehicle.statusDetails.name }}
                    </b-badge>
                    <hr />
                    <p>{{ formatDate(vehicle.updatedAt) }}</p>
                  </div>
                </b-col>
              </b-row>
            </b-card>
          </div>

          <div v-else class="text-center">
            <p>No vehicles available.</p>
          </div>
        </b-col>
        <b-col md="3" class="d-none d-md-block">
          <!-- Filter Section -->
          <div class="border p-3 rounded mb-4">
            <div class="d-flex justify-content-between align-items-center">
              <h6 class="mb-2">STATUS</h6>
              <a
                href="#"
                @click.prevent="clearStatusFilter"
                class="text-primary"
              >
                CLEAR ALL
              </a>
            </div>
            <hr />
            <b-form-group style="margin-bottom: 30px">
              <b-form-checkbox-group
                v-model="selectedStatuses"
                :options="vehicleStatuses"
                stacked
              ></b-form-checkbox-group>
            </b-form-group>
          </div>
        </b-col>
      </b-row>

      <div>
        <b-sidebar id="filter" title="Filters" shadow>
          <div class="px-3 py-2">
            <div class="d-flex justify-content-between align-items-center">
              <h6 class="mb-2">MODELS</h6>
              <a
                href="#"
                @click.prevent="clearModelFilter"
                class="text-primary"
              >
                CLEAR ALL
              </a>
            </div>
            <hr />
            <div>
              <b-form-group>
                <b-form-checkbox-group
                  v-model="selectedModels"
                  :options="modelOptions"
                  stacked
                ></b-form-checkbox-group>
              </b-form-group>
            </div>
          </div>
          <div class="border p-3 rounded mb-4">
            <div class="d-flex justify-content-between align-items-center">
              <h6 class="mb-2">STATUS</h6>
              <a
                href="#"
                @click.prevent="clearStatusFilter"
                class="text-primary"
              >
                CLEAR ALL
              </a>
            </div>
            <hr />
            <b-form-group style="margin-bottom: 30px">
              <b-form-checkbox-group
                v-model="selectedStatuses"
                :options="vehicleStatuses"
                stacked
              ></b-form-checkbox-group>
            </b-form-group>
          </div>
        </b-sidebar>
      </div>
    </b-container>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      vehicles: [],
      allVehicles: [],
      loading: false,
      error: null,
      modelOptions: [],
      selectedModels: [],
      selectedStatuses: [],
      vehicleStatuses: [
        { id: "available", value: 0, text: "Available" },
        { id: "booked", value: 1, text: "Booked" },
        { id: "under-service", value: 2, text: "Under Service" },
        { id: "not-working", value: 3, text: "Not Working" },
        { id: "ongoing-service", value: 4, text: "Ongoing Service" },
        { id: "water-wash", value: 5, text: "Water Wash" },
        { id: "returned", value: 6, text: "Returned" },
      ],
    };
  },
  mounted() {
    this.fetchModelsData();
    this.fetchVehiclesData();
    this.initializeFiltersFromQuery();
  },
  watch: {
    selectedModels() {
      this.filterVehicles();
      this.updateQueryParams();
    },
    selectedStatuses() {
      this.filterVehicles();
      this.updateQueryParams();
    },
  },
  methods: {
    async fetchModelsData() {
      const providerToken = localStorage.getItem("provider_token");
      if (!providerToken) {
        this.error = "Provider token not found";
        return;
      }

      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get(
          `http://localhost:3000/api/daily-rentals/provider/models`,
          {
            params: { statusDetails: this.selectedStatuses },
            headers: {
              Authorization: providerToken,
            },
          }
        );
        this.modelOptions = response.data.models.map((x) => ({
          text: x.model.name,
          value: x.model._id,
        }));
      } catch (err) {
        this.error = "Failed to fetch models";
      } finally {
        this.loading = false;
      }
    },
    async fetchVehiclesData() {
      const providerToken = localStorage.getItem("provider_token");
      if (!providerToken) {
        this.error = "Provider token not found";
        return;
      }

      this.loading = true;
      this.error = null;

      try {
        const response = await axios.get(
          `http://localhost:3000/api/daily-rentals/provider/fleet`,
          {
            headers: {
              Authorization: providerToken,
            },
          }
        );

        this.allVehicles = response.data.vehicles;
        this.vehicles = this.allVehicles;
      } catch (err) {
        this.error = "Failed to fetch vehicles";
      } finally {
        this.loading = false;
      }
    },
    filterVehicles() {
      this.vehicles = this.allVehicles.filter((vehicle) => {
        const matchesModel =
          this.selectedModels.length === 0 ||
          this.selectedModels.includes(vehicle.model._id);

        const matchesStatus =
          this.selectedStatuses.length === 0 ||
          this.selectedStatuses.includes(vehicle.statusDetails.status);

        return matchesModel && matchesStatus;
      });
    },
    updateQueryParams() {
      const query = {
        models: this.selectedModels.join(","),
        statuses: this.selectedStatuses.join(","),
      };

      const currentQuery = this.$route.query;
      if (
        currentQuery.models !== query.models ||
        currentQuery.statuses !== query.statuses
      ) {
        this.$router.replace({ query });
      }
    },
    initializeFiltersFromQuery() {
      const { models, statuses } = this.$route.query;

      this.selectedModels = models ? models.split(",") : [];
      this.selectedStatuses = statuses ? statuses.split(",") : [];
    },
    formatDate(date) {
      return new Date(date).toLocaleString();
    },
    clearModelFilter() {
      this.selectedModels = [];
      this.filterVehicles();
    },
    clearStatusFilter() {
      this.selectedes = [];
      this.filterVehicles();
    },
  },
};
</script>
