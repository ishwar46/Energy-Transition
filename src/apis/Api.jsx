import axios from "axios";

// Axios instance configuration
const Api = axios.create({
  // baseURL: "http://localhost:5500",
  baseURL: "https://energy-transition-api.onrender.com",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const config = {
  headers: {
    authorization: `Bearer ${localStorage.getItem("token")}`,
    "Content-Type": "multipart/form-data",
  },
};

//API Calls For Energy Transition for Resilient and Low Carbon Economy Summit
export const energyRegisterApi = (formData) => Api.post("/api/energy/register", formData, config);


// API calls for queries and users
export const addSubscriberApi = (data) =>
  Api.post("/api/queries/addQueries", data);
export const getAllSubscribersApi = () => Api.get("/api/queries/getAllQueries");

export const registerUserApi = (formData) =>
  Api.post("/api/users/userregister", formData, config);

// Additional API call that might have been intended
export const markAsRepliedApi = (id) => {
  const config = {
    headers: {
      authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };
  return Api.patch(`/api/subscription/${id}/replied`, null, config);
};

// Get All User
export const getAllUsersApi = () => {
  const config = {
    headers: {
      authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };
  return Api.get("/api/users/getAllUser", config);
};

//------------------------------User Login Apis---------------------------
export const userLoginApi = (data) => Api.post("/api/users/userlogin", data);

//------------------------------ Admin Apis -------------------------------
export const adminLoginApi = (data) => Api.post("/api/admin/login", data);

export const resetUserPasswordApi = (userId) =>
  Api.put(
    `/api/admin/reset-password/${userId}`,
    {},
    {
      headers: {
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

export const updateConferenceKitStatusApi = (userId, data) => {
  return Api.put(`/api/admin/conference-kit/${userId}`, data, {
    headers: {
      authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

//------------------------------ Change Password Apis -------------------------------
export const changePasswordApi = (formData) =>
  Api.post("/api/users/changepassword", formData);

//------------------------------ Add Image in Gallery Apis -------------------------------
export const addImageinGalaryApi = (formData) =>
  Api.post("/api/gallery/addGallery", formData, {
    headers: {
      authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "multipart/form-data",
    },
  });

//------------------------------ Get all Image in Gallery Apis -------------------------------
export const getAllImageinGalaryApi = (data) =>
  Api.get("/api/gallery/getAllGallery", data);

//------------------------------ Speakers Apis -------------------------------
export const deleteImageFromGalaryApi = (galleryid) =>
  Api.delete(`/api/gallery/deleteGallery/${galleryid}`, {
    headers: {
      authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

export const addSpeakerApi = (formData) =>
  Api.post("/api/speaker/addSpeaker", formData, config);

export const getAllSpeakersApi = () => Api.get("/api/speaker/getAllSpeakers");

export const updateSpeakerApi = (speakerId, formData) =>
  Api.put(`/api/speaker/updateSpeaker/${speakerId}`, formData, config);

export const deleteSpeakerApi = (speakerId) =>
  Api.delete(`/api/speaker/deleteSpeaker/${speakerId}`, {
    headers: {
      authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

//-------------------------verifying a user-----------------------
export const verifyUserByAdminApi = (userId) =>
  Api.put(`/api/admin/verify/${userId}`);

//deleting a user
export const deleteUserApi = (userId) =>
  Api.delete(`/api/admin/delete/${userId}`, {
    headers: {
      authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

export const getUserByIdApi = (id) => {
  const config = {
    headers: {
      authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };
  return Api.get(`/api/users/getUserByid/${id}`, config);
};

export const updateUserApi = (userId, data) => {
  const config = {
    headers: {
      authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };
  return Api.put(`/api/users/${userId}`, data, config);
};

export const getNamesbyInstitutionApi = (institutionName) => {
  const config = {
    headers: {
      authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };

  const encodedInstitutionName = encodeURIComponent(institutionName);

  return Api.get(
    `/api/users/gtusers?institution=${encodedInstitutionName}`,
    config
  );
};

//------------------------------ Get Single Agenda APIS For Question -------------------------------
export const getOneAgenda = (data) => Api.get("/api/getOneAgenda", data);

//------------------------------ Get All Agenda APIS -------------------------------
export const getAllAgenda = (data) => Api.get("/api/getallAgenda", data);

//------------------------------ Sunmit Answer in Agenda APIS -------------------------------
export const submitAnswer = async (data) => {
  return Api.post("/api/submitAnswer", data);
};
//------------------------------  Session Apis -------------------------------
export const getAllSessionsApi = () => Api.get("/api/season/getAllSessions");

export const addSessionApi = (formData) =>
  Api.post("/api/season/createsessions", formData, {
    headers: {
      authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

export const startSessionApi = (sessionId) => {
  const config = {
    headers: {
      authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };
  return Api.put(`/api/season/startSession/${sessionId}`, {}, config);
};

export const editSessionApi = (sessionId, data) => {
  const config = {
    headers: {
      authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
  };
  return Api.put(`/api/season/editSession/${sessionId}`, data, config);
};

export const endSessionApi = (sessionId) => {
  const config = {
    headers: {
      authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };
  return Api.put(`/api/season/endSession/${sessionId}`, {}, config);
};

export const cancelSessionApi = (sessionId) => {
  const config = {
    headers: {
      authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };
  return Api.put(`/api/season/cancelSession/${sessionId}`, {}, config);
};

export const getSessionAttendaceApi = (sessionId) => {
  const config = {
    headers: {
      authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };
  return Api.get(`/api/season/getAllAttendance/${sessionId}`, config);
};

//------------------------------ Banner Apis -------------------------------

// Add Banner Image
export const addBannerImageApi = (formData) =>
  Api.post("/api/banners/addBannerImage", formData, {
    headers: {
      authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "multipart/form-data",
    },
  });

// Get All Banner Images
export const getAllBannerImagesApi = () =>
  Api.get("/api/banners/getBannerImages", {
    headers: {
      authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

// Delete Banner Image
export const deleteBannerImageApi = (id) =>
  Api.delete(`/api/banners/deleteBannerImage/${id}`, {
    headers: {
      authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

//------------------------------ Event Management Apis -------------------------------

// Add Event
export const addEventApi = (eventData) =>
  Api.post("/api/events", eventData, {
    headers: {
      authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
  });

// Get All Events
export const getAllEventsApi = () =>
  Api.get("/api/events", {
    headers: {
      authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

// Update Event
export const updateEventApi = (id, eventData) =>
  Api.put(`/api/events/${id}`, eventData, {
    headers: {
      authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
  });

// Delete Event
export const deleteEventApi = (id) =>
  Api.delete(`/api/events/${id}`, {
    headers: {
      authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

//------------------------------ Get All AggetAllMessagesenda APIS -------------------------------
export const createMessagesApi = (formdata) =>
  Api.post("/api/message/create", formdata, {
    headers: {
      authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "multipart/form-data",
    },
  });

//------------------------------ Get All Message APIS -------------------------------
export const getAllMessages = (data) => Api.get("/api/message/getall", data);

//------------------------------ Get All Message APIS -------------------------------
export const deleteMessagesApi = (id) =>
  Api.delete(`/api/message/delete/${id}`);

//------------------------------ Notification APIS -------------------------------

// Send a global notification
export const sendGlobalNotificationApi = (data) => {
  return Api.post("/api/notifications/sendGlobal", data, {
    headers: {
      authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

// Fetch all notifications
export const getAllNotificationsApi = () => {
  return Api.get("/api/notifications/all", {
    headers: {
      authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

// Event PDF APIs
export const uploadEventPdfApi = (formData) => {
  return Api.post("/api/pdf/upload-event-pdf", formData, {
    headers: {
      authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getEventPdfsApi = () => {
  return Api.get("/api/pdf/list-event-pdfs", {
    headers: {
      authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

export const deleteEventPdfApi = (filename) => {
  return Api.delete(`/api/pdf/delete-event-pdf/${filename}`, {
    headers: {
      authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

// Excursion PDF APIs
export const uploadExcursionPdfApi = (formData) => {
  return Api.post("/api/pdf/upload-excursion-pdf", formData, {
    headers: {
      authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getExcursionPdfsApi = () => {
  return Api.get("/api/pdf/list-excursion-pdfs", {
    headers: {
      authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

export const deleteExcursionPdfApi = (filename) => {
  return Api.delete(`/api/pdf/delete-excursion-pdf/${filename}`, {
    headers: {
      authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

//Create Buses
export const createBus = (data) => {
  return Api.post("/api/buses/createbus", data, {
    headers: {
      authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
  });
};
//Get all Buses
export const getallBuses = () => {
  return Api.get("/api/buses/getallbus");
};
//Delete Buses
export const deleteBus = (busId) => {
  return Api.delete(`/api/buses/deletebus/${busId}`, {
    headers: {
      authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
  });
};

//Create Venue
export const createVenue = (formData) => {
  return Api.post(`/api/venue/create`, formData, {
    headers: {
      authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

//Get All Venue
export const getAllVenue = () => {
  return Api.get("/api/venue/getall");
};

//Delete Veneue by ID
export const deleteVenueById = (id) => {
  return Api.delete(`/api/venue/delete/${id}`, {
    headers: {
      authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
  });
};

//Update Venue by ID
export const updateVenueById = (id, formData) => {
  return Api.put(`/api/venue/update/${id}`, formData, {
    headers: {
      authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

// Get all participants with their meals and excursion statuses
export const getMealsAndExcursionsApi = () => {
  return Api.get("/api/users/meals-and-excursions", {
    headers: {
      authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

// Update meal status for a specific participant
export const updateMealStatusApi = (userId, mealType, status) => {
  return Api.put(
    `/api/users/meals/${userId}/${mealType}`,
    { status },
    {
      headers: {
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
};

// Update excursion status for a specific participant
export const updateExcursionStatusApi = (userId, status) => {
  return Api.put(
    `/api/users/excursions/${userId}`,
    { status },
    {
      headers: {
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
};

//Get User According to Locaton
export const getallUserAccordingToLocation = () => {
  return Api.get(`/api/users/alllocation`, {
    headers: {
      authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

// Post live stream URL
export const postLiveStreamUrlApi = (data) =>
  Api.post("/api/admin/livestream", data, {
    headers: {
      authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

// Get live stream URL
export const getLiveStreamUrlApi = () => Api.get("/api/livestream/livestream");

export const updateProfileApi = (userId, formData) => {
  const config = {
    headers: {
      authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
  };
  return Api.put(`/api/users/profile/${userId}`, formData, config);
};

// Allocate user to bus
export const allocateUserToWagon = (busId, userId, accompanyingPersonInfo) => {
  return Api.post(
    `/api/buses/allocate`,
    {
      busId: busId,
      userId: userId,
      accompanyingPersonInfo: accompanyingPersonInfo,
    },
    {
      headers: {
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
};

//Deallocate User to Bus
export const deallocateUserToWagon = (busId, userId) => {
  return Api.delete(`/api/buses/deallocate`, {
    data: { busId, userId },
    headers: {
      authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

export const updateCheckInApi = (userId, data) => {
  const config = {
    headers: {
      authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };
  return Api.put(`/api/admin/checkin/${userId}`, data, config);
};

//Get all Event With Attached PDF
export const getAllEventWithPDF = () => {
  return Api.get("/api/pdfevent/getall");
};

//Delte all Event with Selected ID
export const deleteEventWithPDF = (id) => {
  return Api.delete(`/api/pdfevent/delete/${id}`, {
    headers: {
      authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
  });
};

//Create Event with PDF
export const createEventWithPDF = (formData) => {
  return Api.post(`/api/pdfevent/create`, formData, {
    headers: {
      authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "multipart/form-data",
    },
  });
};
//Create Event with PDF
export const updateEventWithPDF = (id, formData) => {
  return Api.put(`/api/pdfevent/update/${id}`, formData, {
    headers: {
      authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

//Get PDF in Event to view With Title
export const getallOnlyPDF = () => {
  return Api.get("/api/pdf1/getall");
};

//Create Event with PDF And Title
export const createEventWithPDFTitle = (formData) => {
  return Api.post(`/api/pdf1/create`, formData, {
    headers: {
      authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

//Delte all Event with Selected ID
export const deleteEventWithPDFAndTitle = (id) => {
  return Api.delete(`/api/pdf1/delete/${id}`, {
    headers: {
      authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
  });
};
//Edit all Event with Selected ID
export const editEventWithPDFAndTitle = (id, formData) => {
  return Api.put(`/api/pdf1/update/${id}`, formData, {
    headers: {
      authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

// ------------------------------ Volunteer Part ------------------------
export const getAllVolunteer = () => {
  return Api.get("/api/admin/getall/volunteer", {
    headers: {
      authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
  });
};

//Register Volunteer
export const registerVolunteer = (formData) => {
  return Api.post("/api/admin/register/volunteer", formData, {
    headers: {
      authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

//Updtae Volunteer
export const updateVolunteer = (id, formData) => {
  return Api.put(`/api/admin/update/volunteer/${id}`, formData, {
    headers: {
      authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

//Delete Volunteer
export const deleteVolunteerByID = (id) => {
  return Api.delete(`/api/admin/delete/volunteer/${id}`, {
    headers: {
      authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
  });
};

//On Site Registration
export const onSiteRegister = (formData) => {
  return Api.post(`/api/onsite/create`, formData, {
    headers: {
      authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

//Get All OnSite Regestration
export const getOnSiteRegister = () => {
  return Api.get(`/api/onsite/getall`, {
    headers: {
      authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
  });
};

// Delete OnSite Regestration
export const deleteOnSiteRegister = (id) => {
  return Api.delete(`/api/onsite/delete/${id}`, {
    headers: {
      authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
  });
};
