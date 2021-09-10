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
          <form class="mt-3">
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
            <a
              class="btn btn-secondary mx-auto mt-2 btn-sm"
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              @click="addCategory"
              title="Agregar Categoria"
            >
              <i class="fas fa-plus"></i>
            </a>
          </form>

          <div
            class="list-group list-group-flush  mt-4"
            v-if="categories.length > 0"
          >
            <a
              href="#"
              v-for="(category, index) in categories"
              :key="index"
              class="list-group-item list-group-item-action"
              >{{ category.name }}</a
            >
          </div>
          <div v-else>
            <span class="text-secondary"
              >Crea una categoria para agregar tareas</span
            >
          </div>
          <!-- <h1 class="text-center text-light">Lista de tareas por hacer</h1>
          <hr /> -->

          <!-- <form action="" v-on:submit.prevent="addTask">
            <div class="input-group mb-3">
              <input
                type="text"
                v-model="task.title"
                class="form-control"
                placeholder="Escribe el nombre de la tarea"
                aria-label="Example text with button addon"
                aria-describedby="button-addon1"
                autofocus
              />
              <button class="btn btn-primary" type="submit" id="button-addon1">
                Agregar Tarea
              </button>
            </div>
          </form> -->
          <!-- <div class="col-12">
            <ul>
              <li class="task" v-for="(task, index) in tasks" :key="index">
                <div class="">
                  <input
                    class="form-check-input task-id"
                    type="checkbox"
                    id="checkboxNoLabel"
                    value=""
                    aria-label=""
                  />
                </div>
                <p class="task-title">{{ task.title }}</p>
                <a
                  v-on:click="deleteTask(task, task.id)"
                  class="nav-link float-left text-danger"
                  >Eliminar</a
                >
              </li>
            </ul>
          </div> -->
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
            <div class="card mt-2">
              <ul class="list-group list-group-flush">
                <li class="list-group-item">An item</li>
                <li class="list-group-item">A second item</li>
                <li class="list-group-item">A third item</li>
              </ul>
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
      categories: [],
      category: { name: "" },
      user: {},
      userId: "",
      error: "",
      token: "",
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
      console.log(id);
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
    // addTask() {
    //   axios
    //     .post("http://localhost:3000/tasks", this.task)
    //     .then((res) => {
    //       if (res.status == 200) {
    //         this.tasks.push(res.data);
    //         this.task = { title: "" };
    //       }
    //     })
    //     .catch((err) => {
    //       console.log(err);
    //     });
    // },
    // getAllTasks() {
    //   axios
    //     .get("http://localhost:3000/tasks", {
    //       headers: {
    //         "Content-type": "application/json",
    //       },
    //     })
    //     .then((res) => {
    //       console.log(res.data);
    //       this.tasks = res.data;
    //     })
    //     .catch((err) => {
    //       console.log(err);
    //     });
    // },
    // deleteTask(task, id) {
    //   axios
    //     .delete(`http://localhost:3000/tasks/${id}`)
    //     .then((res) => {
    //       if (res.status == 200) {
    //         Swal.fire({
    //           position: "top-end",
    //           icon: "success",
    //           title: `${task.title}, Se eliminó correctamente.`,
    //           showConfirmButton: false,
    //           timer: 1500,
    //         });
    //         this.tasks = this.tasks.filter((task) => task.id !== id);
    //       }
    //     })
    //     .catch((err) => {
    //       console.log(err);
    //     });
    // },
  },
};
</script>

<style></style>
