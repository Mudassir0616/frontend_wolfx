"use client";
import { productApi } from "@/api/api";
import GlobalForm from "@/components/common_components/GlobalForm/GlobalForm";
import { handle_edit } from "@/utils/functionUtils";
import { Checkbox, Drawer, TableCell, TableRow } from "@mui/material";
import React, { useState } from "react";

const ProductRow = ({
  row,
  handleSelect,
  isSelected,
  open_edit_drawer,
  setOpen_edit_drawer,
  product_form_json,
  data,
  setData,
}) => {
  const [selected_item, setSelected_item] = useState(null);

  const on_Edit = async (edit_data) => {
    const res = await handle_edit(
      edit_data,
      productApi,
      `/${selected_item?.id}`,
      selected_item?.id,
      data,
      setData,
      setOpen_edit_drawer
    );
    
    if (res) {
      setSelected_item(res);
    }
  };

  return (
    <>
      {row?.map((data, index) => {
        const isItemSelected = isSelected(data?.id);
        const labelId = `enhanced-table-checkbox-${index}`;

        return (
          <TableRow
            hover
            onClick={(event) => {
              handleSelect(event, data?.id);
              setSelected_item(data);
            }}
            role="checkbox"
            aria-checked={isItemSelected}
            tabIndex={-1}
            key={row.id}
            selected={isItemSelected}
            sx={{ cursor: "pointer" }}
            className="tableRow"
          >
            <TableCell padding="checkbox">
              <Checkbox
                color="primary"
                checked={isItemSelected}
                inputProps={{
                  "aria-labelledby": labelId,
                }}
              />
            </TableCell>
            <TableCell>{data?.title}</TableCell>
            <TableCell>{data?.category}</TableCell>

            <TableCell>{data?.description}</TableCell>
            <TableCell>
              <img src={data?.image} alt="product" width={40} height={40} />
            </TableCell>
            <TableCell>{data?.price}</TableCell>
            <TableCell>{data?.rating?.rate}</TableCell>
          </TableRow>
        );
      })}

      {/* // Edit Drawer to Global */}
      <Drawer
        anchor="right"
        open={open_edit_drawer}
        PaperProps={{
          sx: { width: { lg: "600px", sm: "80%", xs: "80%" }, padding: "20px" },
        }}
        onClose={() => setOpen_edit_drawer(false)}
      >
        <GlobalForm
          form_config={product_form_json}
          editingValues={selected_item}
          on_Submit={on_Edit}
        />
      </Drawer>
    </>
  );
};

export default ProductRow;
