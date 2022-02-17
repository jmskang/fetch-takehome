const app = require('./app');
const PORT = 3000;

const init = async () => {
  try {
    app.listen(PORT, () => console.log(`server is listening for requests on port: ${PORT}`));
  } catch (err) {
    console.log(err);
  }
};

init();
