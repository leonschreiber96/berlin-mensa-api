module.exports = {
  apps: [
    {
      name: "mensa_api",
      script: "deno",
      args: "run --unstable-cron --allow-all server.ts",
      interpreter: "none", // "none" means PM2 will not try to interpret the script as node
    },
  ],
};

