import * as React from "react";
import Box from "@mui/material/Box";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";

const ITEM_HEIGHT = 40;
const ITEM_PADDING_TOP = 2;
const BORDER_RADIUS = 8;
const BORDER_WIDTH = 2;

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 5 + ITEM_PADDING_TOP + BORDER_RADIUS,
      width: 250,
    },
    MenuListProps: {
      disablePadding: true,
    },
  },
};

const Dropdown = ({
  handleChange,
  listItems,
  selectedValue,
  label = "",
  sx,
  name = "",
  size = "small",
  inputLabelSx,
  placeholder = "",
  ...restProps
}) => {
  return (
    <FormControl fullWidth sx={{ ...sx }}>
      <InputLabel id="demo-simple-select-label" sx={inputLabelSx}>
        {label}
      </InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        onChange={(e) =>
          handleChange({ fieldName: name, fieldValue: e.target.value })
        }
        value={selectedValue}
        MenuProps={MenuProps}
        {...restProps}
        IconComponent={ExpandMoreIcon}
        size={size}
        displayEmpty
        sx={{
          color: "#fff",
        }}
      >
        <MenuItem disabled value="">
          <Typography variant="body1" color="#a3a3a3">
            {placeholder}
          </Typography>
        </MenuItem>
        {listItems?.map((items, i) => (
          <MenuItem
            value={items?.value}
            sx={{
              borderBottom: "1px solid #F4F4F6",
            }}
          >
            {items?.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default Dropdown;
