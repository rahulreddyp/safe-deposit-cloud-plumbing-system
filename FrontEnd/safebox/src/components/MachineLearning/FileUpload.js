// Author - Rahul Reddy Puchakayala
import React from 'react';
import Lex from "../Lex/Lex";

class FileUpload extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            selectedFile: null,
            success: false
          }

        this.onChangeHandler = this.onChangeHandler.bind(this);  
        this.handleSubmit = this.handleSubmit.bind(this);
      }

      onChangeHandler = event => {
        this.setState({
          selectedFile: event.target.files[0]
        })
      }
      
      handleSubmit = event => {
    
        event.preventDefault();
        let formData = new FormData();      
        
        formData.append('file', this.state.selectedFile)

        // Testing
        // localStorage.setItem('userID','213hhjjn98');
        // localStorage.setItem('boxID', '1234-5fq2-6gdgd');
        
        const userID = localStorage.getItem('userID');
        const boxID = localStorage.getItem('boxID');
        formData.append('userID', userID)
        formData.append('boxID', boxID)

        // call the backend service
        fetch(
            'http://localhost:3000/api/fileUpload',
            {
                mode: 'no-cors',
                method: 'POST',
                body:  formData,
            }
        )
        .then((response) => response)
        .then((data) => {
            console.log('Successfully uploaded image to cloud storage:', data);
            this.setState({success:true})
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    };

    successMessage = () => {
        return (
          <div className="row">
            <div className="col-md-6 offset-sm-3 text-left">
              <div
                className="alert alert-success"
                style={{ display: this.state.success ? "" : "none" }}
              >
                The image has been uploaded Successfully! </div>
            </div>
          </div>
        );
      };
    

	render() {  
    return  (<div className="row">
                {this.successMessage()}                
                <div className="container-fluid">
                         
                    <div className="jumbotron text-center">
                    <h2 className="display-4">SafeBox - Upload Image to Box </h2> 
                        <h3>Hey user {localStorage.getItem('userID')} </h3>
                        <p>Box: {localStorage.getItem('boxID')}</p> 
                    </div>
                </div>
               
                <div className="row section-box ">
    
                <form onSubmit={this.handleSubmit} id="upload-form">
                     <div className="col-md-6 offset-sm-3">
                        <div className="form-group">
                                <label htmlFor="file" className="text-dark">Select Image: </label>
                                </div>
                                <div className="col-md-6 offset-sm-3">
                                <input type="file" name="file" onChange={this.onChangeHandler} />            
                                </div>
                        </div>
                        <div className="col-md-6 offset-sm-3">     
                            <button type="submit"  className="btn btn-success" value="Upload">Upload </button>
                        </div>  
                </form>
                </div>
                <Lex></Lex>
            </div>)
    }
}

export default FileUpload;
