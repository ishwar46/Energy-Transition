import React from "react";
import "../../css/animations.css";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import useDocumentTitle from "../../components/DocTitle";
import chiefGuestImg from "../../assets/images/chiefguest.jpg";

const ChiefGuest = () => {
  useDocumentTitle("Chief Guest - PMJF Lion Balkrishna Burlakoti");

  return (
    <>
      <Navbar />
      <div className="relative mx-auto px-4 sm:px-6 lg:px-8 py-10 max-w-5xl">
        {/* Page Title */}
        <div
          className="text-4xl font-bold text-blue-800 text-center mb-10"
          style={{ animation: "fadeIn 1s ease-out" }}
        >
          Chief Guest
        </div>

        {/* Chief Guest Card */}
        <div
          className="bg-white rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300 p-8"
          style={{ animation: "slideUp 0.8s ease-out forwards" }}
        >
          <div className="flex flex-col lg:flex-row items-center gap-8">
            {/* Image Section */}
            <img
              src={chiefGuestImg}
              alt="PMJF Lion Balkrishna Burlakoti"
              className="h-40 w-40 rounded-full object-cover border-4 border-blue-100 shadow-md"
            />
            {/* VIP Badge */}
            <span className="absolute top-0 right-0 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-bl-lg shadow-md">
              VIP
            </span>

            {/* Text Section */}
            <div>
              <h2 className="text-2xl font-bold text-blue-800 mb-4">
                PMJF Lion Balkrishna Burlakoti
              </h2>
              <p className="text-md font-semibold text-gray-600 mb-4">
                Second Year International Director
                <br />
                Lions International
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Balkrishna Burlakoti from Kathmandu, Nepal, was elected to serve
                a two-year term as an international director of Lions Clubs
                International at the association’s 105th International
                Convention in Boston, Massachusetts, USA, July 7 through July
                11, 2023. Director Burlakoti has more than 30 years of business
                experience in the cashmere and bedding industry. He is currently
                chairman of Pashm Nepal.
              </p>
            </div>
          </div>

          {/* Bio Section */}
          <div className="mt-6">
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              Looking to benefit his community with the leadership skills he’d
              developed as a business owner, he became a Lion in 2008 with the
              Kathmandu Gongabu Lions Club. He has held a number of offices
              within the association including multiple district council
              chairperson and LCIF area leader. He has also served multiple
              times as a Guiding Lion and a Specialty Club Coordinator.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              In recognition of his service to the association, he has received
              numerous awards including multiple International President’s
              Awards and International President’s Leadership Awards. As a
              district governor, Director Burlakoti organized 100 new clubs in
              his district—the largest club extension in Lions history—as well
              as 100 Melvin Jones Fellow contributions. For this incredible
              achievement, he was recognized by Past International President Bob
              Corlew at the 100th International Convention in Chicago. Director
              Burlakoti is a Progressive Melvin Jones Fellow, a second century
              ambassador and major donor.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ChiefGuest;
