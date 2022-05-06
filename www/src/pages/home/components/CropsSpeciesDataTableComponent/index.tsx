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
  crops: any[];
  renderedRows: any[];
  count: number;
  search: string;
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
    const groups = [
      { id: 1, title: "group 1" },
      { id: 2, title: "group 2" },
    ];

    const items = [
      {
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
      },
    ];
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
            defaultTimeStart={moment().add(-3, "month")}
            defaultTimeEnd={moment().add(9, "month")}
          />
          {/* </Grid> */}
        </MDBox>
      </MDBox>
    );
  }
}

export default CropsSpeciesDataTableComponent;
