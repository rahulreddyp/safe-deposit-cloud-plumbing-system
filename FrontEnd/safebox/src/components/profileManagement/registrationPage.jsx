// Author -Sri Sai Bhargav Nuthakki
import React, { Component } from 'react';
import '../../stylesheets/registrationPage.css';
import Axios from 'axios';
import HomePage from '../HomePage/HomePage'
import Lex from '../Lex/Lex'



class RegistrationPage extends React.Component {
  
  constructor(props) {
    
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.SubmitUserRegistrationForm = this.SubmitUserRegistrationForm.bind(this);
    this.state = {
      fields: {},
      errors: {}
    }
  };


  handleChange = (e) => {
    let fields = this.state.fields;
    fields[e.target.name] = e.target.value;
    this.setState({
      fields
    });
  }

  SubmitUserRegistrationForm = (e) => {
    e.preventDefault();
    const deposit = 5000
    if (this.validateForm()) {
      Axios.post('https://us-central1-serverless-328701.cloudfunctions.net/app/userCreate', {
        email: this.state.fields.email,
        password: this.state.fields.password,
        ConfirmPassword: this.state.fields.ConfirmPassword,
        questionOne:"Your favourite vehicle?",
        questionTwo:"Your favourite food?",
        answerOne: this.state.fields.answerOne,
        answerTwo: this.state.fields.answerTwo,
        safeDeposit: deposit


      }).then((response) => {
        alert(response.data.message)

        let result = response.status
        if (result == 200) {
          alert("Account Creation Successfull !!");

        }
        else{
          alert("Account creation unsuccessfull. Please try again!")
        }


      // }).catch(function (error) {
      //   alert("Email already Exists!!");
      //   window.location.reload();
      })

      let fields = {};
      fields["password"] = "";
      fields["ConfirmPassword"] = "";
      fields["email"] = "";
      fields["answerOne"] = "";
      fields["answerTwo"] = "";
      this.setState({ fields: fields });
    }
  }



  validateForm = () => {

    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;

    if (!fields["email"]) {
      formIsValid = false;
      errors["email"] = "Please enter your Email!!";
    }

    if (typeof fields["email"] !== "undefined") {
      var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
      if (!pattern.test(fields["email"])) {
        formIsValid = false;
        errors["email"] = "Please enter valid Email!!";
      }
    }

    if (!fields["password"]) {
      formIsValid = false;
      errors["password"] = "Please enter your Password!!";
    }

    if (typeof fields["password"] !== "undefined") {
      if (!fields["password"].match(/^.*(?=.{8,15})(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%&]).*$/)) {
        formIsValid = false;
        errors["password"] = "Please enter secure and strong password!!";
      }
    }

    if (!fields["ConfirmPassword"]) {
      formIsValid = false;
      errors["ConfirmPassword"] = "Please enter your Confirm Password!!";
    }

    if (typeof fields["ConfirmPassword"] !== "undefined") {
      if (!fields["ConfirmPassword"].match(/^.*(?=.{8,})(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%&]).*$/)) {
        formIsValid = false;
        errors["ConfirmPassword"] = "Please enter secure and strong password!!";
      }
    }

    if (fields["password"] !== fields["ConfirmPassword"]) {
      formIsValid = false;
      errors["ConfirmPassword"] = "Passwords did not match!!";
    }

    if (!fields["answerOne"]) {
      formIsValid = false;
      errors["answerOne"] = "Please enter your security answer!!";
    }
    
    if (!fields["answerTwo"]) {
      formIsValid = false;
      errors["answerTwo"] = "Please enter your security answer!!";
    }

    this.setState({
      errors: errors
    });
    return formIsValid;
  }

 

  render() {
    return (
      <section >
        <HomePage></HomePage>
       
        <section class="Page">
        </section>

        <h2 class="title">Registration Form</h2>
        <section class="redirectLogin">
          <p>Already have an account?Click here to <span><a href="/LoginPage"> Login!!</a></span></p>
        </section>
        <form method="post" name="RegistrationForm" onSubmit={this.SubmitUserRegistrationForm}>
          <table class="registrationTable">
            
          <tr class="email">
              <th id="feildName">E-Mail</th>
              <td className="feildAlign">
                <input type="email" id="feildValue" name="email" placeholder="Enter E-mail Id" value={this.state.fields.email} onChange={this.handleChange} />
                <section className="errorMsg">{this.state.errors.email}</section>
              </td>
            </tr>


            <tr class="password">
              <th id="feildName">Password</th>
              <td className="feildAlign">
                <input type="password" id="feildValue" name="password" placeholder="Enter Password" value={this.state.fields.password} onChange={this.handleChange} /> (Enter between 8 to 15 characters)
                <section className="errorMsg">{this.state.errors.password}</section>
              </td>
            </tr>

            <tr class="ConfirmPassword">
              <th id="feildName">Confirm Password</th>
              <td className="feildAlign">
                <input type="password" id="feildValue" name="ConfirmPassword" placeholder="Re-enter Password" value={this.state.fields.ConfirmPassword} onChange={this.handleChange} />
                <section className="errorMsg">{this.state.errors.ConfirmPassword}</section>
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
              <th id="feildName">Security Question</th>
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

           
            <input type="submit" className="registerButton" value="Register" />
          </table>
        </form>
        <Lex></Lex>
      </section>
    )
  }
}


export default RegistrationPage;