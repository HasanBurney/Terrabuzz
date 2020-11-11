import React from "react";
import ComponentStyling from "../../style/Search/Profile.module.css";
import { CenterAlign } from "../FlexAlignment.js";

const Profile = () => {
  return (
    <div className={ComponentStyling.entry}>
      <CenterAlign>
        <div className={ComponentStyling.profilePicture}>
          <img src="/assets/img/profile_pictures/boy(3).svg" />
        </div>
      </CenterAlign>
      <div className={ComponentStyling.details}>
        <h1>Richard Miles</h1>
        <h2>@richardmiles</h2>
      </div>
    </div>
  );
};

export default Profile;