<template>
  <div class="container-fluid login-container">
    <div class="row login">
      <div class="col-md-4 mx-auto">
        <div class="login-form bg-light mt-4 p-4">
          <form action="" method="" class="row g-3">
            <h5 class="text-center">Welcome Back</h5>
            <div class="col-12">
              <label>Username</label>
              <input
                type="text"
                name="username"
                class="form-control"
                placeholder="Username"
              />
            </div>
            <div class="col-12">
              <label>Password</label>
              <input
                type="password"
                name="password"
                class="form-control"
                placeholder="********"
              />
            </div>

            <div class="col-12  mt-5">
              <a
                v-on:click="handleLogin"
                type="submit"
                class="col-12 btn btn-primary btn-block"
              >
                Login
              </a>
            </div>
          </form>
          <hr class="mt-4" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    handleLogin(e) {
      e.preventDefault();
      console.log("login");
      console.log(this.$router.push("/home"));
    },
  },
};
</script>
