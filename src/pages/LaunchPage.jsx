import "../css/styles.css";

const Waiting = () => {
  // const [email, setEmail] = useState("");
  //
  // const [isEmailValid, setIsEmailValid] = useState(true);
  // // const [openSnackbar, setOpenSnackbar] = useState(false);
  // const navigate = useNavigate();
  // useEffect(() => {}, []);
  // const handleEmailChange = (event) => {
  //   setEmail(event.target.value);
  //   setIsEmailValid(validateEmail(event.target.value));
  // };
  // const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  // const handleNotifyMeClick = async (e) =>  {
  //   e.preventDefault();
  //   try {
  //     const response = await addSubscriberApi({ email });
  //     const data = response.data;
  //     if (data.success) {
  //       toast.success(data.message);
  //       setEmail('');
  //     } else if (data.message) {
  //       toast.error(data.message);
  //     } else {
  //       toast.error('An error occurred while subscribing.');
  //     }
  //   } catch (error) {
  //     console.error('Error subscribing:', error);
  //     toast.error('Internal server error');
  //   }
  // };
  // // const handleCloseSnackbar = (event, reason) => {
  // //   if (reason === "clickaway") {
  // //     return;
  // //   }
  // //   setOpenSnackbar(false);
  // // };
  // const handleExploreClick = () => {
  //   navigate("/schedule");
  // };
  // return (
  //   <section
  //     className="page"
  //     style={{ backgroundImage: `url(${backgroundImage})` }}
  //   >
  //     <div className="overlay"></div>
  //     <div className="page__content">
  //       <img src={logo} alt="Acsic" className="logo" />
  //       <AnimatedHeader />
  //       <h3>Please join our mailing list to be the first to know.</h3>
  //       <div className="form-container">
  //         <Grid item xs={12} md={6}>
  //           <TextField
  //             value={email}
  //             onChange={handleEmailChange}
  //             variant="outlined"
  //             required
  //             fullWidth
  //             id="email"
  //             label="Enter your email"
  //             name="email"
  //             autoComplete="email"
  //             error={!isEmailValid}
  //             helperText={!isEmailValid && "Please enter a valid email"}
  //             sx={{
  //               "& .MuiOutlinedInput-root": { backgroundColor: "white" },
  //               "& .MuiInputBase-input": { color: "black" },
  //             }}
  //           />
  //         </Grid>
  //         <button className="notify-button" onClick={handleNotifyMeClick}>
  //           Notify Me
  //         </button>
  //         <button className="explore-button" onClick={handleExploreClick}>
  //           Explore
  //         </button>
  //         {/* <Snackbar
  //           color="info"
  //           open={openSnackbar}
  //           autoHideDuration={6000}
  //           onClose={handleCloseSnackbar}
  //           message="This feature is under construction"
  //           anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
  //         /> */}
  //       </div>
  //     </div>
  //   </section>
};

export default Waiting;
