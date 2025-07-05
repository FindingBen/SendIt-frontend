import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

const CampaignCard = ({ campaign }) => {
  return (
    <div className="grid grid-cols-5 w-[100%] gap-4 h-8 items-center ">
      <div className="text-white/90">{campaign.name}</div>
      <div className="text-white/90">{campaign.engagement}</div>
      <div className="text-white/90">{campaign.overall_perfromance ?? 0}%</div>
      <div className="text-white/90">{campaign.clicks ?? 0}</div>
      <div className="text-white/90">{campaign.audience}</div>
    </div>
  );
};

export default CampaignCard;
