import React from "react";
import { base44 } from "@/api/base44Client";
import { FREQUENCIES } from "./AddSubscriptionModal";
import { Pause, Play, Trash2, Pill, Leaf, Calendar } from "lucide-react";

export default function AutoShipSubscriptionRow({ sub, onChanged }) {
  const autoshipPrice = (sub.product_price || 0) * 0.95 * (sub.quantity || 1);
  const savings = (sub.product_price || 0) * 0.05 * (sub.quantity || 1);
  const isPaused = sub.status === "paused";

  const toggle = async () => {
    await base44.entities.Subscription.update(sub.id, { status: isPaused ? "active" : "paused" });
    onChanged();
  };

  const remove = async () => {
    if (!confirm(`Remove ${sub.product_name} from AutoShip?`)) return;
    await base44.entities.Subscription.delete(sub.id);
    onChanged();
  };

  const changeFrequency = async (days) => {
    const next = new Date();
    next.setDate(next.getDate() + days);
    await base44.entities.Subscription.update(sub.id, {
      frequency_days: days,
      next_refill_date: next.toISOString().slice(0, 10),
    });
    onChanged();
  };

  const refillDate = sub.next_refill_date
    ? new Date(sub.next_refill_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })
    : "—";

  return (
    <div className={`flex items-center gap-3 p-3 rounded-2xl border-[0.5px] border-border transition-opacity ${isPaused ? "bg-secondary/50 opacity-60" : "bg-white"}`}>
      <div className="w-12 h-12 rounded-xl bg-secondary overflow-hidden flex-shrink-0">
        {sub.product_image ? (
          <img src={sub.product_image} alt={sub.product_name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            {sub.requires_prescription ? <Pill className="w-5 h-5 text-sage/50" /> : <Leaf className="w-5 h-5 text-sage/50" />}
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-ink truncate">{sub.product_name}</p>
        <div className="flex items-center gap-1.5 flex-wrap text-xs text-ink/50">
          <span>Qty {sub.quantity}</span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {isPaused ? "Paused" : refillDate}
          </span>
          <span>·</span>
          <span className="text-sage font-medium">${autoshipPrice.toFixed(2)}</span>
          {savings > 0 && <span className="text-ink/30">save ${savings.toFixed(2)}</span>}
        </div>
      </div>

      <select
        value={sub.frequency_days}
        onChange={(e) => changeFrequency(Number(e.target.value))}
        className="text-xs bg-secondary rounded-full px-3 py-1.5 border-0 focus:outline-none cursor-pointer"
      >
        {FREQUENCIES.map((f) => (
          <option key={f.days} value={f.days}>{f.label}</option>
        ))}
      </select>

      <div className="flex items-center gap-1">
        <button
          onClick={toggle}
          className="w-8 h-8 rounded-full hover:bg-secondary flex items-center justify-center text-ink/40 hover:text-sage transition-colors"
          title={isPaused ? "Resume" : "Pause"}
        >
          {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
        </button>
        <button
          onClick={remove}
          className="w-8 h-8 rounded-full hover:bg-secondary flex items-center justify-center text-ink/40 hover:text-destructive transition-colors"
          title="Remove"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}