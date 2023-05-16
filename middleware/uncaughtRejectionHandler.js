const unhandledRejectionHandler = (error) => {
  console.log(`Error: ${error.message}`);
  console.log(`Shutting down the server due to unhandled promise rejection`);
  process.exit(1);
};

export default unhandledRejectionHandler;
