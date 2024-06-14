"use client"
import React, { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const AIsuggestions = ({ term }: { term: string }) => {
    const [apiData, setApiData] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true); 

    useEffect(() => {
        const fetchSuggestions = async () => {
            setLoading(true); 

            const genAI = new GoogleGenerativeAI("AIzaSyDL1fB1JjMpUnqX35KdTLchh_0ryxlgArI");
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });
            const prompt = `You are a digital video assistant working for services such as Netflix, Disney Plus & Amazon Prime Video. Your job is to provide suggestions based on the videos the user specifies. Provide an quirky breakdown of what the user should watch next! It should only list the names of the films after the introduction. Keep the response short and sweet! Always list at least 3 films as suggestions. If the user mentions a genre, you should provide a suggestion based on that genre.You have to start your message strictly like "Based on your choice you must also watch".But when it is genre you have to write like "Based on your choice of &{term} you must watch".User enterd ${term}`;

            try {
                const result = await model.generateContent(prompt);
                const response = await result.response;
                const text = await response.text();
                setApiData(text);
            } catch (error) {
                console.error("Error fetching suggestions:", error);
            }

            setLoading(false); 
        };

        fetchSuggestions();
    }, [term]); 

    return (
        <div className="ml-10">
            {loading ? (
                <>
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white" />
                    <p className="text-sm text-gray-400">AI Assistant is thinking...</p>
                </>
            ) : (
                <>
                    <div className="animate-pulse rounded-full bg-gradient-to-t from-white h-10 w-10 border-2 flex-shrink-0 border-white" />

                    <div>
                        <p className="text-sm text-gray-400">AI Assistant Suggests: </p>
                        <p className="italic text-xl">{apiData}</p>
                    </div>
                </>
            )}
        </div>
    );
};

export default AIsuggestions;
