import React from 'react'
import Layout from '../../components/Layout/Layout'
import '../../styles/AuthStyle.css';

const Register = () => {
  return (
    <Layout title="Register-Smarshop">
        <div className="form-container">
        <form>
            <h4 className="title">Register Form</h4>
            
            <div className="mb-3">
                <input type="text" className="form-control" placeholder="Enter Your Name"/>
            </div>
            <div className="mb-3">
                <input type="email" className="form-control" placeholder="Enter Your Email"/>
            </div>
            <div className="mb-3">
                <input type="text" className="form-control"  placeholder="Enter Your Address"/>
            </div>
            <div className="mb-3">
                <input type="phone" className="form-control" placeholder="Enter Contact No."/>
            </div>
            <div className="mb-3">
                <input type="password" className="form-control" placeholder="Enter Password" />
            </div>
            <div className="mb-3">
                <input type="password" className="form-control" placeholder="Confirm Password"/>
            </div>
            
            <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    </Layout>
  )
}

export default Register