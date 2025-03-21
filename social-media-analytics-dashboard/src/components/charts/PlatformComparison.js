import React from "react";
import {
  Chart,
  Series,
  ArgumentAxis,
  ValueAxis,
  Title,
} from "@progress/kendo-react-charts";
import { useSocialData } from "../../hooks/useSocialData";


const PlatformComparison = () => {
  const { socialMediaData } = useSocialData();

  const platforms = ["Twitter", "Instagram", "LinkedIn"];
  const data = platforms.map((platform) => ({
    platform,
    followers: socialMediaData[platform]?.followers || 0,
    engagement: socialMediaData[platform]?.engagement || 0,
  }));

  return (
    <div>
      <h2>Platform Comparison</h2>
      <Chart>
        <Title text="Followers and Engagement Comparison" />
        <ArgumentAxis>
          {data.map((item) => (
            <Series
              key={item.platform}
              type="column"
              name={item.platform}
              data={item.followers}
            />
          ))}
        </ArgumentAxis>
        <ValueAxis>
          <ValueAxis.Labels format="{0}" />
        </ValueAxis>
        <Series
          type="line"
          name="Engagement"
          data={data.map((item) => item.engagement)}
        />
      </Chart>
    </div>
  );
};

export default PlatformComparison;
