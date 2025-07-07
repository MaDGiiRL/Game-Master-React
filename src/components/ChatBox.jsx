import { useState, useEffect, useRef, useContext } from "react";
import { supabase } from "../supabase/supabase-client";
import SessionContext from "../context/SessionContext";

export default function ChatBox({ data }) {
    const { session } = useContext(SessionContext);

    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const messagesEndRef = useRef(null);

    // Carica i messaggi al montaggio
    useEffect(() => {
        const fetchMessages = async () => {
            const { data: fetchedMessages, error } = await supabase
                .from("messages")
                .select("*")
                .eq("game_id", data.id)
                .order("updated_at", { ascending: true });

            if (error) {
                console.error("Errore nel caricamento messaggi:", error);
            } else {
                setMessages(fetchedMessages);
            }
        };

        fetchMessages();

        // Realtime con nuova sintassi
        const channel = supabase
            .channel("chat-messages")
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "messages",
                },
                (payload) => {
                    const newMessage = payload.new;
                    if (newMessage.game_id === data.id) {
                        setMessages((prev) => [...prev, newMessage]);
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [data.id]);


    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);


    const handleMessageSubmit = async (e) => {
        e.preventDefault();

        if (message.trim().length === 0) return;

        const { error } = await supabase.from("messages").insert([
            {
                profile_id: session?.user.id,
                profile_username: session?.user.user_metadata.username,
                game_id: data.id,
                content: message.trim(),
            },
        ]);

        if (error) {
            console.error("Errore invio messaggio:", error);
        } else {
            setMessage("");
        }
    };

    return (
        <div className="chatbox-container mt-10 mx-auto bg-gray-900 text-white rounded-lg shadow-lg flex flex-col h-[400px]">
            {/* Header */}
            <header className="bg-indigo-700 px-4 py-3 rounded-t-lg font-semibold text-lg">
                Chat - {data?.name}
            </header>

            {/* Area messaggi */}
            <div
                className="flex-1 px-4 py-3 overflow-y-auto"
                style={{ backgroundColor: "#1f2937" }}
            >
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`mb-3 ${msg.profile_id === session?.user.id ? "text-right" : ""}`}
                    >
                        <div
                            className={`inline-block px-3 py-2 rounded-lg max-w-[75%] break-words ${msg.profile_id === session?.user.id
                                ? "bg-gray-700"
                                : "bg-indigo-600"
                                }`}
                        >
                            <strong className="block text-sm text-gray-300 mb-1">
                                {msg.profile_username}
                            </strong>
                            {msg.content}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form
                onSubmit={handleMessageSubmit}
                className="flex border-t border-indigo-700"
            >
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Scrivi un messaggio..."
                    className="flex-grow bg-gray-800 text-white px-4 py-2 rounded-bl-lg focus:outline-none"
                />
                <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-br-lg transition"
                >
                    Invia
                </button>
            </form>
        </div>
    );
}
