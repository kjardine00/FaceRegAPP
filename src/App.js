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
  const PAT = "37c79d6f0efd48b5b6098dfa6c975de3";
  // Specify the correct user_id/app_id pairings
  // Since you're making inferences outside your app's scope
  const USER_ID = "kjardine00";
  const APP_ID = "face-recognition-app";
  // Change these to whatever model and image URL you want to use

  const raw = JSON.stringify({
    user_app_id: {
      user_id: USER_ID,
      app_id: APP_ID,
    },
    inputs: [
      {
        data: {
          image: {
            url: imageUrl,
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
      isSignedIn: true,
      user: {
        id: "123",
        name: "john",
        email: "john@email.com",
        entries: 0,
        joined: "",
      },
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

  onImageSubmit = () => {
    const MODEL_ID = "face-detection";
    const MODEL_VERSION_ID = "6dc7e46bc9124c5c8824be4822abe105";
    this.setState({ imageUrl: this.state.input });

    fetch(
      "https://api.clarifai.com/v2/models/" +
        MODEL_ID +
        "/versions/" +
        MODEL_VERSION_ID +
        "/outputs",
      returnClarifaiRequestOptions(this.state.input)
    )
      .then((response) => response.json())
      .then((response) => {
        if (response) {
          const len = response.outputs[0].data.regions.length;
          fetch("http://localhost:3000/image", {
            method: "put",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: this.state.user.id,
              entries: len,
            }),
          });
        }
        this.displayFaceBoxes(this.calcFaceLocations(response));
      })
      .catch((err) => console.log(err));
      this.reloadEntries();
    };

  reloadEntries = () => {
    fetch("http://localhost:3000/profile/" + this.state.user.id)
      .then((response) => response.json())
      .then((data) => {
        this.loadUser(data);
      });
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
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined,
      },
    });
  };

  render() {
    const { isSignedIn, imageUrl, faceRegions, route, user } = this.state;
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
            <Rank name={user.name} entries={user.entries} />
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onButtonSubmit={this.onImageSubmit}
            />
            <FaceRecognition
              faceRegions={faceRegions}
              imageUrl={imageUrl}
              entryCount={this.updateEntries}
            />
          </div>
        ) : route === "register" ? (
          <Register
            onRouteChange={this.onRouteChange}
            loadUser={this.loadUser}
          />
        ) : (
          <SignIn onRouteChange={this.onRouteChange} loadUser={this.loadUser} />
        )}
      </div>
    );
  }
}

export default App;
