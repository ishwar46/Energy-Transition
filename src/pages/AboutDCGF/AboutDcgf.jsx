import React from "react";
import "../../css/animations.css";
import Navbar from "../../components/Navbar";
import visionIcon from "../../assets/images/vision.png";
import missionIcon from "../../assets/images/target.png";
import objectivesIcon from "../../assets/images/objective.png";
import Footer from "../../components/Footer";
import useDocumentTitle from "../../components/DocTitle";
import logo from "../../assets/acsic.png";

const AboutDcgf = () => {
  useDocumentTitle("About DCGF - International Youth Camp 2025");

  return (
    <>
      <Navbar />
      <div className="relative container mx-auto px-4 mt-10 mb-10">
        <div
          className="absolute inset-0 flex justify-center items-center opacity-10 z-0"
          style={{
            backgroundImage: `url(${logo})`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundSize: "contain",
            opacity: 0.1,
          }}
        ></div>
        <div
          className="relative z-10 text-3xl font-bold text-blue-800 pt-5 text-center mb-10"
          style={{ animation: "fadeIn 1s ease-out" }}
        >
          DEPOSIT & CREDIT GUARANTEE FUND (DCGF) NEPAL
        </div>
        <p
          className="relative z-10 text-lg text-gray-700 text-center mx-auto mb-10"
          style={{
            maxWidth: "800px",
            animation: "slideUp 0.8s ease-out forwards",
          }}
        >
          Deposit and Credit Guarantee Fund (DCGF) was established on September
          20, 1974, initially under the name Credit Guarantee Corporation. It
          was later renamed to its current title following the enactment of the
          Deposit and Credit Guarantee Fund Act in 2017. Initially focused on
          priority sector lending, DCGF has since broadened its scope, currently
          playing a pivotal role in both deposit and credit guarantee services
          aimed at fostering economic development. DCGF actively supports banks
          and financial institutions by offering various credit guarantee
          schemes, ensuring a secure investment environment across diverse
          sectors.
        </p>
        <div className="grid md:grid-cols-3 gap-8 text-center relative z-10">
          {/* Vision Card */}
          <div className="bg-white rounded-lg shadow-lg p-4 transform transition-transform duration-300 hover:scale-105">
            <img
              src={visionIcon}
              alt="Vision"
              className="h-12 w-12 mx-auto mb-2"
            />
            <h3 className="text-xl font-semibold text-green-800">VISION</h3>
            <p className="text-gray-700">
              Be a reliable guarantee service institution.
            </p>
          </div>
          {/* Mission Card */}
          <div className="bg-white rounded-lg shadow-lg p-4 transform transition-transform duration-300 hover:scale-105">
            <img
              src={missionIcon}
              alt="Mission"
              className="h-12 w-12 mx-auto mb-2"
            />
            <h3 className="text-xl font-semibold text-green-800">MISSION</h3>
            <p className="text-gray-700">
              Promote trust towards banking and financial system by securing
              public deposits and institutional credits to targeted strata and
              sector.
            </p>
          </div>
          {/* Objectives Card */}
          <div className="bg-white rounded-lg shadow-lg p-4 transform transition-transform duration-300 hover:scale-105">
            <img
              src={objectivesIcon}
              alt="Objectives"
              className="h-12 w-12 mx-auto mb-2"
            />
            <h3 className="text-xl font-semibold text-green-800">OBJECTIVES</h3>
            <ul className="text-gray-700 text-left list-disc pl-8">
              <li>To secure public deposits and institutional credits.</li>
              <li>
                To safeguard and conserve economic wellbeing of the general
                public.
              </li>
              <li>To strengthen the guarantee funds.</li>
            </ul>
          </div>
        </div>

        <div className="text-center mt-10 relative z-10">
          <a
            href="https://dcgf.gov.np/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block py-2 px-4 bg-green-800 text-white rounded hover:bg-blue-900 transition-colors cursor-pointer text-lg"
          >
            Learn more about DCGF
          </a>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AboutDcgf;
