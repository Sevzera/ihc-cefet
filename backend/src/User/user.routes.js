import express from "express";
import userService from "./userService.js";
import decoder from "../decoder.js";

const router = express.Router();

router.use(decoder.parseUser);

router.post("/login", async (req, res) => {
  try {
    const data = req.body;
    const result = await userService.login(data);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.log("Error in userRoutes.login: ", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const filters = req.query;
    const result = await userService.index(filters);
    res.status(200).json(result);
  } catch (error) {
    console.log("Error in userRoutes.get: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await userService.show(id);
    res.status(200).json(result);
  } catch (error) {
    console.log("Error in userRoutes.get: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const result = await userService.update(id, data);
    res.status(200).json(result);
  } catch (error) {
    console.log("Error in userRoutes.patch: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const data = req.body;
    const result = await userService.create(data);
    res.status(200).json(result);
  } catch (error) {
    console.log("Error in userRoutes.post: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await userService.delete(id);
    res.status(200).json(result);
  } catch (error) {
    console.log("Error in userRoutes.delete: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
