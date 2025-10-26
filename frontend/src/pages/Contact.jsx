// src/pages/Contact.jsx
import Header from "../components/header";
import Footer from "../components/Footer";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("Thank you! Your message has been sent.");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <>
        <Header />
    <div
      className="contact-page"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
        padding: "50px 15px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="card p-5 rounded-4"
        style={{
          maxWidth: "600px",
          width: "100%",
          backgroundColor: "rgba(255,255,255,0.75)", // higher transparency
          backdropFilter: "blur(12px)",
          boxShadow: "0 12px 30px rgba(0,0,0,0.25)",
        }}
      >
        <h1 className="text-center mb-4" style={{ color: "#0f2027" }}>
          Contact Us
        </h1>
        <p className="text-center text-muted mb-4">
          Have a question or feedback? Fill out the form below and we'll get back to you.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-control rounded-pill p-3 shadow-sm"
              placeholder="Your Name"
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-control rounded-pill p-3 shadow-sm"
              placeholder="Your Email"
              required
            />
          </div>
          <div className="mb-3">
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="5"
              className="form-control rounded-4 p-3 shadow-sm"
              placeholder="Write your message"
              required
            ></textarea>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="btn btn-primary w-100 py-2 rounded-pill shadow"
          >
            Send Message
          </motion.button>
        </form>

        <div className="text-center mt-4">
          <Link
            to="/"
            className="btn btn-outline-primary rounded-pill px-4 py-2"
          >
            Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
    <Footer />
    </>
  );
}
