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

import Timeline, { TimelineHeaders, SidebarHeader, DateHeader } from "react-calendar-timeline";
// make sure you include the timeline stylesheet or the timeline will not be styled
import "react-calendar-timeline/lib/Timeline.css";
import moment from "moment";
import { Component, useMemo } from "react";
import TableRow from "@mui/material/TableRow";
import Switch from "@mui/material/Switch";
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
    this.onCanvasClick = this.onCanvasClick.bind(this);
    this.wizardComponent = props.wizardComponent;
    this.state = {
      cropSpeciesDatas: []
    };
    this.getData();
  }

  async handleChange(e: any) {
    console.log(e);
  }

  async onCanvasClick(groupId, time, e){
    console.log("groupId, time, e", groupId, time, e);
  }

  async getData() {
    console.log("SELECTED CROPS: ", this.wizardComponent.state.crops);
    if (!this.wizardComponent.state.geoLocation) {
      this.wizardComponent.handleBack();
      return;
    }
    const cropSpeciesDatas: any[] = await CropService.getCropSpecieDataByGeoLocation({
      geoLocationId: this.wizardComponent.state.geoLocation._id,
      cropSpeciesIds: this.wizardComponent.state.crops.map((c) => c._id)
    });
    this.setState({
      cropSpeciesDatas
    });
  }


  async selectCrop(geoLocation) {
    console.log("SELECTED GEO: ", geoLocation);
    // this.wizardComponent.handleNext();
  }

  groupRenderer({ group }) {
    return (
        <div className="custom-group">
          {group.title}
        </div>
    )
  }

  render() {

    const groups = [];
    const items = [];
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
              Here are the optimal plant and harvest times for the crops you selected
            </MDTypography>
          </MDBox>
          {/* <MDTypography variant="body2" color="text">
            What do you want to grow?
          </MDTypography> */}
        </MDBox>
        <MDBox mt={2}>
          {
            this.state.cropSpeciesDatas.length > 0 &&
            <Timeline
              groups={groups}
              items={items}
              defaultTimeStart={moment().add(-3, "month")}
              visibleTimeStart={moment().add(-3, "month").toDate().getTime()}
              defaultTimeEnd={moment().add(9, "month")}
              visibleTimeEnd={moment().add(9, "month").toDate().getTime()}
              onCanvasClick={this.onCanvasClick}
              groupRenderer={this.groupRenderer}
            >
              <TimelineHeaders className="sticky">
                {/* <SidebarHeader>
                  {({ getRootProps }) => {
                    return <div {...getRootProps()}>Left</div>;
                  }}
                </SidebarHeader> */}
                <DateHeader unit="primaryHeader" />
                <DateHeader />
              </TimelineHeaders>
            </Timeline>
          }
        </MDBox>
        <MDBox width="82%" textAlign="center" mx="auto" my={4}>
          {/* <MDBox mb={1}>
            <MDTypography variant="h5" fontWeight="regular">
              Would you like reminder emails when its time to plant and harvest these crops?
            </MDTypography>
          </MDBox> */}
          <MDTypography variant="body2" color="text">
            Would you like reminder emails when its time to plant and harvest these crops?
          </MDTypography>
        </MDBox>
        <MDBox width="82%" textAlign="center" mx="auto" my={4}>
          <MDBox textAlign="center">
            <FormField type="email" label="Email"  InputLabelProps={{ shrink: true }} />
          </MDBox>
        </MDBox>
        <MDBox width="82%" textAlign="center" mx="auto" my={4}>
          <MDBox textAlign="center">
            <MDButton
                color="info"
            >
              Get Reminders
            </MDButton>
          </MDBox>
        </MDBox>
      </MDBox>
    );
  }
}

export default CropsSpeciesDataTableComponent;
