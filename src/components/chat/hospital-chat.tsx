"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function HospitalChat() {
  const [message, setMessage] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [messages, setMessages] =
    useState<Message[]>([
      {
        role: "assistant",
        content:
          "Hello 👋 I'm MediQueue AI Assistant. How can I help you today?",
      },
    ]);

  async function sendMessage() {
    if (!message.trim()) return;

    const userMessage = message;

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: userMessage,
      },
    ]);

    setMessage("");
    setLoading(true);

    try {
      const response =
        await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            message: userMessage,
          }),
        });

      const result =
        await response.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            result.answer ||
            "No response available",
        },
      ]);
    } catch (error) {
      console.error(error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Something went wrong.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-b p-4">
        <h1 className="text-xl font-semibold">
          MediQueue AI Assistant
        </h1>

        <p className="text-sm text-muted-foreground">
          Ask about appointments,
          doctors, reports, diet,
          emergency services and more.
        </p>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.map(
          (msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.role === "user"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-xl px-4 py-3 text-sm ${
                  msg.role ===
                  "user"
                    ? "bg-primary text-primary-foreground"
                    : "border bg-muted"
                }`}
              >
                <p className="whitespace-pre-wrap">
                  {msg.content}
                </p>
              </div>
            </div>
          )
        )}

        {loading && (
          <div className="flex justify-start">
            <div className="rounded-xl border bg-muted px-4 py-3 text-sm">
              Thinking...
            </div>
          </div>
        )}
      </div>

      <div className="border-t p-4">
        <div className="flex gap-2">
          <Input
            value={message}
            onChange={(e) =>
              setMessage(
                e.target.value
              )
            }
            placeholder="Ask a question..."
            onKeyDown={(e) => {
              if (
                e.key ===
                "Enter"
              ) {
                sendMessage();
              }
            }}
          />

          <Button
            onClick={sendMessage}
            disabled={
              loading ||
              !message.trim()
            }
          >
            Send
          </Button>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              setMessage(
                "What are hospital timings?"
              )
            }
          >
            Hospital Timings
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              setMessage(
                "How can I book an appointment?"
              )
            }
          >
            Appointments
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              setMessage(
                "What diet is healthy?"
              )
            }
          >
            Diet Advice
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              setMessage(
                "Emergency contact number?"
              )
            }
          >
            Emergency
          </Button>
        </div>
      </div>
    </div>
  );
}