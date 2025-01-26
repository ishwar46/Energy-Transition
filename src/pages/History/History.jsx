import React from "react";
import Navbar from "../../components/Navbar";
import historyData from "./Historydata.json";
import Footer from "../../components/Footer";
import useDocumentTitle from "../../components/DocTitle";

const History = () => {
  useDocumentTitle("History of ACSIC - Uranus Event Management");

  const historyEntries = historyData.ACSIC_History;

  return (
    <>
      <Navbar />
      <div className="text-3xl text-gray-900">
        <section>
          <div className="bg-white  text-black py-8">
            <div className="container mx-auto flex flex-col items-start md:flex-row my-12 md:my-24">
              <div className="flex flex-col w-full sticky md:top-36 lg:w-1/3 mt-2 md:mt-12 px-8">
                <p className=" font-bold text-green-700 uppercase tracking-loose">
                  History of ACSIC
                </p>
                <p className="text-lg md:text-lg leading-normal md:leading-relaxed mb-2">
                  History of ACSIC Conferences
                </p>
              </div>
              <div className="ml-0 md:ml-12 lg:w-2/3 sticky">
                <div className="container mx-auto w-full h-full">
                  <div className="relative wrap overflow-hidden h-full">
                    <div
                      className="border-2-2 absolute h-full border"
                      style={{
                        right: "50%",
                        border: "2px solid #FFC100",
                        borderRadius: "1%",
                      }}
                    ></div>
                    {historyEntries &&
                      historyEntries.map((item, index) => (
                        <div
                          key={index}
                          className={
                            index % 2 === 0
                              ? "mb-2 flex justify-between flex-row-reverse items-center w-full left-timeline text-right"
                              : "mb-2 flex text-left justify-between items-center w-full right-timeline"
                          }
                        >
                          <div className="order-1 w-5/12"></div>
                          <div className="order-1 w-5/12 px-1 py-1">
                            <p className="mb-3 text-base text-blue-700">
                              {item.date}
                            </p>
                            <h4 className="mb-3 font-bold text-sm md:text-sm">
                              {Array.isArray(item.details)
                                ? item.details.join("; ")
                                : item.details}
                            </h4>
                            <p className="mb-1 text-lg font-bold text-gray-700">
                              {item.host_country}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default History;
