import React, { useEffect, useState } from "react";
import { getAllAgenda } from "../../apis/Api";
import * as XLSX from "xlsx";
import {
  MdOutlineKeyboardArrowUp,
  MdOutlineKeyboardArrowDown,
} from "react-icons/md";
import excelIcon from "../../assets/images/sheet.png";
import useDocumentTitle from "../../components/DocTitle";

const AgendaAdmin = () => {
  useDocumentTitle("Agenda Answers - Uranus Event Management");

  const [agendaData, setAgendaData] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [expandedInstitution, setExpandedInstitution] = useState(null);
  const [expandedDescriptions, setExpandedDescriptions] = useState({});

  useEffect(() => {
    const fetchAppAgendaData = async () => {
      try {
        const response = await getAllAgenda();
        setAgendaData(response.data.showallAgenda);

        const allQuestions = [];
        response.data.showallAgenda.forEach((institution) => {
          institution.questions.forEach((question) => {
            allQuestions.push({ ...question });
          });
        });
        setQuestions(allQuestions.slice(0, 10)); // Limit to first 10 questions
      } catch (error) {
        console.error(`Error fetching AgendaData ${error}`);
      }
    };
    fetchAppAgendaData();
  }, []);

  const createMarkup = (htmlContent) => {
    const boldPart =
      "Existing Article: The objective of ACSIC is to promote the sound development of the credit supplementation system for small businesses in the countries including regions (hereinafter referred to as 'countries') of Asia excluding areas to the west and north of Pakistan (hereinafter referred to as 'Asia') through exchange of information, discussions and interchange of personnel among small business credit supplementation institutions (hereinafter referred to as 'institution(s)') in Asia.";
    const boldBluePart =
      "Proposed Article: The objective of ACSIC is to promote the sound development of the credit supplementation system for small business in the countries including regions (hereinafter referred to as 'countries') of Asia, now expanded to include the Central Asian regions such as Kazakhstan, Kyrgyzstan, Uzbekistan, Tajikistan, and Turkmenistan, and excluding areas to the west and north of Pakistan (hereinafter referred to as 'Asia') through exchange of information, discussions, and interchange of personnel among small business credit supplementation institutions (hereinafter referred to as 'institution(s)') in Asia.";

    let formattedContent = htmlContent;
    formattedContent = formattedContent.replace(
      boldPart,
      `<strong style="color: blue;" >${boldPart}</strong>`
    );
    formattedContent = formattedContent.replace(
      boldBluePart,
      `<strong style="color: green;">${boldBluePart}</strong>`
    );

    return { __html: formattedContent };
  };

  const exportToExcel = () => {
    // Mapping of institution names to their respective country names
    const institutionCountryMap = {
      "PT. Asuransi Kredit Indonesia (PT. Askrindo)": "Indonesia",
      "Asosiasi Perusahaan Penjaminan Indonesia (Asippindo)": "Indonesia",
      "Japan Finance Corporation (JFC)": "Japan",
      "Japan Federation of Credit Guarantee Corporations (JFG)": "Japan",
      "Credit Guarantee Corporation Malaysia Berhad (CGC)": "Malaysia",
      "Deposit and Credit Guarantee Fund (DCGF)": "Nepal",
      "Small & Medium Enterprise Credit Guarantee Fund of Taiwan (TSMEG)":
        "Taiwan",
      "Thai Credit Guarantee Corporation (TCG)": "Thailand",
      "Korea Credit Guarantee Fund (KODIT)": "Korea",
      "Korea Technology Finance Corporation (KOTEC)": "Korea",
      "Korea Federation of Credit Guarantee Foundations (KOREG)": "Korea",
      "Central Bank of Sri Lanka (CBSL)": "Sri Lanka",
      "Sri Lanka Export Credit Insurance Corporation (SLECIC)": "Sri Lanka",
      "Philippine Guarantee Corporation (Philguarantee)": "Philippines",
      "Small & Medium Enterprises Corporation (SMEC)": "Papua New Guinea",
      "Credit Guarantee Fund Trust for Micro and Small Enterprises (CGTMSE)":
        "India",
      "Credit Guarantee Fund of Mongolia (CGFM)": "Mongolia",
    };

    // Group institutions by country
    const countryInstitutionMap = {};
    agendaData.forEach((institution) => {
      const country = institutionCountryMap[institution.nameofInstitution];
      if (country) {
        if (!countryInstitutionMap[country]) {
          countryInstitutionMap[country] = [];
        }
        countryInstitutionMap[country].push(institution);
      }
    });

    const worksheetData = [
      [
        "Country Name",
        "Institution Name",
        ...questions.map((question) => question.question),
      ],
    ];

    // Add rows for each country and its institutions
    Object.keys(countryInstitutionMap).forEach((country) => {
      const institutions = countryInstitutionMap[country];
      institutions.forEach((institution, index) => {
        const rowData = [
          index === 0 ? country : "", // Show country name only for the first institution
          institution.nameofInstitution, // Institution Name
        ];
        questions.forEach((question) => {
          const questionData = institution.questions.find(
            (q) => q.question === question.question
          );
          let cellData = "N/A";
          if (questionData) {
            cellData = questionData.userAnswer;
            if (
              questionData.userAnswer === "Disagree (Please explain why)" &&
              questionData.disagreeReason
            ) {
              cellData = "Disagree";
              cellData += `: ${questionData.disagreeReason}`;
            } else if (
              questionData.userAnswer === "Yes (Please specify)" &&
              questionData.othersReason
            ) {
              cellData = "Yes";
              cellData += `: ${questionData.othersReason}`;
            } else if (
              questionData.userAnswer ===
                "Agree with suggested changes (please specify)" &&
              questionData.othersReason
            ) {
              cellData = "Agree with suggested changes";
              cellData += `: ${questionData.othersReason}`;
            } else if (
              questionData.userAnswer ===
                "Other Suggestions & Opinions (ACSIC members are welcome to provide any other feedback or suggestions regarding the selection of the 2026 conference host)." &&
              questionData.othersReason
            ) {
              cellData = "Other Suggestions & Opinions";
              cellData += `: ${questionData.othersReason}`;
            } else if (
              [
                "Others & Opinions",
                "Others/Suggestions",
                "Other Suggestions & Opinions",
              ].includes(questionData.userAnswer) &&
              questionData.othersReason
            ) {
              cellData += `: ${questionData.othersReason}`;
            }
          }
          rowData.push(cellData);
        });
        worksheetData.push(rowData);
      });
    });

    const answerCounts = {};
    questions.forEach((question) => {
      answerCounts[question.question] = {};
      agendaData.forEach((institution) => {
        const questionData = institution.questions.find(
          (q) => q.question === question.question
        );
        if (questionData) {
          let answer = questionData.userAnswer;
          if (answer.trim().includes("Disagree (Please explain why)")) {
            answer = "Disagree";
          }
          //console.log("Answer before condition check:", answer);
          if (!answerCounts[question.question][answer]) {
            answerCounts[question.question][answer] = 0;
          }
          answerCounts[question.question][answer]++;
        }
      });
    });

    // Add counts to the last row
    const countsRow = ["Total", "Total Counts"];
    questions.forEach((question) => {
      const counts = question.options
        .map((option) => {
          const count = agendaData.reduce((total, institution) => {
            const instQuestion = institution.questions.find(
              (q) => q.question === question.question
            );
            return (
              total +
              (instQuestion && instQuestion.userAnswer === option ? 1 : 0)
            );
          }, 0);
          if (option.includes("Disagree (Please explain why)")) {
            option = "Disagree";
          } else if (option.includes("Yes (Please specify)")) {
            option = "Yes";
          } else if (
            option.includes("Agree with suggested changes (please specify)")
          ) {
            option = "Agree with suggested changes";
          } else if (
            option.includes(
              "Other Suggestions & Opinions (ACSIC members are welcome to provide any other feedback or suggestions regarding the selection of the 2026 conference host)."
            )
          ) {
            option = "Other Suggestions & Opinions";
          }
          return `${option}: ${count}`;
        })
        .join(", ");
      countsRow.push(counts);
    });
    worksheetData.push(countsRow);

    // Add total number of participants and non-participants
    const totalParticipants = agendaData.length;
    const totalNonParticipants =
      Object.keys(institutionCountryMap).length - totalParticipants;
    worksheetData.push([
      "",
      `Participated ACSIC Members: ${totalParticipants}`,
      `ACSIC Member that did not participate: ${totalNonParticipants}`,
    ]);

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    // Merge country name cells
    let startRow = 1; // Start after the header row
    Object.keys(countryInstitutionMap).forEach((country) => {
      const institutions = countryInstitutionMap[country];
      if (institutions.length > 1) {
        worksheet["!merges"] = worksheet["!merges"] || [];
        worksheet["!merges"].push({
          s: { r: startRow, c: 0 },
          e: { r: startRow + institutions.length - 1, c: 0 },
        });
      }
      startRow += institutions.length;
    });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Agenda Data");
    XLSX.writeFile(workbook, "agenda_data.xlsx");
  };

  const toggleExpand = (institution) => {
    setExpandedInstitution(
      expandedInstitution === institution ? null : institution
    );
  };

  const truncateAnswer = (text, limit) => {
    if (!text) return "";
    const words = text.split(" ");
    return words.length > limit
      ? words.slice(0, limit).join(" ") + "..."
      : text;
  };

  const toggleDescription = (index) => {
    setExpandedDescriptions({
      ...expandedDescriptions,
      [index]: !expandedDescriptions[index],
    });
  };

  return (
    <>
      <div className="text-2xl font-bold text-start  text-black mt-2">
        Tentative CDM Questionnaire's Answers
      </div>

      <div className="mt-2 p-4 rounded-lg bg-white shadow-lg w-full text-black">
        {agendaData.length > 0 ? (
          <>
            <div className="font-semibold text-green-700 mt-3 text-1xl flex justify-between">
              Summary Section
              <button
                onClick={exportToExcel}
                className="p-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded flex items-center mt-4 sm:mt-0"
              >
                <img
                  src={excelIcon}
                  alt="Export to Excel"
                  className="w-6 h-6 mr-2"
                />
                Export
              </button>
            </div>
            {questions.map((question, index) => (
              <div
                key={index}
                className="mt-4 p-4 md:p-6 border border-gray-300 rounded-lg bg-white shadow-lg"
              >
                <h3 className="text-1xl font-bold text-blue-800">
                  {question.question}
                </h3>
                {question.description && (
                  <div className="text-sm mt-2 font-semibold text-justify">
                    <p
                      dangerouslySetInnerHTML={createMarkup(
                        expandedDescriptions[index]
                          ? question.description
                          : truncateAnswer(question.description, 50)
                      )}
                    ></p>
                    {question.description.split(" ").length > 40 && (
                      <button
                        className="text-blue-500 hover:underline"
                        onClick={() => toggleDescription(index)}
                      >
                        {expandedDescriptions[index]
                          ? "View Less"
                          : "View More"}
                      </button>
                    )}
                  </div>
                )}
                {question.options && (
                  <div className="text-sm mt-2">
                    {question.options.map((option, idx) => (
                      <p key={idx} className="flex items-center gap-2">
                        {option}
                        <div className="green-circle bg-green-800 p-1 px-3 rounded-full text-white">
                          {agendaData.reduce((count, institution) => {
                            const instQuestion = institution.questions.find(
                              (q) => q.question === question.question
                            );
                            return (
                              count +
                              (instQuestion &&
                              instQuestion.userAnswer === option
                                ? 1
                                : 0)
                            );
                          }, 0)}
                        </div>
                      </p>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <h1 className="text-green-700 font-semibold mt-5">
              Detailed Summary
            </h1>
            {agendaData.map((agenda, index) => (
              <div
                key={index}
                className="mt-4 p-4 md:p-6 border border-gray-300 rounded-lg bg-blue-800 shadow-lg"
                style={{ animation: "fadeIn 1s ease-out" }}
                onClick={() => toggleExpand(agenda)}
              >
                <div className="flex items-center justify-between">
                  <h1 className="text-white text-1xl font-bold">
                    {agenda.nameofInstitution}
                  </h1>
                  {expandedInstitution === agenda ? (
                    <MdOutlineKeyboardArrowUp
                      color="white"
                      size={25}
                      onClick={() => toggleExpand(agenda)}
                    />
                  ) : (
                    <MdOutlineKeyboardArrowDown
                      color="white"
                      size={25}
                      onClick={() => toggleExpand(agenda)}
                    />
                  )}
                </div>
                {expandedInstitution === agenda && (
                  <div
                    className="mt-4 flex justify-between text-white"
                    style={{ animation: "fadeIn 1s ease-out" }}
                  >
                    <div>
                      <h1 className="text-green-400 font-semibold ">Agendas</h1>
                      {agenda.questions.map((question, index) => (
                        <div key={index}>
                          <h3 className="text-sm text-white">
                            {question.question}
                          </h3>
                        </div>
                      ))}
                    </div>
                    <div>
                      <h1 className="text-green-400 font-semibold">Response</h1>
                      {agenda.questions.map((question, index) => (
                        <div key={index}>
                          <h1 className="text-white text-sm">
                            {truncateAnswer(question.userAnswer, 8)}
                          </h1>
                        </div>
                      ))}
                    </div>
                    <div>
                      <h1 className="text-green-400 font-semibold">
                        Response(If Applicable)
                      </h1>
                      {agenda.questions.map((question, index) => (
                        <div key={index}>
                          <h1 className="text-white text-sm">
                            {question.disagreeReason
                              ? question.disagreeReason
                              : "NA"}
                          </h1>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </>
        ) : (
          <p>No agendas available. Please check back later.</p>
        )}
      </div>
    </>
  );
};
export default AgendaAdmin;

// Count how many times each user answer is chosen
// const answerCounts = {};
// questions.forEach(question => {
//     answerCounts[question.question] = {};
//     agendaData.forEach(institution => {
//         const questionData = institution.questions.find(q => q.question === question.question);
//         if (questionData) {
//             const answer = questionData.userAnswer;
//             if (!answerCounts[question.question][answer]) {
//                 answerCounts[question.question][answer] = 0;
//             }
//             answerCounts[question.question][answer]++;
//         }
//     });
// });
