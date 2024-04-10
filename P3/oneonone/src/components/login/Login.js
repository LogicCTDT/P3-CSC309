// import React, { Component } from "react";
// import { BrowserRouter } from "react-router-dom";   
// import { connect } from "react-redux";           
// import PropTypes from "prop-types";             
// import { Link } from "react-router-dom";
// import { Container, Button, Row, Col, Form } from "react-bootstrap";

// import { login } from "./LoginActions.js";       

// class Login extends Component {
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

//   onLoginClick = () => {
//     const userData = {
//       username: this.state.username,
//       password: this.state.password
//     };
//     this.props.login(userData, "/profile"); 
//   };
//   render() {
//     return (
//       <Container>
//         <Row>
//           <Col md="4">
//             <h1>Login</h1>
//             <Form>
//               <Form.Group controlId="usernameId">
//                 <Form.Label>User name</Form.Label>
//                 <Form.Control
//                   type="text"
//                   name="username"
//                   placeholder="Enter user name"
//                   value={this.state.username}
//                   onChange={this.onChange}
//                 />
//               </Form.Group>

//               <Form.Group controlId="passwordId">
//                 <Form.Label>Your password</Form.Label>
//                 <Form.Control
//                   type="password"
//                   name="password"
//                   placeholder="Enter password"
//                   value={this.state.password}
//                   onChange={this.onChange}
//                 />
//               </Form.Group>
//             </Form>
//             <Button color="primary" onClick={this.onLoginClick}>
//               Login
//             </Button>
//             <p className="mt-2">
//               Don't have account? <Link to="/signup">Signup</Link>
//             </p>
//           </Col>
//         </Row>
//       </Container>
//     );
//   }
// }

// Login.propTypes = {
//   login: PropTypes.func.isRequired,
//   auth: PropTypes.object.isRequired
// };

// const mapStateToProps = state => ({
//   auth: state.auth
// });

// export default Login;

// import React, { useState } from "react";

// const Login = () => {
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const handleLogin = (e) => {
//         e.preventDefault();
//     };

//     return (
//         <div>
//             <h2>Login</h2>
//             <form onSubmit={handleLogin}>
//                 <div>
//                     <label>Email: </label>
//                     <input
//                         type="email"
//                         placeholder="Enter email"
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                         required
//                     />
//                 </div>
//                 <div>
//                     <label>Password: </label>
//                     <input
//                         type="password"
//                         placeholder="Enter password"
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                         required
//                     />
//                 </div>
//                 <div>
//                     <button type="submit">Login</button>
//                 </div>
//             </form>
//         </div>
//     );
// };

// export default Login;

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

async function LoginUser(credentials) {
    return fetch('http://localhost:3000/login',{
        method: 'POST',
        header: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    }).then(data => data.json());
}

const Login = ({setToken}) => {
    
    const [userName, setUserName] = useState();
    const [password, setPassword] = useState();
    const navigate = useNavigate();
    const handleSubmit = async(e) => {
        navigate('/');
    e.preventDefault()
        const token = await LoginUser({
            userName,
            password
        });
        setToken(token);
        
    }
  require('./login.css');
  return (
    <div class="login">
			<form onSubmit={handleSubmit}>
				<h1>Login</h1>
				<lable for="email">Email address:</lable>
				<input type="email" id="email" name="email" required/>
				<label for="password">Password:</label>
				<input type="password" id="password" name="password" required/>
				<button type="submit">Login</button>
				<div class="additional-links">
					<a href="signup">Do not have an account? Go to Signup!</a>
				</div>
			</form>
		</div>
  );
};

Login.propTypes = {
    setToken: PropTypes.func.isRequired
}

export default Login;