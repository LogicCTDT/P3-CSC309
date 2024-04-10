import { BrowserRouter } from 'react-router-dom';
import './App.css';
import Router from './components/routes'
// import { ToastContainer, toast } from "react-toastify";
// import axios from "axios";
// axios.defaults.baseURL = "http://127.0.0.1:8000";
function App() {
  return (
    <div className="App">
      
      <Router />
      
    </div>
  )
}
export default App;

// function App() {
//   const [formData, setFormData] = useState({
//     username: '',
//     lastName: '',
//     firstName: '',
//     mobileNumber: '',
//     email: '',
//     currentPassword: '',
//     newPassword: '',
//     confirmPassword: ''
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (formData.newPassword !== formData.confirmPassword) {
//       toast.error("New password and confirm password do not match.");
//       return;
//     }

//     try {
//       const response = await axios.post('/auth/check-email', { email: formData.email });
//       if (!response.data.unique) {
//         toast.error("Email is already in use.");
//         return;
//       }
//       toast.success("Profile updated successfully.");
//     } catch (error) {
//       console.error('Error:', error);
//       toast.error("Failed to update profile.");
//     }
//   };

//   return (
//     <div className="App">
//       <Router />
//       <ToastContainer hideProgressBar={true} newestOnTop={true} />
//       <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css" rel="stylesheet" />
//       <div class="container bootstrap snippets bootdeys">
//         <div class="row">
//           <div class="col-xs-12 col-sm-9">
//             <form class="form-horizontal">
//               <div class="panel panel-default">
//                 <div class="panel-body text-center">
//                   <img src="https://bootdey.com/img/Content/avatar/avatar6.png" class="img-circle profile-avatar" alt="User avatar" />
//                 </div>
//               </div>
//               <div class="panel panel-default">
//                 <div class="panel-heading">
//                   <h4 class="panel-title">User info</h4>
//                 </div>
//                 <div class="panel-body">
//                   <div class="form-group">
//                     <label class="col-sm-2 control-label">Username</label>
//                     <div class="col-sm-10">
//                       <input type="text" class="form-control" />
//                     </div>
//                   </div>
//                   <div class="form-group">
//                     <label class="col-sm-2 control-label">Last name</label>
//                     <div class="col-sm-10">
//                       <input type="text" class="form-control" />
//                     </div>
//                   </div>
//                   <div class="form-group">
//                     <label class="col-sm-2 control-label">First name</label>
//                     <div class="col-sm-10">
//                       <input type="text" class="form-control" />
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div class="panel panel-default">
//                 <div class="panel-heading">
//                   <h4 class="panel-title">Contact info</h4>
//                 </div>
//                 <div class="panel-body">
//                   <div class="form-group">
//                     <label class="col-sm-2 control-label">Mobile number</label>
//                     <div class="col-sm-10">
//                       <input type="tel" class="form-control" />
//                     </div>
//                   </div>
//                   <div class="form-group">
//                     <label class="col-sm-2 control-label">E-mail address</label>
//                     <div class="col-sm-10">
//                       <input type="email" class="form-control" />
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div class="panel panel-default">
//                 <div class="panel-heading">
//                   <h4 class="panel-title">Security</h4>
//                 </div>
//                 <div class="panel-body">
//                   <div class="form-group">
//                     <label class="col-sm-2 control-label">Current password</label>
//                     <div class="col-sm-10">
//                       <input type="password" class="form-control" />
//                     </div>
//                   </div>
//                   <div class="form-group">
//                     <label class="col-sm-2 control-label">New password</label>
//                     <div class="col-sm-10">
//                       <input type="password" class="form-control" />
//                     </div>
//                   </div>
//                   <div class="form-group">
//                     <label class="col-sm-2 control-label">Confirm password</label>
//                     <div class="col-sm-10">
//                       <input type="password" class="form-control" />
//                     </div>
//                   </div>
//                   <div class="form-group">
//                     <div class="col-sm-10 col-sm-offset-2">
//                       <button type="submit" class="btn btn-primary">Submit</button>
//                       <button type="reset" class="btn btn-default">Cancel</button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default App;
