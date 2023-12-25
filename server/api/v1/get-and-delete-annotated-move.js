const { getAnnotatedMove } = require("../../utils/getAnnotatedMove");
const express = require("express");
const router = express.Router();
const { deleteAnnotatedMove } = require("../../utils/deleteAnnotatedMove");

router.get("/api/v1/get-and-delete-annotated-move", async (req, res) => {
  const { id } = req.query;
  if (!id) {
    return res.status(400).send({ message: "ID is required" });
  }

  try {
    const result = await getAnnotatedMove(id);

    // Delete the move after sending the response
    if (result.body.annotatedMove) {
      await deleteAnnotatedMove(id);
    }
    res.status(result.status).send(result.body);
  } catch (err) {
    return res
      .status(err.status || 500)
      .send({ message: err.message || "Internal server error" });
  }
});

module.exports = router;
