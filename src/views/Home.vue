<template>
  <div class="home">
    <nav class="navbar navbar-light bg-light shadow-sm">
      <div class="container">
        <router-link
          to="/home"
          @click.native="categoryId = ''"
          class="navbar-brand d-flex  text-center text-black-50"
        >
          <i class="fab fa-buffer fa-2x"></i>
          <p class="mt-1 mx-2 ">Organizador de Tareas</p>
        </router-link>
        <div class="d-flex justify-content-center">
          <span class="text-black align-self-center"> {{ user.email }}</span>
          <a class="btn fw-bold " @click="logout">
            Cerrar Sesion <i class="fas fa-sign-out-alt"></i>
          </a>
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
                autocomplete="off"
              />
              <small id="helpId" class="text-muted">Escribe la categoria</small>

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
            class="list-group  mt-1 mb-4 scroll-categories"
            v-if="categories.length > 0"
          >
            <router-link
              :to="{
                name: 'category-details',
                params: { name: category.name },
              }"
              v-for="(category, index) in categories"
              :key="index"
              @click.native="getTasks(category)"
              class="list-group-item list-group-item-action"
              >{{ category.name }}
              <button
                type="button"
                class="btn-close float-end text-black-50"
                aria-label="Close"
                @click="deleteCategory(category)"
                title="Eliminar Categoria"
              ></button>
            </router-link>
          </div>
          <div v-else>
            <span class="text-secondary"
              >Crea una categoria para agregar tareas</span
            >
          </div>
        </div>
        <div v-if="categoryId" class="col-8 tasks">
          <a
            class="btn btn-outline-primary float-end mt-3 btn-sm"
            data-bs-toggle="tooltip"
            data-bs-placement="top"
            @click="showModal = true"
            title="Agregar Tarea"
          >
            <i class="fas fa-plus"></i>
          </a>
          <div class="p-2 mt-3">
            <h6 class="text-black-50">
              Lista de tareas:
              <span class="fw-bold text-primary">{{
                this.$route.params.name
              }}</span>
            </h6>
            <hr />
            <div v-if="tasks.length > 0" class="mt-2 ">
              <div class="scroll-tasks ">
                <div
                  v-for="(task, index) in tasks"
                  :key="index"
                  class="card border-0  mt-2 mx-2 "
                >
                  <!-- :TODO: check properties change to status -->
                  <!-- if task sttaus is pendind -->
                  <div
                    v-if="task.status == 0"
                    class="card-body  border-start border-success border-3"
                  >
                    {{ task.name }}
                    <!-- <span class="float-end"
                      >Creado hace:{{ task.createdAt }}</span
                    > -->

                    <a
                      @click.prevent="deleteTask(task)"
                      class="float-end text-black-50 mx-3"
                      href=""
                      data-toggle="tooltip"
                      data-placement="top"
                      title="Eliminar"
                    >
                      <i class="fas fa-trash-alt"></i>
                    </a>
                    <a
                      href=""
                      @click.prevent="taskCompleted(task)"
                      class="float-end text-primary"
                      data-toggle="tooltip"
                      data-placement="top"
                      title="Marcar como completada"
                    >
                      <i class="fas fa-check"></i>
                    </a>
                    <a
                      href=""
                      @click.prevent="editTask(task)"
                      class="float-end text-success mx-3"
                      data-toggle="tooltip"
                      data-placement="top"
                      title="Editar Tarea"
                    >
                      <i class="fas fa-edit"></i>
                    </a>
                  </div>
                  <!-- else if task is completed -->
                  <div
                    v-else
                    class="card-body  border-start border-danger border-3 text-decoration-line-throught"
                  >
                    <s>{{ task.name }}</s>
                    <a
                      @click.prevent="deleteTask(task)"
                      class="float-end text-black-50 mx-3"
                      href=""
                      data-toggle="tooltip"
                      data-placement="top"
                      title="Eliminar"
                    >
                      <i class="fas fa-trash-alt"></i>
                    </a>
                    <!-- <a class="float-end text-success" href="">
                      <i class="fas fa-check-double"></i>
                    </a> -->
                  </div>
                </div>
              </div>
            </div>
            <div v-else>
              <div class="alert alert-secondary" role="alert">
                Lista vacia!
              </div>
            </div>
          </div>
        </div>
        <div
          v-else
          class="col-8 d-flex justify-content-center align-content-center align-self-center"
        >
          <h3 class="text-black-50">Organizador de tareas</h3>
        </div>
      </div>
    </div>
    <!-- modal to add tasks -->

    <div v-if="showModal">
      <transition name="modal">
        <div class="modal-mask">
          <div class="modal-wrapper">
            <div class="modal-dialog" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 v-if="edit" class="modal-title text-black-50">
                    Editando la tarea {{ task.name }}
                  </h5>
                  <h5 class="modal-title text-black-50" v-else>
                    Agregar Tarea
                  </h5>
                  <button
                    v-if="edit"
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="modal"
                    @click="
                      () => {
                        showModal = false;
                        edit = false;
                      }
                    "
                    aria-label="Close"
                  ></button>
                  <button
                    v-else
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="modal"
                    @click="
                      () => {
                        showModal = false;
                      }
                    "
                    aria-label="Close"
                  ></button>
                </div>
                <form action="">
                  <div class="modal-body">
                    <div class="form-group">
                      <input
                        type="text"
                        name=""
                        v-model="task.name"
                        class="form-control"
                        placeholder="Escribe el nombre de la tarea"
                        aria-describedby="helpId"
                      />
                    </div>
                    <div class="form-group mt-3">
                      <select
                        class="form-select"
                        v-model="task.priority"
                        aria-label="Default select example"
                      >
                        <option selected disabled
                          >Selecciona la prioridad</option
                        >
                        <option value="1">Alta</option>
                        <option value="2">Media</option>
                        <option value="3">Baja</option>
                      </select>
                    </div>
                  </div>
                  <div class="modal-footer mt-4">
                    <!-- if click edit task -->
                    <div v-if="edit">
                      <button
                        type="button"
                        class="btn btn-outline-secondary mx-3"
                        @click="cancelEdit"
                      >
                        Cancelar
                      </button>
                      <button
                        type="button"
                        @click="updateTask"
                        class="btn btn-primary"
                      >
                        Guardar Cambios
                      </button>
                    </div>
                    <!-- else click on new task -->
                    <div v-else>
                      <button
                        type="button"
                        class="btn btn-outline-secondary mx-3"
                        @click="showModal = false"
                      >
                        Cancelar
                      </button>
                      <button
                        type="button"
                        @click="createTask()"
                        class="btn btn-success"
                      >
                        Agregar Tarea
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";
export default {
  data() {
    return {
      task: { name: "", priority: "" },
      tasks: [],
      categories: [],
      category: { name: "" },
      user: {},
      userId: "",
      error: "",
      token: "",
      categoryId: "",
      showModal: false,
      edit: false,
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
      this.edit = false;
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
    // FIXME: check change route to delete category
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
      const { id } = category;
      this.categoryId = id;
      axios
        .get(`http://localhost:3000/api/tasks/${id}`, {
          headers: { "x-access-token": this.token },
        })
        .then((res) => {
          this.tasks = res.data.tasks;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    createTask() {
      const data = { ...this.task, categoryId: this.categoryId };
      axios
        .post(`http://localhost:3000/api/tasks`, data, {
          headers: { "x-access-token": this.token },
        })
        .then((res) => {
          this.tasks.push(res.data.task);
          this.showModal = false;
          this.task = { name: "", priority: "", id: "" };
        })
        .catch((err) => {
          console.log(err);
        });
    },
    updateTask() {
      const data = this.task;
      axios
        .put(`http://localhost:3000/api/tasks/${this.task.id}`, data, {
          headers: { "x-access-token": this.token },
        })
        .then((res) => {
          if (res.status == 200) {
            this.tasks = this.tasks.map((item) => {
              if (item.id === this.task.id) {
                return this.task;
              }
              return item;
            });
            this.task = { name: "", priority: "", id: "" };
            this.edit = false;
            this.showModal = false;
          }
        });
    },
    taskCompleted(task) {
      // const { id: taskId } = task;
      const data = { id: task.id, status: task.status };
      axios
        .put("http://localhost:3000/api/tasks/task", data, {
          headers: { "x-access-token": this.token },
        })
        .then((res) => {
          if (res.status == 200) {
            Swal.fire({
              position: "bottom-end",
              icon: "success",
              title: `${res.data.message}`,
              showConfirmButton: false,
              timer: 1500,
            });
            this.tasks = this.tasks.map((item) => {
              if (item.id === task.id) {
                return { ...item, status: 1 };
              }
              return item;
            });
          } else {
            Swal.fire({
              position: "bottom-end",
              icon: "error",
              title: `${res.data.message}`,
              showConfirmButton: false,
              timer: 1500,
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
      // update tasks.status
    },
    deleteTask(task) {
      const { id } = task;
      axios
        .delete(`http://localhost:3000/api/tasks/${id}`, {
          headers: { "x-access-token": this.token },
        })
        .then((res) => {
          if (res.status == 200) {
            Swal.fire({
              position: "bottom-end",
              icon: "success",
              title: `${res.data.message}`,
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
    editTask(task) {
      this.showModal = true;
      this.edit = true;
      this.task = task;
    },
    cancelEdit() {
      this.showModal = false;
      this.task = { name: "", priority: "" };
    },
  },
};
</script>

<style>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: top;
}
</style>
