const express = require("express");
const router = express.Router();
const { startMoveAnnotation } = require("../../utils/startMoveAnnotation");

router.post("/api/v1/create-move-annotation-task", async (req, res) => {
  const { move } = req.body;

  try {
    const id = await startMoveAnnotation(move);
    res.status(201).send({
      message: "Move code received and start processing",
      id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

module.exports = router;
