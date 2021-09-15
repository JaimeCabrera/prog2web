<template>
  <div class="container">
    <nav class="nav justify-content-end bg-light mt-3 ">
      <router-link class="btn btn-outline-success" to="/register"
        >Registrarme</router-link
      >
    </nav>
    <div class="row login mt-5">
      <div class="col-md-4 mx-auto card shadow">
        <div class="login-form bg-light mt-3 p-4">
          <form action="" @submit.prevent="handleLogin" class="row g-3">
            <h5 class="text-center">Welcome Back</h5>
            <div class="alert alert-danger" role="alert" v-if="error">
              {{ error.message }}
            </div>
            <div class="col-12">
              <label>Correo:</label>
              <input
                type="text"
                name="username"
                v-model="user.email"
                class="form-control"
                placeholder="email@mail.com"
              />
            </div>
            <div class="col-12">
              <label>Contraseña:</label>
              <input
                type="password"
                name="password"
                v-model="user.password"
                class="form-control"
                placeholder="********"
              />
            </div>

            <div class="col-12  mt-5">
              <button type="submit" class="col-12 btn btn-primary btn-block">
                Login
              </button>
            </div>
          </form>
          <hr class="mt-4" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";
const API_URL = "https://apiprog2.herokuapp.com";
export default {
  data() {
    return {
      user: { email: "user@user.com", password: "" },
      error: "",
    };
  },
  mounted() {
    this.verifyAuth();
  },
  methods: {
    verifyAuth() {
      axios
        .get(`${API_URL}/api/auth/user`, {
          headers: { "x-access-token": localStorage.getItem("token") },
        })
        .then(() => {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Usuario incorrecto, inicia sesion ",
            showConfirmButton: true,
            // timer: 1500,
          }).then((result) => {
            if (result.isConfirmed) {
              localStorage.clear();
              this.$router.replace("/");
            }
          });
        })
        .catch(() => {
          // this.$router.push("/");
        });
    },
    handleLogin() {
      this.error = "";
      axios
        .post(`${API_URL}/api/auth/signin`, this.user)
        .then((res) => {
          if (res.status == 200) {
            localStorage.setItem("token", res.data.accessToken);
            this.$router.replace("/home");
          }
        })
        .catch((err) => {
          this.error = err.response.data;
        });
    },
  },
};
</script>
