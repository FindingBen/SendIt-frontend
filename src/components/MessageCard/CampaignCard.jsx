const CampaignCard = ({ campaign }) => {
  return (
    <div className="grid grid-cols-5 gap-4 items-center text-sm">
      <div className="font-medium truncate">{campaign.name}</div>
      <div>{campaign.engagement}</div>
      <div>{campaign.overall_perfromance ?? 0}%</div>
      <div>{campaign.total_clicks ?? 0}</div>
      <div>{campaign.audience}</div>
    </div>
  );
};

export default CampaignCard;
