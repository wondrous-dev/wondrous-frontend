import PropTypes from "prop-types";

import Grid from "@mui/material/Grid";

const ListLayout = ({ children }) => (
  <Grid container spacing={2}>
    {children}
  </Grid>
);

ListLayout.propTypes = {};

export default ListLayout;
