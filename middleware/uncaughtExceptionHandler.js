const uncaughtExceptionHandler = (error, server) => {
  console.log(`Error: ${error.message}`);
  console.log(`Shutting down the server due to uncaught exception`);
  server.close(() => {
    process.exit(1);
  });
};

export default uncaughtExceptionHandler;
