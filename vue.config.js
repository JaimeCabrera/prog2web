module.exports = {
  // publicPath: "/prog2web/",
  publicPath: process.env.NODE_ENV === "production" ? "/" : "/",
};
