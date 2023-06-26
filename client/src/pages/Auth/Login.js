import React from 'react'
import Layout from '../../components/Layout/Layout'
import '../../styles/AuthStyle.css';

const Login = () => {
  return (
    <Layout title="Login-Smarshop">
        <div className="form-container">
        <form>
            <h4 className="title">Login</h4>
            <div className="mb-3">
                <input type="email" className="form-control" placeholder="Enter Your Email"/>
            </div>
            <div className="mb-3">
                <input type="password" className="form-control" placeholder="Enter Password" />
            </div>
        
            <button type="submit" className="btn btn-primary">Login</button>
            </form>
        </div>
    </Layout>
  )
}

export default Login