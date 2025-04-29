import React, { useImperativeHandle, forwardRef } from "react";
import API_URL from "../../config";
import { Link, useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const AI_Integration = forwardRef(
  ({ userInput, systemPrompt, type, id, onResponse }, ref) => {
    const { username } = useParams();
    const token = localStorage.getItem("token");
    const us = JSON.parse(localStorage.getItem("user"));

    let userName;

    if (token) {
      const decodedToken = jwtDecode(token);
    }
    if (us && us.username) {
      userName = us.username;
    }
    const handleAIRequest = async () => {
      const prompt = `${systemPrompt}\n\n${userInput}`;

      try {
        if (type === "text") {
          const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.REACT_APP_GOOGLE_API_KEY}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                contents: [{ role: "user", parts: [{ text: prompt }] }],
              }),
            }
          );

          const result = await response.json();
          const aiResponse =
            result?.candidates?.[0]?.content?.parts?.[0]?.text ||
            "No response.";

          onResponse({ id, output: aiResponse, raw: result, prompt });
        }

        if (type === "image") {
          const response = await axios.post(
            `${API_URL}/api/v1/ai_image/generate`,
            {
              prompt,
            }
          );

          const result = response.data;
          const base64Image = result?.image || "";

          onResponse({
            id,
            output: `data:image/png;base64,${base64Image}`,
            raw: result,
            prompt,
          });
        }
      } catch (err) {
        console.error("AI error:", err);
        onResponse({
          id,
          output: "Error processing AI response.",
          raw: err,
          prompt,
        });
      }
    };

    useImperativeHandle(ref, () => ({
      triggerAI: handleAIRequest,
    }));

    return null;
  }
);

export default AI_Integration;
