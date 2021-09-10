<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-6 mx-auto">
        <div class="card shadow">
          <div class="card-header bg-light">
            Registro de usuarios
          </div>
          <div class="card-body mt-3 ">
            <form class="row g-3" v-on:submit.prevent="addUser">
              <div v-if="error" class="alert alert-warning">
                {{ error.message }}
              </div>
              <div class="col-12">
                <label>Nombre de usuario:</label>
                <input
                  type="text"
                  name="username"
                  v-model="user.username"
                  class="form-control"
                  placeholder="Juan"
                />
              </div>
              <div class="col-12">
                <label>Correo:</label>
                <input
                  type="email"
                  name="email"
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
                <button type="submit" class="col-12 btn btn-success btn-block">
                  Registrarme
                </button>
              </div>
              <p>Ya tienes cuenta?, <router-link to="/">Entrar</router-link></p>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      user: { username: "", email: "", password: "" },
      error: "",
    };
  },
  methods: {
    addUser() {
      this.error = "";
      axios
        .post("http://localhost:3000/api/auth/signup", this.user)
        .then((res) => {
          if (res.status == 200) {
            this.$router.push("/");
          }
        })
        .catch((err) => {
          this.error = err.response.data;
        });
    },
  },
};
</script>

<style></style>
