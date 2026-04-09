try {
  require('./server.js');
} catch (e) {
  console.log(e.code);
  console.log(e.message);
  console.log(e.stack);
}
