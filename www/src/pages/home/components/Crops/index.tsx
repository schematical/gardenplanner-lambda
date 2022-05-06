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
import HomeWizard from "../../index";
import { CropService } from "../../../../services/Crop.service";

export interface CropWizardComponentProps {
  wizardComponent: HomeWizard;
}
export interface CropWizardComponentState {
  crops: any[];
  renderedRows: any[];
  count: number;
  search: string;
}
class CropWizardComponent extends Component<CropWizardComponentProps, CropWizardComponentState> {
  wizardComponent: HomeWizard;

  constructor(props: any) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.selectCrop = this.selectCrop.bind(this);
    this.wizardComponent = props.wizardComponent;
    this.state = {
      crops: [],
      renderedRows: [],
      count: -1,
      search: null,
    };
    setInterval(() => {
      if (this.state.count < 0) {
        return;
      }
      if (this.state.count === 0) {
        this.getData();
      }
      // eslint-disable-next-line react/no-access-state-in-setstate
      this.setState((prevState) => ({
        count: prevState.count - 1,
      }));
    }, 2000);
  }

  async handleChange(e: any) {
    this.setState({
      search: e.target.value,
      count: 1,
    });
  }

  async getData() {
    const crops = await CropService.listCropSpecies({
      // eslint-disable-next-line react/no-access-state-in-setstate
      name: this.state.search,
    });

    const renderedRows = crops.map((crop: any, key: any) => {
      const tableRows: any = [];
      const rowKey = `row-${key}`;

      // Object.entries(geoLocation).map(([cellTitle, cellContent]: any) => {
      tableRows.push(
        <TableCell align="left" width="30%">
          <MDBox display="flex" alignItems="center" width="max-content">
            <MDBox display="flex" flexDirection="column" ml={3}>
              <MDTypography variant="button" fontWeight="regular" textTransform="capitalize">
                {crop.name}
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
                onClick={(e) => this.selectCrop(crop)}
              >
                Select
              </MDButton>
            </MDBox>
          </MDBox>
        </TableCell>
      );

      // });

      return <TableRow key={rowKey}>{tableRows}</TableRow>;
    });
    this.setState({
      crops,
      renderedRows,
    });
  }

  // @ts-ignore
  async selectCrop(geoLocation) {
    console.log("SELECTED GEO: ", geoLocation);
    this.wizardComponent.handleNext();
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
            What do you want to grow?
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
                <FormField type="text" label="Crops" onChange={this.handleChange} />
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
          </Grid>
        </MDBox>
      </MDBox>
    );
  }
}

export default CropWizardComponent;
