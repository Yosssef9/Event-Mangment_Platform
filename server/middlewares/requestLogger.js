export default function requestLogger(req, res, next) {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;

    console.log("=== 🧾 Request Log ===");
    console.log(`Method: ${req.method}`);
    console.log(`URL: ${req.originalUrl}`);
    console.log(`Status: ${res.statusCode}`);
    console.log(`Duration: ${duration}ms`);
    console.log("Headers:", req.headers);
    console.log("Query:", req.query);
    console.log("Params:", req.params);
    console.log("Body:", req.body);
    console.log("======================\n");
  });

  next();
}
