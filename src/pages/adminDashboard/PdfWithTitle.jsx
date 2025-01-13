import React, { useEffect, useState } from 'react'
import { createEventWithPDFTitle, deleteEventWithPDFAndTitle, editEventWithPDFAndTitle, getallOnlyPDF } from '../../apis/Api';
import toast from 'react-hot-toast';
import NoDataFound from '../../components/NoDataFound';

const PdfWithTitle = () => {

    const [allPdfWithTitle, setallPdfWithTitle] = useState([]);
    const [editingPdfWithId, seteditingPdfWithId] = useState(null);
    const [formData, setFormData] = useState({
        title: "",
        pdf: null,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handlePdfChange = (e) => {
        const selectedFile = e.target.files[0];
        setFormData({ ...formData, pdf: selectedFile });
    };

    useEffect(() => {
        fetchAllEventWithPdfAndTitle();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append("title", formData.title);
    
        // Optional PDF append if the file exists
        if (formData.pdf) {
            data.append("pdf", formData.pdf);
        }
    
        try {
            if (editingPdfWithId) {
                const res = await editEventWithPDFAndTitle(editingPdfWithId, data);
                if (res.status === 200 || res.status === 201) {
                    toast.success("PDF with title updated successfully");
                    seteditingPdfWithId(null);
                } else {
                    toast.error("Failed to update PDF with title");
                }
            } else {
                const res = await createEventWithPDFTitle(data);
                // console.log(res)
                if (res.status === 200 || res.status === 201) {
                    toast.success("PDF with title added successfully");
                } else {
                    toast.error("Failed to add PDF with title");
                }
            }
            setFormData({ title: "", pdf: null });
            fetchAllEventWithPdfAndTitle();
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error(error.message);
            }
        }
    };
    

    const fetchAllEventWithPdfAndTitle = async () => {
        try {
            const res = await getallOnlyPDF();
            console.log(res.data.allPdfwithtitle)
            setallPdfWithTitle(res.data.allPdfwithtitle);
        } catch (error) {
            toast.error("Unable to Fetch All Event");
        }
    };

    const handleDelete = async (id) => {
        try {
            const res = await deleteEventWithPDFAndTitle(id);
            if (res.status === 200 || res.status === 201) {
                toast.success(res.data.message);
                fetchAllEventWithPdfAndTitle();
            }
        } catch (error) {
            toast.error(`Unable to delete due to ${error}`);
        }
    }

    const handleEdit = async (pdf) => {
        try {
            seteditingPdfWithId(pdf._id)
            setFormData({
                title: pdf.title || "",
                pdf: pdf.pdf || "",
            })
            window.scrollTo({ top: 0, behavior: "smooth" });

        } catch (error) {
            toast.error(`Unable to edit due to ${error}`);
        }
    }


    return (
        <div className="min-h-screen">
            <h2 className="text-2xl font-bold text-start mb-4 text-black mt-2">
                Add PDF With Title
            </h2>
            <div className="mt-2 p-2 rounded-lg w-full text-black">
                <form
                    className="w-full max p-2 text-black shadow-lg"
                    onSubmit={handleSubmit}
                >
                    <div className="w-full mb-4 mt-2">
                        <label className="block text-lg font-medium text-gray-700 mb-2">
                            Event Title
                        </label>
                        <input
                            type="text"
                            name="title"
                            placeholder="* title"
                            autoComplete="title"
                            onChange={handleChange}
                            value={formData.title}
                            className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-green-500 focus:border-green-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700">
                            Upload PDF
                        </label>
                        <input
                            type="file"
                            accept="application/pdf"
                            onChange={handlePdfChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-green-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full p-3 mt-5 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600"
                    >
                        {editingPdfWithId ?  " Update Event With Title" : " Add Event With Title"}

                    </button>
                </form>

                <div className="mt-4 bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">List of PDFs With Title</h2>
                    {
                        allPdfWithTitle.length > 0 ? (
                            <div className=''>
                                {
                                    allPdfWithTitle.map((allPdf, index) => (
                                        <div key={index} className='p-6 shadow-lg rounded-md flex items-center justify-between'>
                                            <h1>Title: {allPdf.title}</h1>
                                            <div className='gap-3'>
                                                <button
                                                    onClick={() => handleEdit(allPdf)}
                                                    className="px-3 py-1 mt-2 mr-3 bg-green-500 text-white text-sm font-semibold rounded-lg hover:bg-green-600"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(allPdf._id)}
                                                    className="px-3 py-1 mt-2 bg-red-500 text-white text-sm font-semibold rounded-lg hover:bg-red-600"
                                                >
                                                    Delete
                                                </button>
                                            </div>

                                        </div>
                                    ))
                                }
                            </div>
                        ) : (
                            <div>
                                <NoDataFound />
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default PdfWithTitle
