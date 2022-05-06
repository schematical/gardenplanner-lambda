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

import Timeline from "react-calendar-timeline";
// make sure you include the timeline stylesheet or the timeline will not be styled
import "react-calendar-timeline/lib/Timeline.css";
import moment from "moment";
import { Component, useMemo } from "react";
import TableRow from "@mui/material/TableRow";
import MDButton from "../../../../components/MDButton";
import HomeWizard from "../../index";
import { CropService } from "../../../../services/Crop.service";

export interface CropsSpeciesDataTableComponentProps {
  wizardComponent: HomeWizard;
}
export interface CropsSpeciesDataTableComponentState {
  cropSpeciesDatas?: any[]
}
class CropsSpeciesDataTableComponent extends Component<
  CropsSpeciesDataTableComponentProps,
  CropsSpeciesDataTableComponentState
> {
  wizardComponent: HomeWizard;

  constructor(props: any) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.selectCrop = this.selectCrop.bind(this);
    this.wizardComponent = props.wizardComponent;
    this.state = {
      cropSpeciesDatas: []
    };
    this.getData();
  }

  async handleChange(e: any) {
    console.log(e);
  }

  async getData() {
    if (!this.wizardComponent.state.geoLocation) {
      this.wizardComponent.handleBack();
      return;
    }
    const cropSpeciesDatas: any[] = await CropService.getCropSpecieDataByGeoLocation(
        this.wizardComponent.state.geoLocation._id
    );
    this.setState({
      cropSpeciesDatas
    });
  }

  // @ts-ignore
  async selectCrop(geoLocation) {
    console.log("SELECTED GEO: ", geoLocation);
    // this.wizardComponent.handleNext();
  }

  render() {

    const groups = [
      /* { id: 1, title: "group 1" },
      { id: 2, title: "group 2" }, */
    ];
    const items = [
      /* {
        id: 1,
        group: 1,
        title: "item 1",
        start_time: moment(),
        end_time: moment().add(1, "month"),
      },
      {
        id: 2,
        group: 2,
        title: "item 2",
        start_time: moment().add(-0.5, "month"),
        end_time: moment().add(0.5, "month"),
      },
      {
        id: 3,
        group: 1,
        title: "item 3",
        start_time: moment().add(2, "month"),
        end_time: moment().add(3, "month"),
      }, */
    ];
    this.state.cropSpeciesDatas.forEach((cropSpeciesData, i) => {
      // x
      groups.push({
        id: cropSpeciesData.cropSpecies._id,
        title: cropSpeciesData.cropSpecies.name,
      });
      items.push({
        id: `${cropSpeciesData.cropSpecies._id  }_plant`,
        group: cropSpeciesData.cropSpecies._id,
        title: "Plant",
        start_time: moment().month(cropSpeciesData.earlyStartMonth),
        end_time: moment().month(cropSpeciesData.lateStartMonth) // .add(0.5, "month"),
      });
      items.push({
        id: `${cropSpeciesData.cropSpecies._id  }_harvest`,
        group: cropSpeciesData.cropSpecies._id,
        title: "Harvest",
        start_time: moment().month(cropSpeciesData.lateStartMonth).add(cropSpeciesData.cropSpecies.harvestDayMin, 'day'),
        end_time: moment().month(cropSpeciesData.lateStartMonth).add(cropSpeciesData.cropSpecies.harvestDayMax, 'day'),
      });
    });

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
          {/* <Grid container spacing={3}> */}
          <Timeline
            groups={groups}
            items={items}
            defaultTimeStart={moment().add(-3, "month")}// visibleTimeStart={moment().add(-3, "month").toDate().getTime()}
            defaultTimeEnd={moment().add(9, "month")}
            // visibleTimeEnd={moment().add(9, "month").toDate().getTime()}
          />
          {/* </Grid> */}
        </MDBox>
      </MDBox>
    );
  }
}

export default CropsSpeciesDataTableComponent;
