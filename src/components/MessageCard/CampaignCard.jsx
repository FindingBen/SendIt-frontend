import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

const CampaignCard = ({ campaign }) => {
  return (
    <>
      <div>{campaign.name}</div>
      <div>{campaign.engagement}</div>
      <div>{campaign.overall_perfromance ?? 0}%</div>
      <div>{campaign.clicks ?? 0}</div>
      <div>{campaign.audience}</div>
    </>
  );
};

export default CampaignCard;
