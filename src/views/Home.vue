<template>
  <div class="home">
    <nav class="navbar navbar-light bg-light shadow-sm">
      <div class="container">
        <a class="navbar-brand d-flex  text-center text-primary">
          <i class="fab fa-buffer fa-2x"></i>
          <p class="mt-1 mx-2 fw-bold">Organizador de Tareas</p>
        </a>
        <div class="d-flex ">
          <span class="mt-2 mx-3 text-primary"> {{ user.username }}</span>
          <button class="btn btn-outline-secondary mt-1" @click="logout">
            Cerrar Sesion
          </button>
        </div>
      </div>
    </nav>
    <div class="container">
      <div class="row shadow-sm mt-3">
        <div class="col-4  categories d-flex flex-column">
          <form class="mt-3" @submit.prevent="addCategory">
            <div class="">
              <input
                type="text"
                v-model="category.name"
                id="name"
                class="form-control form-control-sm"
                :class="error ? `is-invalid` : ``"
                autofocus
              />
              <div v-show="error" id="name" class="invalid-feedback">
                {{ error.message }}
              </div>
              <!-- <button class="btn btn-primary" type="submit" id="button-addon1">
                Agregar Tarea
              </button> -->
            </div>
            <button
              type="submit"
              class="btn btn-secondary mx-auto mt-2 btn-sm"
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              title="Agregar Categoria"
            >
              <i class="fas fa-plus"></i>
            </button>
          </form>
          <br />
          <h6 class="mx-2 text-success">Categorias</h6>
          <div
            class="list-group  mt-1 mb-4 scroll"
            v-if="categories.length > 0"
          >
            <a
              href="#"
              v-for="(category, index) in categories"
              :key="index"
              @click="getTasks(category)"
              class="list-group-item list-group-item-action"
              >{{ category.name }}
              <button
                type="button"
                class="btn-close float-end text-black-50"
                aria-label="Close"
                @click="deleteCategory(category)"
                title="Eliminar Categoria"
              ></button>
            </a>
          </div>
          <div v-else>
            <span class="text-secondary"
              >Crea una categoria para agregar tareas</span
            >
          </div>
        </div>
        <div class="col-8 tasks">
          <a
            class="btn btn-primary float-end mt-3 btn-sm"
            data-bs-toggle="tooltip"
            data-bs-placement="top"
            title="Agregar Tarea"
          >
            <i class="fas fa-plus"></i>
          </a>
          <div class="p-2 mt-3">
            <h6 class="text-black-50">Lista de tareas</h6>
            <hr />
            <div v-if="tasks.length > 0" class="card mt-2 ">
              <ul class="list-group list-group-flush scroll">
                <li
                  v-for="(task, index) in tasks"
                  :key="index"
                  class="list-group-item"
                >
                  {{ task.name }}
                </li>
              </ul>
            </div>
            <div v-else>
              Lista vacia.
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";
export default {
  data() {
    return {
      task: { title: "" },
      tasks: [],
      categories: [],
      category: { name: "" },
      user: {},
      userId: "",
      error: "",
      token: "",
      editedCategory: null,
    };
  },
  created() {
    this.verifyAuth();
    this.getToken();
  },
  mounted() {},
  methods: {
    getToken() {
      return (this.token = localStorage.getItem("token"));
    },
    verifyAuth() {
      axios
        .get("http://localhost:3000/api/auth/user", {
          headers: { "x-access-token": localStorage.getItem("token") },
        })
        .then((res) => {
          this.user = res.data;
          this.userId = res.data.id;
          this.getAllCategories(this.userId);

          // if (!res) {
          //   this.$router.replace("/");
          // }
        })
        .catch((err) => {
          console.log(err);

          this.$router.replace("/");
        });
    },
    logout() {
      localStorage.clear();
      this.$router.replace("/");
    },
    getAllCategories(id) {
      // const userId = this.user.id;
      axios
        .get(
          "http://localhost:3000/api/categories",

          {
            data: {
              userId: id,
            },
            headers: { "x-access-token": this.token },
          }
        )
        .then((res) => {
          this.categories = res.data;
        });
    },
    addCategory() {
      this.error = "";
      axios
        .post("http://localhost:3000/api/categories", this.category, {
          headers: { "x-access-token": this.token },
          data: {
            userId: this.userId,
          },
        })
        .then((res) => {
          Swal.fire({
            position: "bottom-end",
            icon: "success",
            title: "Categoria Agregada",
            showConfirmButton: false,
            timer: 1500,
          });
          this.categories.push(res.data);
          this.category = { name: "" };
        })
        .catch((err) => {
          this.error = err.response.data;
        });
    },

    deleteCategory(category) {
      const { id } = category;
      axios
        .delete(`http://localhost:3000/api/categories/${id}`, {
          headers: { "x-access-token": this.token },
        })
        .then((res) => {
          if (res) {
            Swal.fire({
              position: "bottom-end",
              icon: "success",
              title: "Categoria Eliminada",
              showConfirmButton: false,
              timer: 1500,
            });
            this.categories = this.categories.filter((cat) => cat.id !== id);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getTasks(category) {
      // this.tasks = [];
      const { id: categoryId } = category;
      console.log("esta categoriua va", categoryId);
      axios
        .get(`http://localhost:3000/api/tasks/${categoryId}`, {
          headers: { "x-access-token": this.token },
        })
        .then((res) => {
          this.tasks = res.data.tasks;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style></style>
