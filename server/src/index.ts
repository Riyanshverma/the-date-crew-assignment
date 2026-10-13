import { app } from "./app.js";

const port = Number(process.env.PORT ?? 3001);

app.listen(port, () => {
  console.info(`TDC Matchmaker API listening on http://localhost:${port}`);
});
