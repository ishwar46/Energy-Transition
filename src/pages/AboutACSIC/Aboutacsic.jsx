import React from "react";
import "../../css/animations.css";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import useDocumentTitle from "../../components/DocTitle";

const AboutAcsic = () => {
  useDocumentTitle("Uranus Event Management");

  return (
    <>
      <Navbar />
      <div className="container px-5 mx-auto mt-10 mb-10">
        <div
          className="text-3xl font-bold text-blue-800 pt-5 text-center mb-5"
          style={{ animation: "fadeIn 1s ease-out" }}
        >
          Asian Credit Supplementation Institution Confederation (ACSIC)
        </div>
        <div
          className="text-2xl font-semibold text-green-800 text-center mb-10"
          style={{ animation: "fadeIn 2s ease-out" }}
        >
          "Empowering Small Businesses Across Asia"
        </div>

        {/* Overview of ACSIC */}
        <section className="p-5 bg-white rounded-lg shadow-lg hover:shadow-2xl transform transition-transform duration-300 hover:scale-105 mb-5 cardSlideUp1">
          <h2 className="text-3xl font-bold text-green-700 mb-3">
            Overview of ACSIC
          </h2>
          <p className="text-black text-lg">
            The Asian Credit Supplementation Institution Confederation, known as
            ACSIC, is the cooperation of Asia’s credit guarantee organizations.
            Established in 1987, ACSIC is Asia’s largest organization designed
            for credit guarantee, participated by 17 credit guarantee
            institutions from 12 Asian countries.
          </p>
        </section>

        {/* Objective of ACSIC */}
        <section className="p-5 bg-white rounded-lg shadow-lg hover:shadow-2xl transform transition-transform duration-300 hover:scale-105 mb-5 cardSlideUp2">
          <h2 className="text-3xl font-bold text-green-700 mt-5 mb-3">
            Objective of ACSIC
          </h2>
          <p className="text-black text-lg">
            The objective of ACSIC is to promote the sound development of the
            credit supplementation system for small businesses in Asian
            countries through the exchange of information, discussions, and
            interchange of personnel among small business credit supplementation
            institutions.
          </p>
        </section>

        {/* Charter of ACSIC */}
        <section className="p-5 bg-white rounded-lg shadow-lg hover:shadow-2xl transform transition-transform duration-300 hover:scale-105 mb-5 cardSlideUp3">
          <h2 className="text-3xl font-bold text-green-700 mt-5 mb-3">
            Charter of ACSIC
          </h2>
          <div className="mb-5 text-black text-lg">
            <strong className="text-blue-800">ARTICLE 1 (NAME)</strong>
            <p className="text-black text-lg">
              This confederation shall be named Asian Credit Supplementation
              Institution Confederation{" "}
              <b>(hereinafter referred to as “ACSIC”)</b>
            </p>
          </div>
          <div className="mb-5 text-black text-lg">
            <strong className="text-blue-800">ARTICLE 2 (OBJECTIVE)</strong>
            <p>
              The objective of ACSIC is to promote the sound development of the
              credit supplementation system for small business in the countries
              including regions <b>(hereinafter referred to as “countries”)</b>{" "}
              of Asia excluding areas to the west and north of Pakistan
              <b> (hereinafter referred to as “Asia”)</b> through exchange of
              information, discussions and interchange of personnel among small
              business credit supplementation institutions{" "}
              <b>(hereinafter referred to as “institution(s)”)</b> in Asia.
            </p>
          </div>
          <div className="mb-5 text-black text-lg">
            <strong className="text-blue-800">ARTICLE 3 (ACTIVITIES)</strong>
            <ul className="list-disc pl-5">
              <li>
                To achieve the objectives set forth in the preceding article,
                ACSIC shall conduct the following activities:
              </li>
              <li>
                Holding meetings for information exchange and discussions for
                the benefit of institutions.
              </li>
              <li>
                Other activities necessary to achieve the objectives set forth
                in the preceding article.
              </li>
            </ul>
          </div>
          <div className="mb-5 text-black text-lg">
            <strong className="text-blue-800">
              ARTICLE 4 (ELIGIBILITY FOR PARTICIPATION)
            </strong>
            <p>Institutions in Asia are eligible for participation in ACSIC.</p>
          </div>
          <div className="mb-5 text-black text-lg">
            <strong className="text-blue-800">ARTICLE 5 (MEETINGS)</strong>
            <ul className="list-disc pl-5">
              <li>
                Meeting referred to in Article 3 Item 1{" "}
                <b>(hereinafter referred to simply as “meeting(s)”)</b> shall be
                held at regular intervals at venues rotating among the countries
                to which institutions belong, unless otherwise decided.
              </li>
              <li>
                The institution sponsoring each meeting{" "}
                <b>(hereinafter referred to as “sponsor”)</b> shall convene,
                preside over and make all necessary preparations for the
                meeting.
              </li>
              <li>
                The sponsor may allow any persons deemed appropriate to
                participate in the meeting as observers and speakers.
              </li>
              <li>
                The country of venue, sponsor, and time of the next meeting
                shall be decided upon at each meeting.
              </li>
            </ul>
          </div>
          <div className="mb-5 text-black text-lg">
            <strong className="text-blue-800">
              ARTICLE 6 (MEETING PROCEDURES)
            </strong>
            <ul className="list-disc pl-5">
              <li>
                The official language of each meeting shall be English and any
                other language deemed appropriate by the sponsor.
              </li>
              <li>
                The chairman of each meeting shall be appointed from among the
                representatives of the sponsor.
              </li>
              <li>
                Resolutions at each meeting shall be made by a majority vote of
                the institutions present, with the chairman casting the deciding
                vote in the event of a tie.
              </li>
              <li>
                Voting shall be made by a show of hands or balloting as the
                chairman deems appropriate.
              </li>
              <li>
                In voting upon resolutions, as described in the preceding
                paragraph, if one country should be represented by more than one
                institution, such institutions shall cast one vote jointly among
                them.
              </li>
              <li>
                After each meeting is closed, the sponsor shall prepare the
                minutes thereof and distribute them to the institutions which
                took part in the meeting and which are deemed to be interested
                in ACSIC activities.
              </li>
            </ul>
          </div>
          <div className="mb-5 text-black text-lg">
            <strong className="text-blue-800">ARTICLE 7 (EXPENSES)</strong>
            <p>
              A sponsor may ask the prospective participants of the meeting to
              share the necessary costs of holding the meeting.
            </p>
          </div>
          <div className="mb-5 text-black text-lg">
            <strong className="text-blue-800">
              ARTICLE 8 (AMENDMENT TO THE CHARTER)
            </strong>
            <p>
              The charter shall be amended by a two-thirds majority at the
              meeting attended by at least half of the countries to which the
              institutions eligible for participating belong.
            </p>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default AboutAcsic;
