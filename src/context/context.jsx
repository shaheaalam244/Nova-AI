/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import formatContentToHTML from "../utils/html-formatter";

export const Context = createContext();

const apiKey =
    (typeof import.meta !== "undefined" && import.meta.env?.VITE_GEMINI_API_KEY) ||
    (typeof import.meta !== "undefined" && import.meta.env?.GEMINI_API_KEY) ||
    (typeof process !== "undefined" && process.env?.VITE_GEMINI_API_KEY) ||
    (typeof process !== "undefined" && process.env?.GEMINI_API_KEY) ||
    "";

const genAI = new GoogleGenerativeAI(apiKey);

const systemInstruction =
    "NOVA AI (Natural Optimized Virtual Assistant) was created by Shahe Aalam.";

// Direct Gemini AI query execution (frontend-integrated, no separate backend needed)
export const run = async (prompt) => {
    try {
        if (!apiKey) {
            throw new Error("Gemini API key is not configured. Please add VITE_GEMINI_API_KEY to your .env file.");
        }

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            systemInstruction,
        });

        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (err) {
        console.warn("Primary model error, attempting fallback...", err);
        try {
            const fallbackModel = genAI.getGenerativeModel({
                model: "gemini-3.8-flash",
                systemInstruction,
            });
            const result = await fallbackModel.generateContent(prompt);
            return result.response.text();
        } catch (fallbackErr) {
            console.error("Gemini processing error:", fallbackErr);
            return `Error: ${fallbackErr.message || err.message || "Failed to generate response"}`;
        }
    }
};

const ContextProvider = (props) => {
    const [input, setInput] = useState("");
    const [recentPrompt, setRecentPrompt] = useState("");
    const [previousPrompts, setPreviousPrompts] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState("");
    const [formattedResultData, setFormattedResultData] = useState("");

    const wordToWordWriter = (index, nextWord) => {
        setTimeout(() => {
            setFormattedResultData(prev => prev + nextWord);
        }, 50 * index);
    };

    const newChat = () => {
        setLoading(false);
        setShowResult(false);
    };

    const onSent = async (prompt) => {
        setResultData("");
        setFormattedResultData("");
        setLoading(true);
        setShowResult(true);

        let response;
        if (prompt !== undefined) {
            setRecentPrompt(prompt);
            setPreviousPrompts(prev => prev.includes(prompt) ? prev : [...prev, prompt]);
            response = await run(prompt);
        } else {
            if (!input.trim()) return;
            const currentInput = input;
            setPreviousPrompts(prev => [...prev, currentInput]);
            setRecentPrompt(currentInput);
            setInput("");
            response = await run(currentInput);
        }

        const formattedResponse = formatContentToHTML(response);
        setResultData(formattedResponse);
        setLoading(false);
        setInput("");
    };

    useEffect(() => {
        if (!resultData) return;
        const words = resultData.split(" ");
        words.forEach((word, index) => {
            wordToWordWriter(index, word + " ");
        });
    }, [resultData]);

    return (
        <Context.Provider
            value={{
                previousPrompts,
                setPreviousPrompts,
                onSent,
                setRecentPrompt,
                recentPrompt,
                showResult,
                loading,
                formattedResultData,
                input,
                setInput,
                newChat,
            }}
        >
            {props.children}
        </Context.Provider>
    );
};

export default ContextProvider;
