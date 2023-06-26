import React from 'react'
import Header from './Header';
import FooterSection from './FooterSection';

const Layout = ({children}) => {
  return (
    <div>
        <Header/>
        <main style={{ minHeight:'70vh' }}> {children} </main>
        <FooterSection/>
    </div>
  );
};

export default Layout;