<template>
  <div class="home">
    <div class="container">
      <div class="row">
        <div class="col-8 mx-auto mt-5">
          <h4 class="text-center">Lista de tareas por hacer</h4>
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
              <button class="btn btn-success" type="submit" id="button-addon1">
                Agregar
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
                <a v-on:click="deleteTask(task.id)" class="nav-link float-left"
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
export default {
  data() {
    return {
      task: { title: "" },
      tasks: [],
    };
  },
  mounted() {
    this.getAllTasks();
  },
  methods: {
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
          this.tasks = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    deleteTask(id) {
      axios
        .delete(`http://localhost:3000/tasks/${id}`)
        .then((res) => {
          if (res.status == 200) {
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
