import app from "./app.js";

const port = process.env.PORT ?? 4242;

app.listen(port, () => {
  console.log(`Stripe helper server listening on http://localhost:${port}`);
});
