const express = require("express");
const { SiweMessage } = require("siwe");

const router = express.Router();

router.post("/auth/verify", async (req, res) => {
  try {
    const { message, signature } = req.body;

    const siweMessage = new SiweMessage(message);
    const fields = await siweMessage.validate(signature);

    // Implement your logic here (e.g., create a user session)
    req.session.address = fields.address;

    return res.json({ ok: true });
  } catch (error) {
    console.error("SIWE verification failed", error.message);
    return res.status(400).json({ error: "Invalid signature" });
  }
});

module.exports = router;
