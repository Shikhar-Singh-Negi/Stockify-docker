import React, { useState } from 'react';
import { FaArrowRightLong, FaPlus, FaMinus } from "react-icons/fa6";
import Navbar from '../Components/Navbar';
import Footer from "../Components/Footer";
import { Link } from 'react-router-dom';
import axiosInstance from '../lib/axios';

function HomePage() {
  const [arrowShow, setArrowShow] = useState(false);
  const [openFAQ, setOpenFAQ] = useState(null);

  const [companyDetails, setCompanyDetails] = useState({ name: '', email: '', message: '' });
  const [formStatus, setFormStatus] = useState(null);

  const handleButtonHover = () => {
    setArrowShow(true);
  };

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const handleFormChange = (e) => {
    setCompanyDetails({ ...companyDetails, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('submitting');
    try {
      const content = `Partnership Request from ${companyDetails.name} (${companyDetails.email}): ${companyDetails.message || 'No additional message'}`;
      await axiosInstance.post('/notification/createNotification', {
        name: content,
        type: 'Partnership Request'
      });
      setFormStatus('success');
      setCompanyDetails({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Error submitting form:', error);
      setFormStatus('error');
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 text-indigo-900 overflow-hidden'>
      <Navbar />



      <div className="pt-10 min-h-screen flex flex-col items-center p-6 relative">
        <div className="absolute inset-0 opacity-30 animate-gradient">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-100/40 to-purple-100/40"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-blue-100/40 to-teal-100/40"></div>
        </div>

        <div className="max-w-6xl w-full relative z-10 mt-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="text-left">
            <h1 className='text-lg text-indigo-600 mb-6 animate-pulse font-semibold'>✧ Work Smarter, Grow Faster</h1>
            <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-600 leading-tight">
              Inventory That Works Smarter, Not Harder
            </h1>
            <p className="text-xl text-gray-700 mb-8 max-w-lg">
              A modern inventory platform built to adapt with your business—combining clarity, speed, and powerful automation in one place.
            </p>
          </div>

          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl p-8 text-left shadow-lg text-white w-full max-w-md mx-auto relative z-10">
            <h2 className="text-2xl font-bold mb-2">Want to work with us?</h2>
            <p className="text-indigo-100 mb-6">Leave your details below and our management team will reach out to discuss partnership opportunities.</p>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-indigo-50">Company Name</label>
                <input required type="text" name="name" value={companyDetails.name} onChange={handleFormChange} className="w-full px-4 py-2 rounded-lg bg-indigo-900/40 border border-indigo-400 text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-white" placeholder="Enter your company name" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-indigo-50">Email Address</label>
                <input required type="email" name="email" value={companyDetails.email} onChange={handleFormChange} className="w-full px-4 py-2 rounded-lg bg-indigo-900/40 border border-indigo-400 text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-white" placeholder="contact@company.com" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-indigo-50">Message (Optional)</label>
                <textarea name="message" value={companyDetails.message} onChange={handleFormChange} rows="3" className="w-full px-4 py-2 rounded-lg bg-indigo-900/40 border border-indigo-400 text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-white" placeholder="How would you like to collaborate?"></textarea>
              </div>
              <button disabled={formStatus === 'submitting'} type="submit" className="w-full py-3 bg-white text-indigo-600 font-bold rounded-lg hover:bg-indigo-50 transition-colors disabled:opacity-70">
                {formStatus === 'submitting' ? 'Sending...' : 'Submit Partnership Request'}
              </button>
              {formStatus === 'success' && <p className="text-green-300 text-sm mt-2 text-center">Request sent successfully! We will contact you soon.</p>}
              {formStatus === 'error' && <p className="text-red-300 text-sm mt-2 text-center">There was an error sending your request. Please try again.</p>}
            </form>
          </div>
        </div>

        <div className="w-full max-w-4xl relative z-10 text-center">
          <hr className='border-t border-indigo-200 mt-10 mb-16' />

          <div className="mb-16">
            <h2 className="text-3xl font-bold text-indigo-700 mb-8">Our Trusted Partners</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { name: "TechCorp", role: "Cloud Infrastructure", description: "Providing highly scalable and secure cloud infrastructure to ensure our platform is always online and ready." },
                { name: "LogiFast", role: "Global Logistics", description: "Enabling lightning-fast delivery networks and real-time shipment tracking worldwide." },
                { name: "DataSecure", role: "Cybersecurity", description: "Ensuring top-tier end-to-end encryption and enterprise-level threat protection for all your data." },
                { name: "FinEdge", role: "Financial Processing", description: "Powering seamless and secure payment gateways for global transactions with minimal fees." }
              ].map((partner, idx) => (
                <div key={idx} className="bg-white rounded-xl shadow-sm border border-indigo-100 p-6 flex flex-col items-center justify-start hover:shadow-md transition-all">
                  <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-4 text-indigo-500 font-bold text-xl flex-shrink-0">
                    {partner.name[0]}
                  </div>
                  <h3 className="font-semibold text-indigo-900 text-lg mb-1">{partner.name}</h3>
                  <p className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-3">{partner.role}</p>
                  <p className="text-sm text-gray-600 leading-relaxed text-center">{partner.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-16 bg-white/60 p-8 rounded-2xl shadow-sm border border-indigo-100 italic text-xl text-indigo-800 relative text-center max-w-3xl mx-auto">
            <span className="absolute top-4 left-4 text-4xl text-indigo-300 opacity-50">"</span>
            <p className="relative z-10 px-6">
              Our mission is to empower businesses with seamless, data-driven inventory solutions that scale gracefully with your ambitions. Realize the future of unified commerce through innovation, reliability, and unparalleled partnership.
            </p>
            <span className="absolute bottom-[-10px] right-6 text-4xl text-indigo-300 opacity-50">"</span>
          </div>

          <hr className='border-t border-indigo-200 mt-10 mb-10' />

          <div className="max-w-2xl mt-16 mx-auto text-left mb-12">
            <h2 className="text-3xl font-bold text-indigo-700 mb-6">Frequently Asked Questions</h2>
            {[
              { question: "What is this platform about?", answer: "Our platform provides AI-driven inventory management and CRM solutions designed to streamline business operations and enhance productivity." },
              { question: "Is there a free trial available?", answer: "Yes! We offer a 14-day free trial with full access to all features." },
              { question: "Can I integrate this with other tools?", answer: "Absolutely! Our platform supports integration with various third-party tools, including ERP systems and payment gateways." }
            ].map((faq, index) => (
              <div key={index} className="mb-4 border-b border-indigo-100 pb-4">
                <button className="flex items-center justify-between w-full text-lg font-semibold text-indigo-700 hover:text-indigo-900 transition-colors" onClick={() => toggleFAQ(index)}>
                  {faq.question}
                  {openFAQ === index ? <FaMinus className="text-indigo-500" /> : <FaPlus className="text-indigo-500" />}
                </button>
                {openFAQ === index && <p className="text-gray-600 mt-2">{faq.answer}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default HomePage;