import React from "react";
import "./FaceRecognition.css";

const FaceRecognition = ({ imageUrl, faceRegions }) => {
  return (
    <div className="center ma">
      <div className="absolute mt2">
        <img
          id="inputImage"
          alt={""}
          src={imageUrl}
          width="500px"
          height="auto"
        />
        {faceRegions[0]?.map((region) => {
          return (
            <div
              className="bounding-box"
              style={{
                top: region.topRow,
                right: region.rightCol,
                bottom: region.bottomRow,
                left: region.leftCol,
              }}
            ></div>
          );
        })}
      </div>
    </div>
  );
};

export default FaceRecognition;