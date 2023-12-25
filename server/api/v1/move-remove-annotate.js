const express = require("express");
const router = express.Router();
const db = require("../../db/dbConfig");
const processCodeToRemoveTypeAnnotation = require("../../utils/processCodeToRemoveTypeAnnotation");

router.post("/api/v1/move-remove-annotate", (req, res) => {
  const { move } = req.body;
  processed_move = processCodeToRemoveTypeAnnotation(move);
  // 告知客戶端操作成功
  res.status(200).send({
    message: "Move code received and remove annotation successfully",
    move: processed_move,
  });
});

module.exports = router;
