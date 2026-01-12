import express from "express";
const app = express();
app.use(express.json());

// endpoint de teste
app.get("/instance/list", (req, res) => {
  res.json({ ok: true, message: "API Evolution placeholder funcionando!" });
});

app.listen(process.env.PORT || 8080, () =>
  console.log("Servidor online na porta", process.env.PORT || 8080)
);
