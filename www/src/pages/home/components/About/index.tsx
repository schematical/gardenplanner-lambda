/**
=========================================================
* Material Dashboard 2 PRO React TS - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-2-pro-react-ts
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 */
// import client from "services/Apollo";
// @mui material components
import Grid from "@mui/material/Grid";
import TableCell from "@mui/material/TableCell";
// Material Dashboard 2 PRO React TS components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { VectorMap } from "@react-jvectormap/core";
import { worldMerc } from "@react-jvectormap/world";
// Wizard application components
import FormField from "layouts/applications/wizard/components/FormField";
// Images
import { GeoLocationService } from "services/GeoLocation.service";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import { Component, useMemo } from "react";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import MDButton from "../../../../components/MDButton";

class About extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.selectGeoLocation = this.selectGeoLocation.bind(this);
    this.state = {
      geoLocations: [],
      renderedRows: [],
    };
  }

  async handleChange(e: any) {
    const geoLocations = await GeoLocationService.listGeoLocations({
      city: e.target.value,
    });

    const renderedRows = geoLocations.map(
      (geoLocation: { [key: string]: string | number | (string | number)[] }, key: any) => {
        const tableRows: any = [];
        const rowKey = `row-${key}`;

        // Object.entries(geoLocation).map(([cellTitle, cellContent]: any) => {
        tableRows.push(
          <TableCell align="left" width="30%">
            <MDBox display="flex" alignItems="center" width="max-content">
              <MDBox display="flex" flexDirection="column" ml={3}>
                <MDTypography variant="button" fontWeight="regular" textTransform="capitalize">
                  {geoLocation.city}, {geoLocation.country}
                </MDTypography>
              </MDBox>
            </MDBox>
          </TableCell>
        );
        tableRows.push(
          <TableCell align="left" width="30%">
            <MDBox display="flex" alignItems="center" width="max-content">
              <MDBox display="flex" flexDirection="column" ml={3}>
                <MDButton
                  variant="outlined"
                  size="small"
                  color="primary"
                  onClick={(e) => this.selectGeoLocation(geoLocation)}
                >
                  Select
                </MDButton>
              </MDBox>
            </MDBox>
          </TableCell>
        );

        // });

        return <TableRow key={rowKey}>{tableRows}</TableRow>;
      }
    );
    this.setState({
      geoLocations,
      renderedRows,
    });
  }

  // @ts-ignore
  async selectGeoLocation(geoLocation) {
    console.log("SELECTED GEO: ", geoLocation);
  }

  render() {
    // @ts-ignore
    const { renderedRows, geoLocations } = this.state;
    return (
      <MDBox>
        <MDBox width="82%" textAlign="center" mx="auto" my={4}>
          <MDBox mb={1}>
            <MDTypography variant="h5" fontWeight="regular">
              Let&apos;s start with the basic information
            </MDTypography>
          </MDBox>
          <MDTypography variant="body2" color="text">
            Roughly where in the world are you?
          </MDTypography>
        </MDBox>
        <MDBox mt={2}>
          <Grid container spacing={3}>
            {/* <Grid item xs={12} sm={4} container justifyContent="center">
              <MDBox position="relative" height="max-content" mx="auto">
                <MDAvatar src={team2} alt="profile picture" size="xxl" variant="rounded" />
                <MDBox alt="spotify logo" position="absolute" right={0} bottom={0} mr={-1} mb={-1}>
                  <Tooltip title="Edit" placement="top">
                    <MDButton variant="gradient" color="info" size="small" iconOnly>
                      <Icon>edit</Icon>
                    </MDButton>
                  </Tooltip>
                </MDBox>
              </MDBox>
            </Grid> */}
            <Grid item xs={12} sm={8}>
              <MDBox mb={2}>
                <FormField type="text" label="City" onChange={this.handleChange} />
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>
        <MDBox p={2}>
          <Grid container>
            <Grid item xs={12} md={7} lg={6}>
              <TableContainer sx={{ height: "100%", boxShadow: "none" }}>
                <Table>
                  <TableBody>
                    {renderedRows.map((row) => {
                      return row;
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            {/* <Grid item xs={12} md={5} lg={6} sx={{ mt: { xs: 5, lg: 0 } }}>
              <VectorMap
                map={worldMerc}
                zoomOnScroll={false}
                zoomButtons={false}
                markersSelectable
                backgroundColor="transparent"
                selectedMarkers={["1", "3"]}
                markers={[
                  {
                    name: "USA",
                    latLng: [40.71296415909766, -74.00437720027804],
                  },
                  {
                    name: "Germany",
                    latLng: [51.17661451970939, 10.97947735117339],
                  },
                  {
                    name: "Brazil",
                    latLng: [-7.596735421549542, -54.781694323779185],
                  },
                  {
                    name: "Russia",
                    latLng: [62.318222797104276, 89.81564777631716],
                  },
                  {
                    name: "China",
                    latLng: [22.320178999475512, 114.17161225541399],
                  },
                ]}
                regionStyle={{
                  initial: {
                    fill: "#dee2e7",
                    "fill-opacity": 1,
                    stroke: "none",
                    "stroke-width": 0,
                    "stroke-opacity": 0,
                  },
                }}
                markerStyle={{
                  initial: {
                    fill: "#e91e63",
                    stroke: "#ffffff",
                    "stroke-width": 5,
                    "stroke-opacity": 0.5,
                    r: 7,
                  },
                  hover: {
                    fill: "E91E63",
                    stroke: "#ffffff",
                    "stroke-width": 5,
                    "stroke-opacity": 0.5,
                  },
                  selected: {
                    fill: "E91E63",
                    stroke: "#ffffff",
                    "stroke-width": 5,
                    "stroke-opacity": 0.5,
                  },
                }}
                style={{
                  marginTop: "-1.5rem",
                }}
                onRegionTipShow={() => false}
                onMarkerTipShow={() => false}
              />
            </Grid> */}
          </Grid>
        </MDBox>
      </MDBox>
    );
  }
}

export default About;
