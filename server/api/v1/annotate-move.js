const express = require("express");
const router = express.Router();
const { getAnnotatedMove } = require("../../utils/getAnnotatedMove");

const fetch = require("node-fetch");

const { startMoveAnnotation } = require("../../utils/startMoveAnnotation");
const { deleteAnnotatedMove } = require("../../utils/deleteAnnotatedMove");
router.post("/api/v1/annotate-move", async (req, res) => {
  const { move } = req.body;
  try {
    const id = await startMoveAnnotation(move);

    while (true) {
      const result = await getAnnotatedMove(id);
      if (result.status === 200) {
        result.body.message = "Move Annotateion Complete";
        res.status(result.status).send(result.body);
        await deleteAnnotatedMove(id);
        break;
      } else if (result.status !== 204) {
        throw new Error(result.body || "Error fetching annotated move");
      }
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
  } catch (err) {
    res.status(500).send({ message: err.message || "Internal server error" });
  }
});
module.exports = router;
