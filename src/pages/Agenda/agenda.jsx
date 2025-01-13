import toast from "react-hot-toast";
import { getOneAgenda, submitAnswer } from "../../apis/Api";
import Navbar from "../../components/Navbar";
import React, { useEffect, useState } from "react";
import institutions from "../../data/acsicmem";
import { useNavigate } from "react-router-dom";
import SuccessDialog from "../../components/SuccessDialog";
import AlertDialog from "../../components/AlertDialog";
import agendaDescription from "../../data/AgendaDescription";
import BoudhaImage from "../../assets/images/boudha.jpeg";
import CDM_Questionnaire_Result from "../../assets/ACSIC_36_CDM Questionnaire _Detailed_Report_Final.pdf";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";

const Agenda = () => {
  const [agendaData, setAgendaData] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [disagreeReasons, setDisagreeReasons] = useState({});
  const [otherReasons, setOtherReasons] = useState({});
  const [institution, setInstitution] = useState("");
  const [institutionError, setInstitutionError] = useState("");
  const [otherInstitution, setOtherInstitution] = useState("");
  const [chiefDelegateName, setChiefDelegateName] = useState("");
  const [chiefDelegatePosition, setChiefDelegatePosition] = useState("");
  const [chiefDelegateEmailAddress, setChiefDelegateEmailAddress] =
    useState("");
  const [chiefDelegateNameError, setChiefDelegateNameError] = useState("");
  const [chiefDelegatePositionError, setChiefDelegatePositionError] =
    useState("");
  const [chiefDelegateEmailAddressError, setChiefDelegateEmailAddressError] =
    useState("");
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const navigate = useNavigate();

  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [alertDialogTitle, setAlertDialogTitle] = useState("");
  const [alertDialogDescription, setAlertDialogDescription] = useState("");

  const showAlert = (title, description) => {
    setAlertDialogTitle(title);
    setAlertDialogDescription(description);
    setAlertDialogOpen(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getOneAgenda();
        if (response.data && response.data.agenda) {
          setAgendaData(response.data.agenda);
        }
      } catch (error) {
        console.error("Error Fetching Agendas:", error);
      }
    };
    fetchData();
  }, []);

  const validateInstitution = (selectedInstitution) => {
    if (selectedInstitution === "") {
      setInstitutionError("Institution name is required.");
    } else {
      setInstitutionError("");
    }
  };

  const changeInstitution = (event) => {
    const selectedInstitution = event.target.value;
    setInstitution(selectedInstitution);

    if (selectedInstitution === "other") {
      setInstitutionError("");
      setOtherInstitution("");
    } else {
      setInstitutionError("");
      setOtherInstitution("");
    }
    validateInstitution(selectedInstitution);
  };

  const handleOptionChange = (qId, option) => {
    setSelectedOptions((prevState) => ({
      ...prevState,
      [qId]: option,
    }));
  };

  const handleDisagreeReasonChange = (qId, reason) => {
    setDisagreeReasons((prevState) => ({
      ...prevState,
      [qId]: reason,
    }));
  };

  const handleOtherReasonChange = (qId, reason) => {
    setOtherReasons((prevState) => ({
      ...prevState,
      [qId]: reason,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      institution === "" ||
      (institution === "other" && otherInstitution === "")
    ) {
      setInstitutionError("Institution name is required.");
      showAlert("Error", "Institution name is required.");
      return;
    } else {
      setInstitutionError("");
    }

    if (chiefDelegateName === "") {
      setChiefDelegateNameError("Chief Delegate's name is required");
      showAlert("Validation Error", "Chief Delegate's name is required.");
      return;
    } else {
      setChiefDelegateNameError("");
    }

    if (chiefDelegatePosition === "") {
      setChiefDelegatePositionError("Chief Delegate's position is required");
      showAlert("Validation Error", "Chief Delegate's position is required.");
      return;
    } else {
      setChiefDelegatePositionError("");
    }

    if (chiefDelegateEmailAddress === "") {
      setChiefDelegateEmailAddressError(
        "Chief Delegate's email address is required"
      );
      showAlert(
        "Validation Error",
        "Chief Delegate's email address is required."
      );
      return;
    } else {
      setChiefDelegateEmailAddressError("");
    }

    const unansweredQuestions = agendaData.questions.filter(
      (question) => !selectedOptions[question.question]
    );
    if (unansweredQuestions.length > 0) {
      showAlert("Validation Error", "Please tick all options");
      return;
    }

    const answers = Object.keys(selectedOptions).map((qId) => ({
      question: qId,
      description: agendaData.questions.find((q) => q.question === qId)
        .description,
      options: agendaData.questions.find((q) => q.question === qId).options,
      userAnswer: selectedOptions[qId],
      disagreeReason: disagreeReasons[qId] || "",
      othersReason: otherReasons[qId] || "",
    }));

    const data = {
      nameofInstitution:
        institution === "other" ? otherInstitution : institution,
      chiefDelegateName,
      chiefDelegatePosition,
      chiefDelegateEmailAddress,
      answers,
    };

    try {
      const response = await submitAnswer(data);
      let errorMsg = response.data ? response.data.message : "Unknown error";
      if (response.data && response.data.success) {
        toast.success("Answer Submitted Successfully");
        setSuccessDialogOpen(true);
      } else {
        showAlert("Error", "Error submitting answers: " + errorMsg);
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        showAlert("Error", "This institution already exists");
      } else {
        showAlert("Error", "Error submitting answers: " + error.message);
      }
    }
  };

  const handleEmailClick = () => {
    window.location.href = "mailto:secretariat@dcgf.gov.np";
  };

  return (
    <>
      <Navbar />
      <div
        className="container mx-auto shadow-xl w-full py-5 px-6 rounded overflow-hidden bg-white"
        style={{ animation: "fadeIn 1s ease-out" }}
      >
        <div className="text-center">
          <h1 className="text-3xl font-bold text-blue-800">
            Tentative CDM Questionnaire
          </h1>
          <p className="text-lg font-bold text-green-800 mt-2">
            The 36th ACSIC Conference Chief Delegates Meetings Agenda
            Questionnaire
          </p>
          <div className="text-sm font-bold text-red-800 mt-2 flex items-center justify-center w-full">
            <span>35th ACSIC Conference CDM Questionnaire Result - </span>
            <a
              href={CDM_Questionnaire_Result}
              download
              className="blink-bounce ml-2 inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded flex items-center"
            >
              <FontAwesomeIcon icon={faDownload} />
              <span className="ml-1">Click here to download</span>
            </a>
          </div>

          <img className="mt-4" src={BoudhaImage} alt="Boudha img" />
          <p className="max-w mx-auto mt-5 text-lg text-blue-800">
            Greetings, esteemed ACSIC members!
          </p>
        </div>
        <div className="mt-4 font-semibold text-left">
          <p className="py-2 text-black">
            We cordially invite you to share your valuable insights and opinions
            on the tentative Agenda of the Chief Delegates Meetings (CDM) for
            the upcoming 36th ACSIC Conference. Your feedback is crucial in
            shaping the final agenda for this important gathering. Please take a
            moment to complete this Survey by July 20th, 2024. Your
            participation will ensure that the agenda reflects the collective
            interest and priorities of ACSIC community.
          </p>
          <p className="text-black ">
            If you have any inquiries or concerns, please don’t hesitate to
            reach out to the DCGF secretariat at{" "}
            <a
              className="text-blue-600 mr-2"
              href="mailto:secretariat@dcgf.gov.np"
              onClick={handleEmailClick}
            >
              secretariat@dcgf.gov.np
            </a>
            &{" "}
            <a
              className="text-blue-600 mr-2"
              href="mailto:secretariat@dcgf.gov.np"
              onClick={handleEmailClick}
            >
              secretariat@acsicnepal.com
            </a>
            or{" "}
            <a className="text-blue-600" href="tel:+977014521241">
              +977 01-4521241,
            </a>
            <a className="text-blue-600 px-2" href="tel:+977-9801008765">
              +977-9801008765,
            </a>
            <a className="text-blue-600" href="tel:+977-9860076498">
              +977-9860076498
            </a>
            . We are here to assist you and address any questions you may have.
          </p>
          <p className="text-green-600 mt-2">
            Thank you in advance for your valuable participation. We look
            forward to receiving your feedback and working together to make the
            36th ACSIC Conference a resounding success.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {agendaData ? (
            <div className="" style={{ animation: "fadeIn 1s ease-out" }}>
              <div
                key={agendaData._id}
                className="border-b-2 border-gray-200 py-4"
              >
                <h2 className="text-xl font-bold text-blue-800 mt-8">
                  Section 1
                </h2>
                <p className="text-sm font-semibold text-green-800 mb-5">
                  Personal Information
                </p>
                <div className="">
                  <div className="institution">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name of Institution:{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="institution"
                      value={institution}
                      onChange={changeInstitution}
                      className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-700 mb-2"
                    >
                      <option value="">Choose your institution</option>
                      {institutions.map((institution) => (
                        <option key={institution.id} value={institution.name}>
                          {institution.name}
                        </option>
                      ))}
                    </select>
                    {institutionError && (
                      <p className="text-red-500 text-sm mt-1">
                        {institutionError}
                      </p>
                    )}
                  </div>
                  <div className="mb-2">
                    <input
                      type="text"
                      name="chiefDelegateName"
                      value={chiefDelegateName}
                      onChange={(e) => setChiefDelegateName(e.target.value)}
                      placeholder="Chief Delegate’s Name   *"
                      className=" w-full h-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                    />
                    {chiefDelegateNameError && (
                      <p className="text-red-500 text-sm mt-1">
                        {chiefDelegateNameError}
                      </p>
                    )}
                  </div>
                  <div className="mb-2">
                    <input
                      type="text"
                      name="chiefDelegatePosition"
                      value={chiefDelegatePosition}
                      onChange={(e) => setChiefDelegatePosition(e.target.value)}
                      placeholder="Chief Delegate’s Position    *"
                      className=" w-full h-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                    />
                    {chiefDelegatePositionError && (
                      <p className="text-red-500 text-sm mt-1">
                        {chiefDelegatePositionError}
                      </p>
                    )}
                  </div>
                  <div className="mb-2">
                    <input
                      type="text"
                      name="chiefDelegateEmailAddress"
                      value={chiefDelegateEmailAddress}
                      onChange={(e) =>
                        setChiefDelegateEmailAddress(e.target.value)
                      }
                      placeholder="Chief Delegate’s Email Address   *"
                      className=" w-full h-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                    />
                    {chiefDelegateEmailAddressError && (
                      <p className="text-red-500 text-sm mt-1">
                        {chiefDelegateEmailAddressError}
                      </p>
                    )}
                  </div>
                </div>
                <div className="py-4 mt-2">
                  <h1 className="text-2xl font-bold text-blue-800 text-start">
                    TENTATIVE AGENDA FOR THE CHIEF DELEGATES MEETING (CDM) FOR
                    THE 36TH ACSIC CONFERENCE IN KATHMANDU, NEPAL
                  </h1>
                  <h1 className="text-2xl font-bold text-blue-800 text-start">
                    SEPTEMBER (20-25) 2024
                  </h1>
                  <div className="text-black font-semibold mt-5">
                    <ol className="list-decimal pl-5">
                      {agendaDescription.map((agenda, index) => (
                        <li key={index}>{agenda}</li>
                      ))}
                    </ol>
                  </div>
                </div>
                <h2 className="text-xl font-bold text-blue-800 mt-5">
                  Section 2
                </h2>
                <p className="text-sm font-semibold text-green-800">
                  Tentative CDM Questionnaire
                </p>
                <p className="text-red-600 text-transform: font-semibold text-1xl mt-2">
                  All fields are mandatory*
                </p>
                {agendaData.questions.map((question, qIndex) => (
                  <div key={question._id} className="mt-2">
                    {/* Render Section 3 header before question 6 */}
                    {qIndex === 5 && (
                      <div className="my-4 py-2 text-start">
                        <h2 className="text-xl font-bold text-blue-800">
                          Section 3
                        </h2>
                        <p className="text-sm font-semibold text-green-800">
                          Tentative CDM Special Agenda Questionnaire
                        </p>
                      </div>
                    )}
                    <h3 className="text-lg font-bold text-blue-800">
                      {question.question}
                    </h3>
                    <p className="text-black text-justify">
                      {question.description}
                    </p>
                    {question.question ===
                      "7. Further Discussion on Sustainable Communication Channel for ACSIC Members" && (
                      <>
                        <p className="text-black text-justify py-2">
                          In the 35th ACSIC Conference in Mongolia, the majority
                          expressed agreement with the proposal. Some members,
                          however, indicated a need for further discussion.
                          CGTMSE, India suggested the need for someone to host
                          and manage the Sustainable Communication Channel,
                          volunteering CGTMSE of India to assume this
                          responsibility. CGTMSE agreed to create a plan on how
                          they would host and manage the Sustainable
                          Communication Channel and present it at the Chief
                          Delegates Meeting of the 36th ACSIC Conference. CGFM
                          of Mongolia offered to carry out a survey to determine
                          the kind of information that ACSIC members are willing
                          to exchange through the ACSIC Sustainable
                          Communication Channel.
                        </p>
                      </>
                    )}
                    {question.question ===
                      "7. Further Discussion on Sustainable Communication Channel for ACSIC Members" && (
                      <>
                        <p className="text-black text-justify mt-2">
                          The survey results show that ACSIC member institutions
                          are generally open to sharing a wide range of
                          information. While there are varying comfort levels
                          with specific types of information, the overall
                          willingness to share demonstrates a dedication to
                          cooperation and knowledge exchange. The diversity of
                          preferred communication channels, such as email,
                          website, and ACSIC Conference, suggests that a
                          multi-channel approach could be an effective strategy
                          to facilitate information sharing among ACSIC members.
                          The recommendations from participants, including
                          sharing training resources, real-time updates, and
                          opportunities for collaboration, should be taken into
                          account in the development and implementation of the
                          Sustainable Communication Channel. However, it is
                          crucial to address the concerns raised by participants
                          regarding privacy and confidentiality, as well as the
                          need for clear definitions of requested information.
                          In the above backdrop, the matter needs to be
                          discussed further in the light of the survey result
                          shared by CGFM of Mongolia.
                        </p>
                      </>
                    )}
                    {question.question ===
                      "7. Further Discussion on Sustainable Communication Channel for ACSIC Members" && (
                      <>
                        <p className="text-black text-justify mt-2">
                          In the above backdrop, the matter needs to be
                          discussed further in the light of the survey result
                          shared by CGFM of Mongolia.
                        </p>
                      </>
                    )}
                    {question.question ===
                      "8. Proposed Amendment to the Objective of ACSIC to include Central Asia Geographically" && (
                      <>
                        <p className="text-black text-justify mt-2">
                          Considering the interest shown by OJSC Guarantee Fund
                          of Kyrgyzstan, CGFM of Mongolia proposed amendment to
                          the Article 2 of the ACSIC Charter to geographically
                          expand ACSIC's focus to include Central Asia. CGFM of
                          Mongolia argument was centered around the belief that
                          this inclusion would enable ACSIC to better support
                          small businesses throughout Asia, particularly in
                          Central Asia, thereby contributing to the region's
                          overall economic development.
                        </p>
                        <p className="text-black text-justify py-2">
                          During the 35th ACSIC Conference, CGFM of Mongolia
                          carried out a CDM survey on the proposed amendment. In
                          the 35th CDM meeting in Mongolia, it was noted that
                          the proposal to expand ACSIC's geographical scope to
                          include Central Asia received diverse responses based
                          on the CDM survey. It was informed that CGCC of
                          Cambodia, PT. Askrindo of Indonesia, KOREG and KODIT
                          of Korea, CGFM of Mongolia, DCGF of Nepal, CGC PNG of
                          Papua New Guinea, PHILGUARANTEE of Philippines, CBSL
                          of Sri Lanka expressed support for the suggested
                          amendment. It was further informed that SMEG of Taiwan
                          expressed support but proposed further modifications
                          to the proposal. In contrast, several institutions,
                          including CGTMSE of India, JFC and JFG of Japan, CGC
                          of Malaysia, and TCG of Thailand, expressed the need
                          for additional discussion. Although in agreement with
                          the proposal, KOTEC of Korea also indicated a
                          preference for further conversation. The Chief
                          delegates highlighted the importance of fostering good
                          communication and a positive atmosphere among member
                          institutions. They expressed a desire to initially
                          meet with Central Asian credit guarantee institutions
                          interested in joining ACSIC. Following an assessment
                          of their compatibility with existing members, a
                          decision would then be made on amending the ACSIC
                          objective to include Central Asia geographically. CGFM
                          of Mongolia, as the organizing committee of the 35th
                          ACSIC conference, would facilitate the invitation of
                          Central Asian institutions interested in joining ACSIC
                          to the 36th ACSIC conference in Nepal .In the above
                          backdrop, the matter needs to be discussed further in
                          the light of the survey result shared by CGFM of
                          Mongolia.
                        </p>
                        <p className="text-black mb-2 text-justify">
                          In view of the above, the 36th CDM is proposed to
                          discuss the under noted proposed amendment to the
                          Article 2 of the ACSIC Charter to include Central Asia
                          geographically.
                        </p>
                      </>
                    )}
                    {question.question ===
                      "8. Proposed Amendment to the Objective of ACSIC to include Central Asia Geographically" && (
                      <table className="table-auto w-full mt-2 mb-4">
                        <thead>
                          <tr>
                            <th className=" border px-4 py-2 text-green-700">
                              Existing Article
                            </th>
                            <th className="border px-4 py-2 text-green-700">
                              Proposed Article
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="border px-4 py-2 text-blue-800 text-justify">
                              The objective of ACSIC is to promote the sound
                              development of the credit supplementation system
                              for small businesses in the countries including
                              regions (hereinafter referred to as 'countries')
                              of Asia excluding areas to the west and north of
                              Pakistan (hereinafter referred to as 'Asia')
                              through exchange of information, discussions and
                              interchange of personnel among small business
                              credit supplementation institutions (hereinafter
                              referred to as 'institution(s)') in Asia.
                            </td>
                            <td className="border px-4 py-2 text-blue-800 text-justfy">
                              The objective of ACSIC is to promote the sound
                              development of the credit supplementation system
                              for small business in the countries including
                              regions (hereinafter referred to as 'countries')
                              of Asia,{" "}
                              <b>
                                now expanded to include the Central Asian
                                regions such as Kazakhstan, Kyrgyzstan,
                                Uzbekistan, Tajikistan, and Turkmenistan,{" "}
                              </b>
                              and excluding areas to the west and north of
                              Pakistan (hereinafter referred to as 'Asia')
                              through exchange of information, discussions, and
                              interchange of personnel among small business
                              credit supplementation institutions (hereinafter
                              referred to as 'institution(s)') in Asia.
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    )}
                    <ul className="mt-2">
                      {question?.options?.map((option, oIndex) => (
                        <li key={oIndex} className="flex items-center mt-2">
                          <input
                            type="radio"
                            id={`option_${qIndex}_${oIndex}`}
                            name={`question_${qIndex}`}
                            className="form-radio h-5 w-5 text-blue-500"
                            onChange={() =>
                              handleOptionChange(question.question, option)
                            }
                          />
                          <label
                            htmlFor={`option_${qIndex}_${oIndex}`}
                            className="ml-2 text-gray-800"
                          >
                            {option}
                          </label>
                        </li>
                      ))}
                    </ul>
                    {selectedOptions[question.question] ===
                      "Disagree (Please explain why)" && (
                      <textarea
                        value={disagreeReasons[question.question] || ""}
                        onChange={(e) =>
                          handleDisagreeReasonChange(
                            question.question,
                            e.target.value
                          )
                        }
                        placeholder="Please Specify"
                        className="block w-full px-3 py-2 mt-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                      />
                    )}
                    {selectedOptions[question.question] ===
                      "Others/Suggestions" && (
                      <textarea
                        value={otherReasons[question.question] || ""}
                        onChange={(e) =>
                          handleOtherReasonChange(
                            question.question,
                            e.target.value
                          )
                        }
                        placeholder="Please Specify"
                        className="block w-full px-3 py-2 mt-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                      />
                    )}
                    {selectedOptions[question.question] ===
                      "Others & Opinions" && (
                      <textarea
                        value={otherReasons[question.question] || ""}
                        onChange={(e) =>
                          handleOtherReasonChange(
                            question.question,
                            e.target.value
                          )
                        }
                        placeholder="Please Specify"
                        className="block w-full px-3 py-2 mt-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                      />
                    )}
                    {selectedOptions[question.question] ===
                      "Other Suggestions & Opinions (ACSIC members are welcome to provide any other feedback or suggestions regarding the selection of the 2026 conference host)." && (
                      <textarea
                        value={otherReasons[question.question] || ""}
                        onChange={(e) =>
                          handleOtherReasonChange(
                            question.question,
                            e.target.value
                          )
                        }
                        placeholder="Please Specify"
                        className="block w-full px-3 py-2 mt-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                      />
                    )}
                    {selectedOptions[question.question] ===
                      "Agree with suggested changes (please specify)" && (
                      <textarea
                        value={otherReasons[question.question] || ""}
                        onChange={(e) =>
                          handleOtherReasonChange(
                            question.question,
                            e.target.value
                          )
                        }
                        placeholder="Please Specify"
                        className="block w-full px-3 py-2 mt-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                      />
                    )}
                    {selectedOptions[question.question] ===
                      "Yes (Please specify)" && (
                      <textarea
                        value={otherReasons[question.question] || ""}
                        onChange={(e) =>
                          handleOtherReasonChange(
                            question.question,
                            e.target.value
                          )
                        }
                        placeholder="Please Specify"
                        className="block w-full px-3 py-2 mt-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                      />
                    )}
                    {qIndex === 8 && (
                      <div className="my-4 py-2 text-start">
                        <h2 className="text-xl font-bold text-blue-800">
                          Section 4
                        </h2>
                        <p className="text-sm font-semibold text-green-800">
                          Final
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-center mt-8 text-gray-600">
              Loading agenda items...
            </p>
          )}
          <div className="text-center mt-8">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Submit Answers
            </button>
          </div>
        </form>
      </div>
      <AlertDialog
        open={alertDialogOpen}
        setOpen={setAlertDialogOpen}
        title={alertDialogTitle}
        description={alertDialogDescription}
      />
      <SuccessDialog
        open={successDialogOpen}
        setOpen={setSuccessDialogOpen}
        title="Submission Successful"
        description="Your answers have been submitted successfully! Thank you for your participation."
        onConfirm={() => navigate("/homepage")}
      />
    </>
  );
};

export default Agenda;
