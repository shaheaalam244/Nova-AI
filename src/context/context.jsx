import { createContext, useEffect, useState } from "react";
import formatContentToHTML from "../utils/html-formatter";

export const Context = createContext();

// ✅ frontend-only run function
const run = async (prompt) => {
    try {
        const res = await fetch("http://localhost:3001/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ prompt }),
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.error || `Server error (${res.status})`);
        }

        const data = await res.json();
        return data.reply;
    } catch (err) {
        console.error("Error connecting to backend server:", err);
        return `Error: ${err.message || "Failed to fetch response. Please make sure backend server is running on http://localhost:3001"}`;
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
