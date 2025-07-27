import React from "react";
import { Button } from "./ui/button";
import { Mail, Phone, MapPin, Instagram } from "lucide-react";

const ContactForm = () => {
  const mailtoLink = `mailto:Shabnam.Rumpf@ecovibe.com?subject=Ecovibe: Exploring a Remodel – Let's Talk&body=Hi EcoVibe Team,%0D%0A%0D%0AI'm interested in exploring a potential remodel project and would love to learn more about your approach. I'm just gathering ideas and thought it would be great to connect.%0D%0A%0D%0AProject Overview:%0D%0A   Type of Space: %0D%0A   Timeline:%0D%0A   Budget Range:%0D%0A   Additional Notes:%0D%0A%0D%0AContact Preferences:%0D%0A   Contact preferred by (phone, email, or text): %0D%0A   Best time to reach me:%0D%0A   Mobile phone number (optional):%0D%0A%0D%0ALooking forward to hearing from you!`;

  return (
    <div className="bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold mb-4">Get In Touch</h3>
          <p className="text-gray-600 mb-6">
            Ready to transform your space? Contact us today to schedule a
            consultation and explore your project possibilities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="text-center">
            <div className="flex justify-center mb-3">
              <Phone className="h-8 w-8 text-gray-700" />
            </div>
            <p className="font-medium mb-1">Phone</p>
            <a
              href="tel:+13522142078"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              (352) 214-2078
            </a>
          </div>

          <div className="text-center">
            <div className="flex justify-center mb-3">
              <Mail className="h-8 w-8 text-gray-700" />
            </div>
            <p className="font-medium mb-1">Email</p>
            <a
              href={mailtoLink}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Shabnam.Rumpf@ecovibe.com
            </a>
          </div>

          <div className="text-center">
            <div className="flex justify-center mb-3">
              <MapPin className="h-8 w-8 text-gray-700" />
            </div>
            <p className="font-medium mb-1">Service Area</p>
            <p className="text-gray-600">Florida & Surrounding Areas</p>
          </div>

          <div className="text-center">
            <div className="flex justify-center mb-3">
              <Instagram className="h-8 w-8 text-gray-700" />
            </div>
            <p className="font-medium mb-1">Follow Us</p>
            <a
              href="https://www.instagram.com/ecovibe.design/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              @ecovibe.design
            </a>
          </div>
        </div>

        <div className="text-center">
          <div className="bg-gray-50 rounded-lg p-8 mb-6">
            <h4 className="text-xl font-semibold mb-3">
              Ready to Start Your Project?
            </h4>
            <p className="text-gray-600 mb-6">
              Click below to send us an email with your project details. We'll
              get back to you within 24 hours to schedule your complimentary
              consultation.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 text-lg"
            >
              <a href={mailtoLink}>
                <Mail className="h-5 w-5 mr-2" />
                Send Us an Email
              </a>
            </Button>
          </div>

          <p className="text-sm text-gray-500">
            Your email program will open with a pre-filled message template. No
            data is stored on our website.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
