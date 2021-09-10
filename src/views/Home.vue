<template>
  <div class="home">
    <nav class="navbar navbar-light bg-light shadow-sm">
      <div class="container">
        <a class="navbar-brand d-flex  text-center text-black-50">
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
          <a
            class="btn btn-secondary mx-auto mt-3"
            data-bs-toggle="tooltip"
            data-bs-placement="top"
            title="Agregar Categoria"
          >
            <i class="fas fa-plus"></i>
          </a>
          <br />
          <br />
          <div class="list-group" v-if="categories">
            <a
              href="#"
              class="list-group-item list-group-item-action "
              aria-current="true"
            >
              The current link item
            </a>
            <a href="#" class="list-group-item list-group-item-action"
              >A second link item</a
            >
            <a href="#" class="list-group-item list-group-item-action"
              >A third link item</a
            >
            <a href="#" class="list-group-item list-group-item-action"
              >A fourth link item</a
            >
            <a
              href="#"
              class="list-group-item list-group-item-action disabled"
              tabindex="-1"
              aria-disabled="true"
              >A disabled link item</a
            >
          </div>
          <div v-else>
            <span class="text-secondary"
              >Aun no tienes ninguna categoria, por favor crea una</span
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
            class="btn btn-outline-primary float-end mt-3"
            data-bs-toggle="tooltip"
            data-bs-placement="top"
            title="Agregar Tarea"
          >
            <i class="fas fa-plus"></i>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
// import Swal from "sweetalert2";
export default {
  data() {
    return {
      task: { title: "" },
      categories: [],
      user: {},
      userId: "",
    };
  },
  created() {
    this.verifyAuth();
  },
  mounted() {},
  methods: {
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
        .get(`http://localhost:3000/api/categories/all/${id}`, {
          headers: { "x-access-token": localStorage.getItem("token") },
        })
        .then((res) => {
          console.log(res);
          this.categories = res.data;
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
