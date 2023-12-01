import React, { Component } from "react";
import ParticlesBg from "particles-bg";
import Navigation from "./Component/Navigation/Navigation";
import Logo from "./Component/Logo/Logo";
import Rank from "./Component/Rank/Rank";
import ImageLinkForm from "./Component/ImageLinkForm/ImageLinkForm";
import FaceRecognition from "./Component/FaceRecognition/FaceRecognition";
import SignIn from "./Component/SignIn/SignIn";
import Register from "./Component/Register/Register";
import "./App.css";

const returnClarifaiRequestOptions = (imageUrl) => {
  // Your PAT (Personal Access Token) can be found in the portal under Authentification
  const PAT = "79b90bc47f924e1da82aac7a239b5aac";
  // Specify the correct user_id/app_id pairings
  // Since you're making inferences outside your app's scope
  const USER_ID = "kjardine00";
  const APP_ID = "face-recognition-app";
  // Change these to whatever model and image URL you want to use
  // const MODEL_ID = "face-detection";
  const IMAGE_URL = imageUrl;

  const raw = JSON.stringify({
    user_app_id: {
      user_id: USER_ID,
      app_id: APP_ID,
    },
    inputs: [
      {
        data: {
          image: {
            url: IMAGE_URL,
          },
        },
      },
    ],
  });

  const requestOptions = {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: "Key " + PAT,
    },
    body: raw,
  };

  return requestOptions;
};

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: "",
      imageUrl: "",
      faceRegions: [],
      route: "signin",
      isSignedIn: false,
      user: {
        id: "",
        name: "",
        email: "",
        entries: 0,
        joined: '',
      }
    };
  }

  calcFaceLocations = (data) => {
    const len = data.outputs[0].data.regions.length;
    const faceRegions = [];

    const image = document.getElementById("inputImage");
    const width = Number(image.width);
    const height = Number(image.height);

    for (let i = 0; i < len; i++) {
      const faceLocation =
        data.outputs[0].data.regions[i].region_info.bounding_box;
      const bounding_box = {
        topRow: faceLocation.top_row * height,
        leftCol: faceLocation.left_col * width,
        bottomRow: height - faceLocation.bottom_row * height,
        rightCol: width - faceLocation.right_col * width,
      };

      faceRegions.push(bounding_box);
    }
    return faceRegions;
  };

  displayFaceBoxes = (newRegions) => {
    this.setState({
      faceRegions: [...this.state.faceRegions, newRegions],
    });
  };

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  };

  onButtonSubmit = () => {
    const model_Id = "face-detection";
    this.setState({ imageUrl: this.state.input });

    fetch(
      "https://api.clarifai.com/v2/models/" + model_Id + "/outputs",
      returnClarifaiRequestOptions(this.state.input)
    )
      .then((response) => response.json())
      .then((response) =>
        this.displayFaceBoxes(this.calcFaceLocations(response))
      )
      .catch((err) => console.log(err));
  };

  onRouteChange = (route) => {
    if (route === "register") {
      this.setState({ isSignedIn: false });
    } else if (route === "home") {
      this.setState({ isSignedIn: true });
    }
    this.setState({ route: route });
  };

  loadUser = (data) => {
    this.setState({ user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined,
    }})
  }

  render() {
    const { isSignedIn, imageUrl, faceRegions, route } = this.state;
    return (
      <div className="App">
        <ParticlesBg
          color={["#26798B", "#86E398"]}
          num={50}
          type="square"
          bg={true}
        />
        <Navigation
          onRouteChange={this.onRouteChange}
          isSignedIn={isSignedIn}
        />
        {route === "home" ? (
          <div>
            <Logo />
            <Rank loadUser={this.loadUser}/>
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onButtonSubmit={this.onButtonSubmit}
            />
            <FaceRecognition faceRegions={faceRegions} imageUrl={imageUrl} />
          </div>
        ) : route === "register" ? (
          <Register onRouteChange={this.onRouteChange} loadUser={this.loadUser} />
        ) : (
          <SignIn onRouteChange={this.onRouteChange} loadUser={this.loadUser} />
        )}
      </div>
    );
  }
}

export default App;
