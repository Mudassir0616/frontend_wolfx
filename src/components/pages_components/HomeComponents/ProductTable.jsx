"use client";
import { productApi } from "@/api/api";
import GlobalTable from "@/components/common_components/GlobalTable/GlobalTable";
import useFetch from "@/hooks/useFetch";
import React, { useState } from "react";
import ProductRow from "./ProductRow";
import GlobalForm from "@/components/common_components/GlobalForm/GlobalForm";
import { Drawer, MenuItem, Select, TextField } from "@mui/material";
import CardSkeletons from "@/utils/LoadingSkeletons/CardSkeletons";
import { countries_flag } from "@/utils/commonUtils";

const tableHeader = [
  {
    id: "title",
    numeric: false,
    disablePadding: false,
    label: "Name",
  },
  {
    id: "category",
    numeric: true,
    disablePadding: false,
    label: "Category",
  },
  {
    id: "description",
    numeric: true,
    disablePadding: false,
    label: "Description",
  },
  {
    id: null,
    numeric: true,
    disablePadding: false,
    label: "Image",
  },
  {
    id: "price",
    numeric: true,
    disablePadding: false,
    label: "price",
  },
  {
    id: "rating.rate",
    numeric: true,
    disablePadding: false,
    label: "Rate",
  },
];

const product_form_json = [
  {
    type: "text",
    name: "title",
    label: "Name",
    fullWidth: true,
    xs: 12,
    sm: 12,
    md: 6,
    lg: 6,
    validation_message: "Product Name is required",
    required: true,
  },
  {
    type: "number",
    name: "price",
    label: "Price",
    fullWidth: true,
    xs: 12,
    sm: 12,
    md: 6,
    lg: 6,
    validation_message: "Product price is required",
    required: true,
  },
  {
    type: "text",
    name: "description",
    label: "Description",
    fullWidth: true,
    xs: 12,
    sm: 12,
    md: 12,
    lg: 12,
    shrink: true,
    rows: 5,
    // validation_message: "Description is required",
  },
  {
    type: "select",
    name: "category",
    label: "Category",
    options: [
      { value: "men's clothing", label: "men's clothing" },
      { value: "jewelery", label: "jewelery" },
      { value: "electronics", label: "electronics" },
      { value: "women's clothing", label: "women's clothing" },
    ],
    fullWidth: true,
    required: true,
    xs: 12,
    sm: 12,
    md: 12,
    lg: 12,
    validation_message: "Category is required",
    required: true,
  },

  {
    name: "multi_select_field",
    type: "multi-select-checkbox",
    label: "Select Options",
    required: true,
    xs: 12,
    sm: 12,
    md: 12,
    lg: 12,
    validation_message: "At least one option must be selected",
    options: [
      { label: "Option 1", value: "option1" },
      { label: "Option 2", value: "option2" },
      { label: "Option 3", value: "option3" },
    ],
  },
  {
    name: "favorite_fruits",
    label: "Favorite Fruits",
    type: "multi-select-dropdown",
    required: true,
    validation_message: "Select at least one fruit",
    options: [
      { label: "Apple", value: "apple" },
      { label: "Banana", value: "banana" },
      { label: "Cherry", value: "cherry" },
    ],
    fullWidth: true,
    xs: 12,
    sm: 12,
    md: 12,
    lg: 12,
  },
  {
    type: "image",
    name: "image",
    label: "Product Image",
    fullWidth: true,
    xs: 12,
    sm: 12,
    md: 12,
    lg: 12,
    shrink: true,
    validation_message: "Image is required",
    required: true,
  },

  // color picker styles
];

const ProductTable = () => {
  const {
    data,
    setData,
    pageCount,
    setPageSelected,
    error,
    blur,
    fetchData,
    deleteItem,
    is_loading,
    setIs_loading,
  } = useFetch(productApi, "limit=10", 10);

  const [open_drawer, setOpen_drawer] = useState(false);
  const [open_edit_drawer, setOpen_edit_drawer] = useState(false);

  const on_Submit = async (data) => {
    setIs_loading(true);
    try {
      const res = await productApi.post("", data);
      setData((prev) => [...prev, res]);
    } catch (error) {
    } finally {
      setIs_loading(false);
      setOpen_drawer(false);
    }
  };

  return (
    <>
      <GlobalTable
        tableHeader={tableHeader}
        tableData={data}
        setData={setData}
        setPageSelected={setPageSelected}
        pageCount={pageCount}
        noToolbar={false}
        noCheckbox={false}
        showAdd={true}
        showEdit={true}
        add_btn_title={"Add Product"}
        title={"Products"}
        is_loading={is_loading}
        showSearch={true}
        deleteItem={deleteItem}
        openFormDrawer={() => setOpen_drawer(true)}
        openFormEditDrawer={() => setOpen_edit_drawer(true)}
        searchApi={productApi}
        searchPath={`category`}
        fetchData={() => fetchData("limit=10")}
      >
        <ProductRow
          open_edit_drawer={open_edit_drawer}
          setOpen_edit_drawer={setOpen_edit_drawer}
          product_form_json={product_form_json}
          data={data}
          setData={setData}
        />
      </GlobalTable>

      {/* // Add Drawer to Global */}
      <Drawer
        anchor="right"
        open={open_drawer}
        PaperProps={{
          sx: { width: { lg: "600px", sm: "80%", xs: "80%" }, padding: "20px" },
        }}
        onClose={() => setOpen_drawer(false)}
      >
        <GlobalForm form_config={product_form_json} on_Submit={on_Submit}>
       
        </GlobalForm>
      </Drawer>
    </>
  );
};

export default ProductTable;
