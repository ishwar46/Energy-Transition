import React, { useState } from "react";
import "../../css/animations.css";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import useDocumentTitle from "../../components/DocTitle";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import logo from "../../assets/acsic.png"; // Assuming this is your background image

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6 transition-all duration-300">
      <button
        className="w-full flex justify-between items-center text-left px-6 py-4 text-lg font-semibold text-blue-800 hover:bg-blue-100 rounded-lg focus:outline-none transition-colors duration-300"
        onClick={() => setIsOpen(!isOpen)}
      >
        {question}
        <span className="ml-2 text-blue-500">
          {isOpen ? <FaChevronUp size={20} /> : <FaChevronDown size={20} />}
        </span>
      </button>
      <div
        className={`mb-2 px-6 pt-0 text-gray-700 transition-all duration-500 ease-in-out ${
          isOpen ? "max-h-full opacity-100" : "max-h-0 opacity-0"
        } overflow-hidden`}
      >
        {answer}
      </div>
    </div>
  );
};

const AboutFAQs = () => {
  useDocumentTitle("FAQs - ACSIC Conference");

  const faqs = [
    {
      question: "What is the theme of the 36th ACSIC Conference?",
      answer: (
        <span>
          The theme of this year’s conference is{" "}
          <span className="font-bold">
            "Financing Innovations for Economic Growth"
          </span>
          . It will focus on exploring financial innovations that can drive
          economic development in Asia.
        </span>
      ),
    },
    {
      question: "Where and when will the conference take place?",
      answer: `The conference will be held at Soaltee Hotel, Manjaree Garden, Kathmandu, starting from September 20, 2024. The opening ceremony will begin at 4:30 PM.`,
    },
    {
      question: "Who are the key speakers and guests at the conference?",
      answer: (
        <>
          Key guests and speakers include:
          <ul className="list-disc pl-6">
            <li className="font-bold">
              Honorable Deputy Prime Minister & Finance Minister Mr. Bishnu
              Prasad Poudel (Chief Guest)
            </li>
            <li className="font-bold">
              Dr. Ram Prasad Ghimire, Chairperson of DCGF and Secretary at the
              Ministry of Finance
            </li>
            <li className="font-bold">
              Mr. Maha Prasad Adhikari, Governor, Nepal Rastra Bank
            </li>
            <li className="font-bold">
              Other national and international dignitaries from various sectors.
            </li>
          </ul>
        </>
      ),
    },
    {
      question: "What are the main topics of discussion at the conference?",
      answer: (
        <>
          The conference will cover topics such as:
          <ul className="list-disc pl-6">
            <li className="font-bold">
              Financial innovations in banking and financial institutions
            </li>
            <li className="font-bold">
              The role of credit guarantee in economic growth
            </li>
            <li className="font-bold">
              Risk management in financial institutions
            </li>
            <li className="font-bold">
              Regional cooperation in financial stability
            </li>
          </ul>
        </>
      ),
    },
    {
      question: "Is there a dress code for the conference?",
      answer: `Yes, the dress code is business formal for all conference sessions and ceremonies.`,
    },
    {
      question:
        "Will there be excursions or sightseeing activities for delegates?",
      answer: (
        <>
          Yes, there are planned excursions for delegates as well as for
          accompanying participants. Some of the highlighted excursions include:
          <ul className="list-disc pl-6">
            <li className="font-bold">Patan Durbar Square</li>
            <li className="font-bold">Bhaktapur Durbar Square</li>
            <li className="font-bold">Chandragiri Hill</li>
            <li className="font-bold">Swayambhunath Stupa</li>
            <li className="font-bold">Nagarkot</li>
            <li className="font-bold">Thamel</li>
          </ul>
          Details about each excursion will be provided in your welcome packet
          and during the conference.
        </>
      ),
    },
    {
      question:
        "What is the emergency contact information during the conference?",
      answer: (
        <>
          In case of an emergency, please contact:
          <ul className="list-disc pl-6">
            <li className="font-bold">
              Hotel Reception: Soaltee Hotel, +977-1-4273999
            </li>
            <li className="font-bold">
              Contact Person: Ms. Pragya Shrestha - pragya.shrestha@soaltee.com
            </li>
            <li className="font-bold">
              DCGF Secretariats:
              <ul className="list-disc pl-6">
                <li className="font-bold">
                  Mr. Bikrant Acharya - bikrantacharya@dcgf.gov.np
                </li>
                <li className="font-bold">
                  Ms. Ruchi Shrestha - ruchishrestha@dcgf.gov.np
                </li>
              </ul>
            </li>
            <li className="font-bold">
              Secretariat office: secretariat@dcgf.gov.np
            </li>
            <li className="font-bold">Tangal 05, Kathmandu Nepal</li>
            <li className="font-bold">Local Police: 100</li>
            <li className="font-bold">Medical Emergency: 102</li>
            <li className="font-bold">Fire Emergency: 101</li>
          </ul>
        </>
      ),
    },
    {
      question: "How can I get assistance during the conference?",
      answer: `Conference volunteers and the ACSIC Secretariat Team will be available throughout the event to assist you. Look for staff members wearing official conference badges for any questions or help.`,
    },
    {
      question: "Will there be interpretation services available?",
      answer: `Yes, interpretation services will be available for key sessions. Information about the languages supported will be provided during the conference.`,
    },
    {
      question:
        "Can I purchase souvenirs or local goods during the conference?",
      answer: `Yes, there will be opportunities to purchase local handicrafts and souvenirs during the excursions and at specific cultural events. Thamel, Bhaktapur, and Patan are known for their rich selection of traditional goods like pashmina shawls, Tibetan singing bowls, local artwork, and handcrafted jewelry.`,
    },
    {
      question:
        "What COVID-19 precautions are being taken during the conference?",
      answer: `We are following all local health guidelines and protocols to ensure a safe environment for all delegates. Hand sanitizing stations will be available, and masks are recommended in crowded spaces. Please check the latest guidelines from the Ministry of Health, Nepal, and follow any instructions provided during the event.`,
    },
    {
      question: "How can I stay updated on conference announcements?",
      answer: `All important announcements will be made during the conference sessions. You can also check the official conference website, your delegate packet, and the event app (if applicable) for real-time updates and notifications.`,
    },
  ];

  return (
    <>
      <Navbar />
      <div className="relative container mx-auto px-4 mt-12 mb-12">
        {/* Background Image */}
        <div
          className="fixed inset-0 z-0 flex justify-center items-center"
          style={{
            backgroundImage: `url(${logo})`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundSize: "contain",
            opacity: 0.1,
          }}
        ></div>

        {/* FAQ Title */}
        <h1
          className="relative z-10 text-4xl font-bold text-blue-800 text-center mb-16"
          style={{ animation: "fadeIn 1s ease-out" }}
        >
          Frequently Asked Questions (FAQs)
        </h1>

        {/* FAQ Items */}
        <div className="relative z-10 max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AboutFAQs;
