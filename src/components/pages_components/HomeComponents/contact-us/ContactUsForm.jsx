"use client";
import GlobalForm from "@/components/common_components/GlobalForm/GlobalForm";
import React from "react";

const contact_form_json = [
  {
    type: "text",
    name: "first_name",
    label: "First Name",
    fullWidth: true,
    xs: 12,
    sm: 6,
    md: 6,
    lg: 6,
    validation_message: "Please enter your First Name",
    required: true,
  },
  {
    type: "text",
    name: "last_name",
    label: "Last Name",
    fullWidth: true,
    xs: 12,
    sm: 6,
    md: 6,
    lg: 6,
    validation_message: "Please enter your Last Name",
    required: true,
  },
  {
    type: "email",
    name: "email",
    label: "Email",
    fullWidth: true,
    xs: 12,
    sm: 12,
    md: 12,
    lg: 12,
    validation_message: "Please enter your Email",
    required: true,
  },
  {
    type: "number",
    name: "phone",
    label: "Phone Number",
    fullWidth: true,
    xs: 12,
    sm: 12,
    md: 12,
    lg: 12,
    validation_message: "Please enter your Phone Number",
    required: true,
  },
  {
    type: "text",
    name: "message",
    label: "Message",
    fullWidth: true,
    xs: 12,
    sm: 12,
    md: 12,
    lg: 12,
    shrink: true,
    rows: 5,
    validation_message: "Please enter your Message",
  },
];

const ContactUsForm = () => {
  const handleContactFormSubmit = (formData) => {
    console.log("Contact Form Submitted: ", formData);
    // Add your form submission logic here
  };

  return (
   
      <GlobalForm
        form_config={contact_form_json}
        on_Submit={handleContactFormSubmit}
      />
    
  );
};

export default ContactUsForm;
