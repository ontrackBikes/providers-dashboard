import Vue from "vue";
import Router from "vue-router";
import LoginPage from "./views/LoginPage.vue";
import HomePage from "./views/HomePage.vue";
import BookingsPage from "./views/BookingsPage.vue";
import VehiclesPage from "./views/VehiclesPage.vue";
import ProfilePage from "./views/ProfilePage.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  routes: [
    { path: "/", beforeEnter: guardMyroute, name: "Home", component: HomePage },
    {
      path: "/login",
      beforeEnter: guardMyroute,
      name: "Login",
      component: LoginPage,
      meta: { hideNavbar: true },
    },
    { path: "/profile", name: "ProfilePage", component: ProfilePage },
    { path: "/bookings", name: "Bookings", component: BookingsPage },
    { path: "/vehicles", name: "Vehicles", component: VehiclesPage },
  ],
});

function guardMyroute(to, from, next) {
  const isAuthenticated = !!localStorage.getItem("provider_token");

  if (to.name === "Login" || to.name === "Login Token") {
    if (isAuthenticated) {
      next("/"); // redirect to home if authenticated
    } else {
      next(); // allow to access login page
    }
  } else {
    if (isAuthenticated) {
      next(); // allow to enter the route
    } else {
      next("/login"); // redirect to login if not authenticated
    }
  }
}
