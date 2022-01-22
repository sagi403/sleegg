import React from "react";
import { Helmet } from "react-helmet";

const Meta = ({ title, description, keywords }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
    </Helmet>
  );
};

Meta.defaultProps = {
  title: "Welcome to SLEEGG",
  description: "Shop now & buy the perfect gift for your loved one.",
  keywords: "quotes, romantic, love, unique designs",
};

export default Meta;
