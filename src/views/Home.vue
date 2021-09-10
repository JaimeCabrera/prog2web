<template>
  <div class="home">
    <div class="container">
      {{ user }}
      <div class="row">
        <div class="col-8 mx-auto mt-3">
          <h1 class="text-center text-light">Lista de tareas por hacer</h1>
          <hr />
          <form action="" v-on:submit.prevent="addTask">
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
          </form>
          <div class="col-12">
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
      user: {},
    };
  },
  created() {
    this.verifyAuth();
  },
  mounted() {
    this.getAllTasks();
  },
  methods: {
    verifyAuth() {
      axios
        .get("http://localhost:3000/api/auth/user", {
          headers: { "x-access-token": localStorage.getItem("token") },
        })
        .then((res) => {
          // console.log(res);
          this.user = res.data;
          // if (!res) {
          //   this.$router.replace("/");
          // }
        })
        .catch((err) => {
          console.log(err);
          this.$router.replace("/");
        });
    },
    addTask() {
      axios
        .post("http://localhost:3000/tasks", this.task)
        .then((res) => {
          if (res.status == 200) {
            this.tasks.push(res.data);
            this.task = { title: "" };
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getAllTasks() {
      axios
        .get("http://localhost:3000/tasks", {
          headers: {
            "Content-type": "application/json",
          },
        })
        .then((res) => {
          console.log(res.data);
          this.tasks = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    deleteTask(task, id) {
      axios
        .delete(`http://localhost:3000/tasks/${id}`)
        .then((res) => {
          if (res.status == 200) {
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: `${task.title}, Se eliminó correctamente.`,
              showConfirmButton: false,
              timer: 1500,
            });
            this.tasks = this.tasks.filter((task) => task.id !== id);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style></style>
