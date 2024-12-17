module.exports = {
  apps: [
    {
      name: "mensa_api",
      script: "deno",
      args: "run --unstable-cron --allow-env --allow-read --allow-net --allow-write server.ts",
      interpreter: "none", // "none" means PM2 will not try to interpret the script as node
    },
  ],
};

