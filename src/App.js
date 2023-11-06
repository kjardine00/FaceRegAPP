import React, { Component } from 'react';
// import Clarifai from 'clarifai';
import ParticlesBg from 'particles-bg';
import Navigation from "./Component/Navigation/Navigation";
import Logo from './Component/Logo/Logo';
import Rank from './Component/Rank/Rank';
import ImageLinkForm from './Component/ImageLinkForm/ImageLinkForm';
import './App.css';

const imageURL = this.input;
// Your PAT (Personal Access Token) can be found in the portal under Authentification
const PAT = '79b90bc47f924e1da82aac7a239b5aac';
// Specify the correct user_id/app_id pairings
// Since you're making inferences outside your app's scope
const USER_ID = 'kjardine00';       
const APP_ID = 'face-recognition-app';
// Change these to whatever model and image URL you want to use
const MODEL_ID = 'general-image-recognition';
const MODEL_VERSION_ID = 'face-detection';    
const IMAGE_URL = imageURL;

///////////////////////////////////////////////////////////////////////////////////
// YOU DO NOT NEED TO CHANGE ANYTHING BELOW THIS LINE TO RUN THIS EXAMPLE
///////////////////////////////////////////////////////////////////////////////////

const raw = JSON.stringify({
    "user_app_id": {
        "user_id": USER_ID,
        "app_id": APP_ID
    },
    "inputs": [
        {
            "data": {
                "image": {
                    "url": IMAGE_URL
                }
            }
        }
    ]
});

const requestOptions = {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Authorization': 'Key ' + PAT
    },
    body: raw
};

// NOTE: MODEL_VERSION_ID is optional, you can also call prediction with the MODEL_ID only
// https://api.clarifai.com/v2/models/{YOUR_MODEL_ID}/outputs
// this will default to the latest version_id

fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/versions/" + MODEL_VERSION_ID + "/outputs", requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));

// const app = new Clarifai.App({
//   apiKey: '78dde200adba427e8f491feb96082aab'
//  });

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
    }
  }

  onInputChange = (event) => {
    console.log(event);
  }

  onButtonSubmit = () => {
    console.log('click');
    fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/versions/" + MODEL_VERSION_ID + "/outputs", requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));

    app.models.predict("API_KEY", "IMAGE")
    .then(
      function(response) {
        // Do something with the response
        console.log(response);
      },
      function(err) {
        // Handle the error
        console.log(err);
      }
    );
  }

  render() {
    return (
      <div className="App">
        <ParticlesBg color={["#26798B", "#86E398"]} num={50} type="square" bg={true} />
        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit} />
        <FaceRecognition />
      </div>
    );
  }
}

export default App;