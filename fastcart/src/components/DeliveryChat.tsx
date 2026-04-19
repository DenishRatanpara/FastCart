"use client";
import { getSocket } from "@/app/lib/socket";
import axios from "axios";
import mongoose from "mongoose";
import React, { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  orderId: mongoose.Types.ObjectId;
  senderId: mongoose.Types.ObjectId;
  title?: string;
};

type ChatMessage = {
  _id?: string;
  clientId?: string;
  roomId: string;
  senderId: string;
  text: string;
  time?: string;
  createdAt?: string;
};

const DeliveryChat = ({ orderId, senderId: senderIdProp, title }: Props) => {
  const roomId = useMemo(() => String(orderId), [orderId]);
  const senderId = useMemo(() => String(senderIdProp), [senderIdProp]);

  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const bottomRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.post<ChatMessage[]>("/api/chat/message", {
          roomId,
        });
        setMessages(res.data || []);
      } catch (e) {
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [roomId]);

  useEffect(() => {
    const socket = getSocket();
    socket.emit("join-room", roomId);

    const onIncoming = (msg: ChatMessage) => {
      if (String(msg.roomId) !== roomId) return;
      setMessages((prev) => {
        if (msg.clientId && prev.some((m) => m.clientId === msg.clientId)) {
          return prev;
        }
        return [...prev, msg];
      });
    };

    socket.on("send-message", onIncoming);

    return () => {
      socket.off("send-message", onIncoming);
    };
  }, [roomId]);

  const sendMessage = () => {
    const text = newMessage.trim();
    if (!text) return;
    const socket = getSocket();

    const message: ChatMessage = {
      clientId:
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      roomId,
      senderId,
      text,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    // Optimistic append (server will echo back the same clientId)
    setMessages((prev) =>
      prev.some((m) => m.clientId && m.clientId === message.clientId)
        ? prev
        : [...prev, message]
    );

    socket.emit("send-message", message);
    setNewMessage("");
  };

  return (
    <div className="mt-4 bg-white border rounded-xl shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b flex items-center justify-between">
        <p className="font-semibold text-gray-800">{title || "Chat"}</p>
        <p className="text-xs text-gray-500">Order #{roomId.slice(-6)}</p>
      </div>

      <div className="h-[260px] overflow-y-auto p-4 space-y-2 bg-gray-50">
        {loading ? (
          <p className="text-sm text-gray-500">Loading messages…</p>
        ) : messages.length === 0 ? (
          <p className="text-sm text-gray-500">No messages yet.</p>
        ) : (
          messages.map((m, idx) => {
            const mine = String(m.senderId) === senderId;
            return (
              <div
                key={m._id || `${m.time || "t"}-${idx}`}
                className={`flex ${mine ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[78%] rounded-2xl px-3 py-2 text-sm shadow-sm ${
                    mine
                      ? "bg-green-600 text-white rounded-br-md"
                      : "bg-white text-gray-800 rounded-bl-md border"
                  }`}
                >
                  <p className="whitespace-pre-wrap wrap-break-word">{m.text}</p>
                  {m.time && (
                    <p
                      className={`mt-1 text-[10px] ${
                        mine ? "text-green-100" : "text-gray-400"
                      }`}
                    >
                      {m.time}
                    </p>
                  )}
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      <div className="p-3 border-t flex gap-2">
        <input
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
          type="text"
          value={newMessage}
          placeholder="Type a message…"
          className="flex-1 border rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-300"
        />
        <button
          onClick={sendMessage}
          className="bg-green-600 hover:bg-green-700 text-white rounded-xl px-4 text-sm font-medium"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default DeliveryChat;