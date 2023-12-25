const { getAnnotatedMove } = require("../../utils/getAnnotatedMove");
const express = require("express");
const router = express.Router();

router.get("/api/v1/get-annotated-move", async (req, res) => {
  const { id } = req.query;
  if (!id) {
    return res.status(400).send({ message: "ID is required" });
  }

  try {
    const result = await getAnnotatedMove(id);
    res.status(result.status).send(result);
  } catch (err) {
    res.status(500).send({ message: err.message || "Internal server error" });
  }
});

module.exports = router;
