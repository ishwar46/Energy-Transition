import React from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Stack,
  Box,
  useTheme,
  useMediaQuery,
  createTheme,
  ThemeProvider,
  Divider,
} from "@mui/material";
import FooterNew from "../components/FooterNew";

const theme = createTheme({
  palette: {
    primary: {
      main: "#3051A0",
    },
    secondary: {
      main: "#046A38",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          color: "#fff",
        },
      },
    },
  },
});

const VenuePage = () => {
  const defaultTheme = useTheme();
  const matches = useMediaQuery(defaultTheme.breakpoints.up("md"));

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack spacing={3} alignItems="center">
          <Typography
            variant="h3"
            gutterBottom
            color="primary"
            textAlign="center"
            sx={{
              fontWeight: "bold",
            }}
          >
            Uranus Event Management
          </Typography>

          <Card
            raised
            sx={{
              width: matches ? "70%" : "100%",
            }}
          >
            <CardContent>
              <Typography
                variant="h5"
                component="div"
                gutterBottom
                color="secondary"
                style={{
                  fontWeight: "bold",
                }}
              >
                Schedule for the Event
              </Typography>
              {scheduleData.map((item, index) => (
                <React.Fragment key={index}>
                  <Box mb={2}>
                    <Typography
                      variant="subtitle1"
                      color="textPrimary"
                      style={{
                        fontWeight: "bold",
                      }}
                    >
                      {item.date}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      style={{
                        fontWeight: "bold",
                      }}
                    >
                      {item.description}
                    </Typography>
                  </Box>
                  {index !== scheduleData.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </CardContent>
          </Card>

          <Card
            raised
            sx={{
              width: matches ? "70%" : "100%",
            }}
          >
            <CardContent>
              <Typography
                variant="h5"
                component="div"
                gutterBottom
                color="secondary"
                style={{
                  fontWeight: "bold",
                }}
              >
                Venue for the Event
              </Typography>
              <Typography variant="subtitle1" color="textPrimary">
                We will update this section soon!
              </Typography>
            </CardContent>
          </Card>

          <FooterNew />
        </Stack>
      </Container>
    </ThemeProvider>
  );
};

export default VenuePage;

const scheduleData = [
  {
    date: "20th September",
    description:
      "Arrival in Kathmandu, DCGF Anniversary Celebration followed by Registration & Welcome Dinner",
  },
  {
    date: "21st September",
    description:
      "Inaugural followed by Conference Sessions & Chief Delegates Meeting",
  },
  {
    date: "22nd September",
    description: "Conference Sessions",
  },
  {
    date: "23rd September",
    description: "Conference Sessions (Half Day) followed by Excursion",
  },
  {
    date: "24th September",
    description: "Excursion around the city",
  },
  {
    date: "25th September",
    description: "Departure",
  },
];
