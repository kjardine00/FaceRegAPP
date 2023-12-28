import React from "react";

class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      signInEmailInput: "",
      signInPasswordInput: "",
    };
  }

  onEmailChange = (event) => {
    this.setState({ signInEmailInput: event.target.value });
  };

  onPasswordChange = (event) => {
    this.setState({ signInPasswordInput: event.target.value });
  };

  onSubmitSignIn = () => {
    fetch("https://smartbrainwebapi.onrender.com:10000/signin", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: this.state.signInEmailInput,
        password: this.state.signInPasswordInput,
      }),
    })
      .then((response) => response.json())
      .then((user) => {
        if (user.id) {
          this.props.loadUser(user);
          this.props.onRouteChange("home");
        }
      })
      .catch((err) => console.log(err));
  };

  render() {
    const { onRouteChange } = this.props;
    return (
      <article className="center mw6 mw6-ns br3 hidden ba b--black-10 mv4 shadow-5">
        <div>
          <main className="pa4 black-80">
            <div className="measure">
              <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                <legend className="f1 fw6 ph0 mh0">Sign In</legend>
                <div className="mt3">
                  <label className="db fw6 lh-copy f6" htmlFor="email-address">
                    Email
                  </label>
                  <input
                    className="br2 pa2 input-reset ba bw1 bg-transparent hover-bg-black hover-white w-100"
                    type="email"
                    name="email-address"
                    id="email-address"
                    onChange={this.onEmailChange}
                  />
                </div>
                <div className="mv3">
                  <label className="db fw6 lh-copy f6" htmlFor="password">
                    Password
                  </label>
                  <input
                    className="br2 pa2 input-reset ba bw1 bg-transparent hover-bg-black hover-white w-100"
                    type="password"
                    name="password"
                    id="password"
                    onChange={this.onPasswordChange}
                  />
                </div>
              </fieldset>
              <div className="">
                <input
                  onClick={this.onSubmitSignIn}
                  className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
                  type="submit"
                  value="Submit"
                />
              </div>
              <div className="lh-copy mt3">
                <p
                  onClick={() => onRouteChange("register")}
                  href="#0"
                  className="f6 link dim black db"
                >
                  Register
                </p>
              </div>
            </div>
          </main>
        </div>
      </article>
    );
  }
}

export default SignIn;
