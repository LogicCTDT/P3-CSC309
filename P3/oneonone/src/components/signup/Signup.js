// import React, { Component } from "react";
// import { withRouter } from "../withRouter";
// import { connect } from "react-redux";
// import PropTypes from "prop-types";
// import { Link } from "react-router-dom";
// import {
//   Container,
//   Button,
//   Row,
//   Col,
//   Form,
//   FormControl
// } from "react-bootstrap";

// import { signupNewUser } from "./SignupActions";

// class Signup extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       username: "",
//       password: ""
//     };
//   }
//   onChange = e => {
//     this.setState({ [e.target.name]: e.target.value });
//   };

//   // update function to call the action
//   onSignupClick = () => {
//     const userData = {
//       username: this.state.username,
//       password: this.state.password
//     };
//     this.props.signupNewUser(userData);
//   };

//   render() {
//     return (
//       <Container>
//         <Row>
//           <Col md="4">
//             <h1>Sign up</h1>
//             <Form>
//               <Form.Group controlId="usernameId">
//                 <Form.Label>User name</Form.Label>
//                 <Form.Control
//                   isInvalid={this.props.createUser.usernameError}
//                   type="text"
//                   name="username"
//                   placeholder="Enter user name"
//                   value={this.state.username}
//                   onChange={this.onChange}
//                 />
//                 <FormControl.Feedback type="invalid">
//                   {this.props.createUser.usernameError}
//                 </FormControl.Feedback>
//               </Form.Group>

//               <Form.Group controlId="passwordId">
//                 <Form.Label>Your password</Form.Label>
//                 <Form.Control
//                   isInvalid={this.props.createUser.passwordError}
//                   type="password"
//                   name="password"
//                   placeholder="Enter password"
//                   value={this.password}
//                   onChange={this.onChange}
//                 />
//                 <Form.Control.Feedback type="invalid">
//                   {this.props.createUser.passwordError}
//                 </Form.Control.Feedback>
//               </Form.Group>
//             </Form>
//             <Button color="primary" onClick={this.onSignupClick}>
//               Sign up
//             </Button>
//             <p className="mt-2">
//               Already have account? <Link to="/login">Login</Link>
//             </p>
//           </Col>
//         </Row>
//       </Container>
//     );
//   }
// }

// // // connect action and reducer
// // // replace 
// // // export default Signup;
// // // with code below:

// Signup.propTypes = {
//   signupNewUser: PropTypes.func.isRequired,
//   createUser: PropTypes.object.isRequired
// };

// const mapStateToProps = state => ({
//   createUser: state.createUser
// });

// export default connect(mapStateToProps, {
//   signupNewUser
// })(withRouter(Signup));

// import React, { useState } from 'react';
// import PropTypes from 'prop-types';
// import { connect } from 'react-redux';
// import { Link } from 'react-router-dom';
// import { Container, Row, Col, Form, Button, FormControl } from 'react-bootstrap';
// import { signupNewUser } from './SignupActions';

// function Signup({ signupNewUser, createUser }) {
//   const [formData, setFormData] = useState({
//     username: '',
//     password: ''
//   });

//   const onChange = e => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const onSignupClick = () => {
//     const userData = {
//       username: formData.username,
//       password: formData.password
//     };
//     signupNewUser(userData);
//   };

//   return (
//     <Container>
//       <Row>
//         <Col md="4">
//           <h1>Sign up</h1>
//           <Form>
//             <Form.Group controlId="usernameId">
//               <Form.Label>User name</Form.Label>
//               <Form.Control
//                 isInvalid={createUser.usernameError}
//                 type="text"
//                 name="username"
//                 placeholder="Enter user name"
//                 value={formData.username}
//                 onChange={onChange}
//               />
//               <FormControl.Feedback type="invalid">
//                 {createUser.usernameError}
//               </FormControl.Feedback>
//             </Form.Group>

//             <Form.Group controlId="passwordId">
//               <Form.Label>Your password</Form.Label>
//               <Form.Control
//                 isInvalid={createUser.passwordError}
//                 type="password"
//                 name="password"
//                 placeholder="Enter password"
//                 value={formData.password}
//                 onChange={onChange}
//               />
//               <Form.Control.Feedback type="invalid">
//                 {createUser.passwordError}
//               </Form.Control.Feedback>
//             </Form.Group>
//           </Form>
//           <Button color="primary" onClick={onSignupClick}>
//             Sign up
//           </Button>
//           <p className="mt-2">
//             Already have account? <Link to="/login">Login</Link>
//           </p>
//         </Col>
//       </Row>
//     </Container>
//   );
// }

// Signup.propTypes = {
//   signupNewUser: PropTypes.func.isRequired,
//   createUser: PropTypes.object.isRequired
// };

// const mapStateToProps = state => ({
//   createUser: state.createUser
// });

// export default Signup;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const navigate = useNavigate();
  const handleSignup = (e) => {
    // const passwordRegex = /^(?=.*[A-Z]).{8,}$/;
    // if (!passwordRegex.test(password)) {
    //   alert("Password must be at least 8 characters long and contain at least one capital letter");
    //   return;
    // }
    // const englishRegex = /^[A-Za-z]+$/;
    // if (!englishRegex.test(firstName)) {
    //   alert("First name should contain only English characters");
    //   return;
    // }
    // if (!englishRegex.test(lastName)) {
    //   alert("Last name should contain only English characters");
    //   return;
    // }
    navigate("/");
    e.preventDefault();
    console.log("Signup email:", email, "password:", password);
  };
  require("./signup.css");
  return (
    <div class="create-account">
			<form onSubmit={handleSignup}>
				<h1>Create Your Account</h1>
				<label for="email">Email address <span class="required">*</span>:</label>
				<input type="email" id="email" name="email" required/>
				<lable for="username">User name:</lable>
				<input type="text" id="username" name="username"/>
				<label for="first-name">First name:</label>
				<input type="text" id="first-name" name="first-name"/>
				<label for="last-name">Last name:</label>
				<input type="text" id="last-name" name="last-name"/>
				<label for="password">Password <span class="required">*</span>:</label>
				<input type="password" id="password" name="password" required/>
				<label for="confirm-password">Confirm Password <span class="required">*</span>:</label>
				<input type="password" id="confirm-password" name="confirm-password" required/>
				<button type="submit">Signup</button>
				<div class="additional-links">
					<a href="login">Already have an account? Back to Login</a>
				</div>
			</form>
		</div>
  );
};

export default Signup;