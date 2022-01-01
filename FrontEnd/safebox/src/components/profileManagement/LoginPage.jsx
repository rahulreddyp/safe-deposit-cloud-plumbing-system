// Author -Sri Sai Bhargav Nuthakki
import '../../stylesheets/LoginPage.css'
import React from 'react';
import Axios from 'axios';
// import { Redirect } from 'react-router';
import HomePage from '../HomePage/HomePage'
import Lex from '../Lex/Lex'


class LoginPage extends React.Component {

   constructor(props) {
      super(props);
      // const question = Math.random().toString(36).substring(2, 7);
      this.handleChange = this.handleChange.bind(this);
      this.SubmitUserLogin = this.SubmitUserLogin.bind(this);
      this.state = {
         fields: {},
         errors: {},

      }
   };

   handleChange = (e) => {
      let fields = this.state.fields;
      fields[e.target.name] = e.target.value;
      this.setState({
         fields
      });

   }

   SubmitUserLogin = (e) => {
      e.preventDefault();
      if (this.validateForm()) {
         Axios.post('https://us-central1-serverless-328701.cloudfunctions.net/app/login', {
            email: this.state.fields.Email,
            password: this.state.fields.Password,
            questionOne:"Your favourite vehicle?",
            questionTwo:"Your favourite food?",
            answerOne: this.state.fields.answerOne,
            answerTwo: this.state.fields.answerTwo,
            cQuestion:"abcd",
            CipherKey:this.state.fields.CipherKey,
            cAnswer: this.state.fields.CipherAnswer
         }).then((response) => {
            
            let result = response.status;
        
            if (result === 200){
               
               // alert("BoxID: "+response.data.boxID)
               // alert("UserID: "+response.data.userId)
               alert("Login Successfull!!")
               sessionStorage.setItem("boxID",response.data.boxID)
               sessionStorage.setItem("userID",response.data.userId)
               localStorage.setItem("boxID",response.data.boxID)
               localStorage.setItem("userID",response.data.userId)
               window.location = '/';
               
              
             
            }
            

         })
      }
   }

   validateForm = () => {

      let fields = this.state.fields;
      let errors = {};
      let formIsValid = true;

      if (!fields["Email"]) {
         formIsValid = false;
         errors["Email"] = "Please enter your Email!!";
      }

      if (!fields["Password"]) {
         formIsValid = false;
         errors["Password"] = "Please enter your Password!!";
      }


      this.setState({
         errors: errors
      });
      return formIsValid;
   }

 

   render() {
      return (
         <section>
            
            <HomePage></HomePage>

            <section class="overlay">
            </section>

            <form method="post" class="login" name="LoginPage" onSubmit={this.SubmitUserLogin}>
               <h2 id="loginTableName">User Login</h2>
               <div>
                  <table class="loginTable">
                     <tr class="Email">
                        <th id="loginfeildName">Email</th>
                        <td className="loginfeildAlign">
                           <input type="text" id="loginfeildValue" name="Email" value={this.state.fields.Email} onChange={this.handleChange} placeholder="Enter Email" />
                           <section className="errorMsg">{this.state.errors.Email}</section>
                        </td>
                     </tr>

                     <tr class="Password">
                        <th id="loginfeildName">Password</th>
                        <td className="loginfeildAlign">
                           <input type="password" id="loginfeildValue" name="Password" value={this.state.fields.Password} onChange={this.handleChange} placeholder="Enter Password" />
                           <section className="errorMsg">{this.state.errors.Password}</section>
                        </td>
                     </tr>

                     <tr class="SecurityQuestionOne">
                     <th id="feildName">Security Question 1</th>
                     <td className="feildAlign">
                        <b>Your favourite vehicle?</b>
                     </td>
                     </tr>

                     <tr class="answerOne">
                     <th id="feildName">Security Answer 1</th>
                     <td className="feildAlign">
                        <input type="text" id="feildValue" name="answerOne" value={this.state.fields.answerOne} onChange={this.handleChange} />
                        <section className="errorMsg">{this.state.errors.answerOne}</section>
                     </td>
                     </tr>

                     <tr class="SecurityQuestionTwo">
                     <th id="feildName">Security Question 2</th>
                     <td className="feildAlign">
                        <b>Your favourite food?</b>
                     </td>
                     </tr>

                     <tr class="answerTwo">
                     <th id="feildName">Security Answer 2</th>
                     <td className="feildAlign">
                        <input type="text" id="feildValue" name="answerTwo" value={this.state.fields.answerTwo} onChange={this.handleChange} />
                        <section className="errorMsg">{this.state.errors.answerTwo}</section>
                     </td>
                     </tr>

                     <tr class="Cipher">
                        <th id="loginfeildName">Cipher Question</th>
                        <td className="loginfeildAlign">
                           <input type="text" id="loginfeildValue" name="CipherQuestion" value= "abcd" />
                        </td>
                     </tr>
                     <tr class="CipherKey">
                        <th id="loginfeildName">Enter a key to the cipher</th>
                        <td className="loginfeildAlign">
                           <input type="text" id="loginfeildValue" name="CipherKey" value={this.state.fields.CipherKey} onChange={this.handleChange} placeholder="Enter Cipher Key" />
                           <section className="errorMsg">{this.state.errors.CipherKey}</section>
                        </td>
                     </tr>

                     <tr class="CipherAnswer">
                        <th id="loginfeildName">Enter Cipher Answer with right shift</th>
                        <td className="loginfeildAlign">
                           <input type="text" id="loginfeildValue" name="CipherAnswer" value={this.state.fields.CipherAnswer} onChange={this.handleChange} placeholder="Enter Cipher Answer" />
                           <section className="errorMsg">{this.state.errors.CipherAnswer}</section>
                        </td>
                     </tr>


                  </table>
               </div>
               <div class="submit">
                  <input id="login" type="submit" className="button" value="Login" />
                  <button id="signup"><a id="anchor" href="/RegistrationPage">Create Account</a></button>
               </div>
               <a id="forget" href="/ForgetPassword">Forget Password?</a>

            </form>
            <Lex></Lex>
         </section>



      )
   }
}
export default LoginPage;