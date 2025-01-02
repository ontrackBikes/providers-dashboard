<template>
  <b-container class="mt-5">
    <b-card title="Vehicle Management">
      <b-table :items="vehicles" :fields="fields"></b-table>
    </b-card>
  </b-container>
</template>

<script>
export default {
  name: "VehiclesPage",
  data() {
    return {
      fields: ["id", "type", "model", "availability"],
      vehicles: [
        {
          id: 1,
          type: "Car",
          model: "Toyota Corolla",
          availability: "Available",
        },
        { id: 2, type: "Bike", model: "Honda CB500X", availability: "Rented" },
      ],
    };
  },
};
</script>
