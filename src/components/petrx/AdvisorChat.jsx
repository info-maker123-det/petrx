import React, { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import AdvisorMessageBubble from "./AdvisorMessageBubble";
import { Send, Loader2, Bot, Sparkles } from "lucide-react";

function buildPetProfile(pet) {
  const lines = [];
  lines.push(`Name: ${pet.name}`);
  lines.push(`Species: ${pet.species}`);
  if (pet.breed) lines.push(`Breed: ${pet.breed}`);
  if (pet.sex) {
    const sexLabel = pet.sex === "male" ? "Male" : "Female";
    const status = pet.spayed_neutered
      ? pet.sex === "male"
        ? " (Neutered)"
        : " (Spayed)"
      : "";
    lines.push(`Sex: ${sexLabel}${status}`);
  }
  if (pet.weight) lines.push(`Weight: ${pet.weight} ${pet.weight_unit || "lbs"}`);
  if (pet.date_of_birth) lines.push(`Date of Birth: ${pet.date_of_birth}`);
  if (pet.medical_conditions?.length)
    lines.push(`Medical Conditions: ${pet.medical_conditions.join(", ")}`);
  if (pet.allergies) lines.push(`Allergies: ${pet.allergies}`);
  if (pet.medications?.length) {
    const meds = pet.medications
      .map((m) => [m.name, m.dosage, m.frequency].filter(Boolean).join(" "))
      .join("; ");
    lines.push(`Current Medications: ${meds}`);
  }
  return lines.join("\n");
}

const STARTER_QUESTIONS = [
  "What products do you recommend for my pet's conditions?",
  "Are there supplements for joint support?",
  "Which of these need a prescription?",
  "Any interactions with their current medications?",
];

export default function AdvisorChat({ pet }) {
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [initializing, setInitializing] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const contextSentRef = useRef(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!pet?.id) return;
    let cancelled = false;
    let unsub = () => {};

    (async () => {
      setInitializing(true);
      setMessages([]);
      setError(null);
      setConversation(null);
      contextSentRef.current = false;
      try {
        const conv = await base44.agents.createConversation({
          agent_name: "medication_advisor",
          metadata: {
            name: `Advisor — ${pet.name}`,
            description: `Product suggestions for ${pet.name}`,
          },
        });
        if (cancelled) return;
        setConversation(conv);
        unsub = base44.agents.subscribeToConversation(conv.id, (data) => {
          if (!cancelled) setMessages(data.messages || []);
        });
      } catch (e) {
        if (!cancelled) setError(e.message || "Failed to start conversation");
      } finally {
        if (!cancelled) setInitializing(false);
      }
    })();

    return () => {
      cancelled = true;
      unsub();
    };
  }, [pet?.id]);

  const send = async (text) => {
    const content = (text ?? input).trim();
    if (!content || !conversation || sending) return;
    setInput("");
    setSending(true);
    try {
      let messageContent = content;
      if (!contextSentRef.current) {
        const profile = buildPetProfile(pet);
        messageContent = `Here is my pet's profile for context:\n\n${profile}\n\nMy question: ${content}`;
        contextSentRef.current = true;
      }
      const updated = await base44.agents.addMessage(conversation, {
        role: "user",
        content: messageContent,
      });
      setMessages(updated.messages || []);
    } catch (e) {
      setError(e.message || "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  const showTyping = sending && messages[messages.length - 1]?.role === "user";
  const showStarters = messages.length === 0 && !initializing && !sending;

  return (
    <div className="flex flex-col h-[600px] cellular-card overflow-hidden">
      <div className="flex-1 overflow-y-auto p-5 md:p-6 space-y-5 bg-secondary/30">
        {initializing ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Loader2 className="w-6 h-6 text-sage animate-spin mb-3" />
            <p className="text-sm text-ink/50">Setting up advisor for {pet.name}…</p>
          </div>
        ) : showStarters ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="w-14 h-14 rounded-full bg-sage/10 flex items-center justify-center mb-4">
              <Sparkles className="w-7 h-7 text-sage" />
            </div>
            <h3 className="font-display text-xl text-ink mb-2">Ask about {pet.name}'s care</h3>
            <p className="text-sm text-ink/50 mb-6 max-w-sm">
              I've reviewed {pet.name}'s profile. Pick a question below or ask your own.
            </p>
            <div className="flex flex-col gap-2.5 w-full max-w-md">
              {STARTER_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => send(q)}
                  className="text-left px-4 py-3 bg-white border border-border rounded-2xl text-sm font-medium text-ink hover:border-sage hover:bg-sage/5 transition-all flex items-center justify-between group"
                >
                  <span>{q}</span>
                  <Send className="w-3.5 h-3.5 text-ink/30 group-hover:text-sage transition-colors flex-shrink-0 ml-3" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((m, idx) => (
              <AdvisorMessageBubble key={idx} message={m} />
            ))}
            {showTyping && (
              <div className="flex gap-3 justify-start">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-sage/10 flex items-center justify-center mt-1">
                  <Bot className="w-4 h-4 text-sage" />
                </div>
                <div className="px-4 py-3 bg-white border border-border rounded-2xl rounded-tl-sm">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-sage/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 bg-sage/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 bg-sage/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        <div ref={scrollRef} />
      </div>

      <div className="p-4 border-t border-border bg-white">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            placeholder={conversation ? `Ask about ${pet.name}'s care…` : "Starting…"}
            disabled={!conversation || sending}
            className="flex-1 px-4 py-3 bg-secondary rounded-xl text-sm border border-transparent focus:border-sage focus:outline-none transition-all disabled:opacity-50"
          />
          <button
            onClick={() => send()}
            disabled={!conversation || sending || !input.trim()}
            className="px-4 py-3 bg-sage text-white rounded-xl hover:bg-[#3d5a66] transition-colors disabled:opacity-50 flex items-center justify-center"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
      </div>
    </div>
  );
}