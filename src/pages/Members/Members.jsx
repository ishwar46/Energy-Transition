import React from "react";
import "../../css/animations.css";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Members from "../../components/Members";
import useDocumentTitle from "../../components/DocTitle";

const AcsicMembers = () => {
  useDocumentTitle("Uranus Event Management");

  const members = [
    {
      sn: 1,
      institution: "PT. Asuransi Kredit Indonesia (PT. Askrindo) / Indonesia",
      year: 1987,
      website: "https://askrindo.co.id/en/",
    },
    {
      sn: 2,
      institution:
        "Asosiasi Perusahaan Penjaminan Indonesia (Asippindo) / Indonesia",
      year: 1987,
      website: "https://asippindo.or.id/",
    },
    {
      sn: 3,
      institution: "Japan Finance Corporation (JFC) / Japan",
      year: 1987,
      website: "https://www.jfc.go.jp/n/english/",
    },
    {
      sn: 4,
      institution:
        "Japan Federation of Credit Guarantee Corporations (JFG) / Japan",
      year: 1987,
      website: "http://www.zenshinhoren.or.jp",
    },
    {
      sn: 5,
      institution:
        "Credit Guarantee Corporation Malaysia Berhad (CGC) / Malaysia",
      year: 1987,
      website: "https://www.cgc.com.my/",
    },
    {
      sn: 6,
      institution: "Deposit and Credit Guarantee Fund (DCGF) / Nepal",
      year: 1987,
      website: "https://dcgf.gov.np/",
    },
    {
      sn: 7,
      institution:
        "Small & Medium Enterprise Credit Guarantee Fund of Taiwan (TSMEG) / Taiwan",
      year: 1987,
      website: "https://www.smeg.org.tw/en/",
    },
    {
      sn: 8,
      institution: "Thai Credit Guarantee Corporation (TCG) / Thailand",
      year: 1987,
      website: "http://www.tcg.or.th/",
    },
    {
      sn: 9,
      institution: "Korea Credit Guarantee Fund (KODIT) / Korea",
      year: 1987,
      website: "https://www.kodit.co.kr/koditEng/main.do",
    },
    {
      sn: 10,
      institution: "Korea Technology Finance Corporation (KOTEC) / Korea",
      year: 1989,
      website: "https://www.kibo.or.kr/english/work/work010100.do",
    },
    {
      sn: 11,
      institution:
        "Korea Federation of Credit Guarantee Foundations (KOREG) / Korea",
      year: 2008,
      website: "https://www.koreg.or.kr:444/main.do?s=eng",
    },
    {
      sn: 12,
      institution: "Central Bank of Sri Lanka (CBSL) / Sri Lanka",
      year: 1987,
      website: "https://www.cbsl.gov.lk/",
    },
    {
      sn: 13,
      institution:
        "Sri Lanka Export Credit Insurance Corporation (SLECIC) / Sri Lanka",
      year: 2017,
      website: "https://www.slecic.lk/web/index.php/en/contact",
    },
    {
      sn: 14,
      institution:
        "Philippine Guarantee Corporation (Philguarantee) / Philippines",
      year: 1988,
      website: "https://www.philguarantee.gov.ph/",
    },
    {
      sn: 15,
      institution:
        "Small & Medium Enterprises Corporation (SMEC) / Papua New Guinea",
      year: 2000,
      website: "https://www.smecorp.gov.pg",
    },
    {
      sn: 16,
      institution:
        "Credit Guarantee Corporation of Papua New Guinea (CGC PNG) / Papua New Guinea",
      year: "Pending membership",
      website: "https://www.cgc.com.pg/",
    },
    {
      sn: 17,
      institution:
        "Credit Guarantee Fund Trust for Micro and Small Enterprises (CGTMSE) / India",
      year: 2008,
      website: "https://www.cgtmse.in/",
    },
    {
      sn: 18,
      institution: "Credit Guarantee Fund of Mongolia (CGFM) / Mongolia",
      year: 2015,
      website: "https://www.cgf.mn/",
    },
    {
      sn: 19,
      institution: "Credit Guarantee Corporation of Cambodia (CGCC) / Cambodia",
      year: "Pending membership",
      website: "https://www.cgcc.com.kh/en/",
    },
  ];

  return (
    <>
      <Navbar />
      <div className="container px-5 mx-auto mt-10 mb-20">
        <div
          className="text-3xl font-bold text-blue-800 pt-5 text-center mb-10"
          style={{ animation: "fadeIn 1s ease-out" }}
        >
          ACSIC MEMBERS
        </div>

        <table className="table-auto w-full text-left mb-8">
          <thead className="bg-blue-800 text-white">
            <tr>
              <th className="px-4 py-2">SN</th>
              <th className="px-4 py-2">Institution Name</th>
              <th className="px-4 py-2">Membership Year</th>
              <th className="px-4 py-2">Visit Website</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr
                key={member.sn}
                className="bg-white border-b text-green-800 hover:bg-blue-100 transition-colors duration-300"
              >
                <td className="px-4 py-2">{member.sn}</td>
                <td className="px-4 py-2">{member.institution}</td>
                <td className="px-4 py-2">{member.year}</td>
                <td className="px-4 py-2">
                  <a
                    href={member.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline hover:text-blue-700 transition-colors duration-300"
                  >
                    Website
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Members />
      </div>
      <Footer />
    </>
  );
};

export default AcsicMembers;
