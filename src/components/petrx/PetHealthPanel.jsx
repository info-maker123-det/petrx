import React from "react";
import PetAlerts from "./PetAlerts";
import HealthTimeline from "./HealthTimeline";
import QuickReorder from "./QuickReorder";

export default function PetHealthPanel({ pet }) {
  return (
    <div className="space-y-5">
      <PetAlerts pet={pet} />
      <HealthTimeline pet={pet} />
      <QuickReorder />
    </div>
  );
}