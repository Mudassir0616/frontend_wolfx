import ContactUsForm from "@/components/pages_components/HomeComponents/contact-us/ContactUsForm";
import React from "react";

const ContactUs = () => {
  return (
    <div className="container">
      <div className="contact-container">
        <div className="contact-illustration">
          <img src="/contact.jpg" alt="image" />
        </div>

        <div className="contact-form">
          <ContactUsForm />
        </div>
      </div>
      <div className="contact-form">
          <ContactUsForm />
        </div>
    </div>
  );
};

export default ContactUs;
