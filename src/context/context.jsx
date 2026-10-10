/* eslint-disable react-refresh/only-export-components */
import { createContext, useState } from "react";
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

// Direct Gemini AI query execution with multi-turn chat memory
export const run = async (prompt, history = []) => {
    try {
        if (!apiKey) {
            throw new Error("Gemini API key is not configured. Please add VITE_GEMINI_API_KEY to your .env file.");
        }

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            systemInstruction,
        });

        const formattedHistory = history
            .filter((item) => item.text && item.text.trim())
            .map((item) => ({
                role: item.role === "assistant" || item.role === "model" ? "model" : "user",
                parts: [{ text: item.text }],
            }));

        const chat = model.startChat({
            history: formattedHistory,
            generationConfig: {
                maxOutputTokens: 2048,
            },
        });

        const result = await chat.sendMessage(prompt);
        return result.response.text();
    } catch (err) {
        console.warn("Primary model error, attempting fallback...", err);
        try {
            const fallbackModel = genAI.getGenerativeModel({
                model: "gemini-3.8-flash",
                systemInstruction,
            });

            const formattedHistory = history
                .filter((item) => item.text && item.text.trim())
                .map((item) => ({
                    role: item.role === "assistant" || item.role === "model" ? "model" : "user",
                    parts: [{ text: item.text }],
                }));

            const chat = fallbackModel.startChat({
                history: formattedHistory,
                generationConfig: {
                    maxOutputTokens: 2048,
                },
            });

            const result = await chat.sendMessage(prompt);
            return result.response.text();
        } catch (fallbackErr) {
            console.error("Gemini processing error:", fallbackErr);
            return `Error: ${fallbackErr.message || err.message || "Failed to generate response"}`;
        }
    }
};

const ContextProvider = (props) => {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);
    const [recentPrompt, setRecentPrompt] = useState("");
    const [previousPrompts, setPreviousPrompts] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formattedResultData, setFormattedResultData] = useState("");

    const newChat = () => {
        setLoading(false);
        setShowResult(false);
        setMessages([]);
        setRecentPrompt("");
        setFormattedResultData("");
    };

    const onSent = async (prompt) => {
        const textToSend = prompt !== undefined ? prompt : input;
        if (!textToSend || !textToSend.trim()) return;

        const currentPrompt = textToSend.trim();
        setInput("");
        setRecentPrompt(currentPrompt);
        setPreviousPrompts((prev) => (prev.includes(currentPrompt) ? prev : [...prev, currentPrompt]));
        setShowResult(true);
        setLoading(true);

        const userMessage = {
            id: `user-${Date.now()}`,
            role: "user",
            text: currentPrompt,
        };

        const currentHistory = [...messages, userMessage];
        setMessages(currentHistory);

        // Send current prompt with full conversational history to Gemini
        const responseText = await run(currentPrompt, messages);
        const formattedResponse = formatContentToHTML(responseText);

        const assistantMessage = {
            id: `model-${Date.now()}`,
            role: "model",
            text: responseText,
            html: formattedResponse,
        };

        setMessages([...currentHistory, assistantMessage]);
        setFormattedResultData(formattedResponse);
        setLoading(false);
    };

    return (
        <Context.Provider
            value={{
                messages,
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
