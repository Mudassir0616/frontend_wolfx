"use client";
import { useState } from "react";
import { useFormik, Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Radio,
  RadioGroup,
  Select,
  TextField,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { useDropzone } from "react-dropzone";

const GlobalForm = ({
  form_config,
  custom_schema,
  on_Submit,
  editingValues,
  children,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const validationSchema = Yup.object().shape(
    form_config.reduce((schema, field) => {
      if (field?.required) {
        if (field.type === "select" || field.type === "radio") {
          schema[field.name] = Yup.string().required(field.validation_message);
        } else if (field.type === "number") {
          schema[field.name] = Yup.number().required(field.validation_message);
        } else if (field.type === "date") {
          let dateSchema = Yup.date().required(field.validation_message);
          if (field.min_date) {
            const minDate = new Date(field.min_date);
            dateSchema = dateSchema.min(
              minDate,
              `Date must be at least ${minDate.toLocaleDateString()}`
            );
          }
          schema[field.name] = dateSchema;
        } else if (field.type === "password") {
          schema[field.name] = Yup.string()
            .required("Password is required")
            .min(8, "Password must be at least 8 characters long")
            .matches(
              /[a-z]/,
              "Password must contain at least one lowercase letter"
            )
            .matches(
              /[A-Z]/,
              "Password must contain at least one uppercase letter"
            )
            .matches(/[0-9]/, "Password must contain at least one number")
            .matches(
              /[@$!%*?&#]/,
              "Password must contain at least one special character"
            );
        } else if (field.type === "image") {
          schema[field.name] = Yup.mixed().required(field.validation_message);
        } else if (field.type === "multi-select-dropdown") {
          schema[field.name] = Yup.array()
            .of(Yup.string())
            .min(1, field.validation_message)
            .required(field.validation_message);
        } else if (field.type === "multi-select-checkbox") {
          schema[field.name] = Yup.array()
            .of(Yup.string())
            .min(1, field.validation_message)
            .required(field.validation_message);
        } else {
          schema[field.name] = Yup.string().required(field.validation_message);
        }
      }

      return schema;
    }, {})
  );

  // const initialValues = form_config.reduce((values, field) => {
  //   if (field.type === "date") {
  //     values[field.name] = field.default_date ? field.default_date : "";
  //   } else {
  //     values[field.name] = "";
  //   }
  //   return values;
  // }, {});

  const initialValues = form_config.reduce((values, field) => {
    if (field.type === "date") {
      values[field.name] = field.default_date ? field.default_date : "";
    } else if (
      field.type === "multi-select-checkbox" ||
      field.type === "multi-select-dropdown"
    ) {
      values[field.name] = [];
    } else {
      values[field.name] = "";
    }
    return values;
  }, {});

  const ImageUpload = ({ field, form }) => {
    const onDrop = (acceptedFiles) => {
      form.setFieldValue(field.name, URL.createObjectURL(acceptedFiles[0]));
    };

    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    return (
      <div {...getRootProps({ className: "dropzone" })}>
        <input {...getInputProps()} />
        {field.value ? (
          <div>
            <img
              //   src={URL.createObjectURL(field.value)}
              src={field.value}
              alt="Preview"
              width="100"
            />
            <p>{field.value.name}</p>
          </div>
        ) : (
          <p>Drag & drop an image here, or click to select one</p>
        )}
      </div>
    );
  };

  return (
    <Formik
      initialValues={editingValues ? editingValues : initialValues}
      validationSchema={custom_schema ? custom_schema : validationSchema}
      onSubmit={(values) => {
        on_Submit(values);
      }}
    >
      {({ errors, touched, setFieldValue, values }) => {
        console.log("form values", values);
        return (
          <Form>
            <Grid container spacing={2}>
              {form_config?.map((input) => {
                const handleClickShowPassword = () =>
                  setShowPassword(!showPassword);
                const handleMouseDownPassword = (event) => {
                  event.preventDefault();
                };

                return (
                  <Grid
                    item
                    xs={input.xs}
                    sm={input.sm}
                    md={input.md}
                    lg={input.lg}
                    key={input.name}
                  >
                    {input.type === "radio" ? (
                      <FormControl
                        component="fieldset"
                        error={
                          touched[input.name] && Boolean(errors[input.name])
                        }
                      >
                        <FormLabel component="legend">{input.label}</FormLabel>
                        <RadioGroup
                          row
                          name={input.name}
                          value={values[input.name]}
                          onChange={(event) =>
                            setFieldValue(input.name, event.target.value)
                          }
                        >
                          {input.options.map((option) => (
                            <FormControlLabel
                              key={option.value}
                              value={option.value}
                              control={<Radio />}
                              label={option.label}
                            />
                          ))}
                        </RadioGroup>
                        {touched[input.name] && Boolean(errors[input.name]) && (
                          <div className="error">{errors[input.name]}</div>
                        )}
                      </FormControl>
                    ) : input.type === "date" ? (
                      <FormControl fullWidth={input.fullWidth}>
                        <LocalizationProvider
                          dateAdapter={AdapterDateFns}
                          key={input.name}
                        >
                          <Field name={input.name}>
                            {({ field }) => (
                              <DatePicker
                                {...field}
                                label={input.label}
                                value={values[input.name]}
                                minDate={
                                  input.min_date ? input.min_date : undefined
                                }
                                onChange={(date) => {
                                  setFieldValue(input.name, date);
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    InputLabelProps={{
                                      shrink: input.shrink,
                                    }}
                                    error={
                                      touched[input.name] &&
                                      Boolean(errors[input.name])
                                    }
                                    helperText={
                                      touched[input.name] && errors[input.name]
                                    }
                                  />
                                )}
                              />
                            )}
                          </Field>
                        </LocalizationProvider>
                        {touched[input.name] && Boolean(errors[input.name]) && (
                          <div className="error">{errors[input.name]}</div>
                        )}
                      </FormControl>
                    ) : input.type === "password" && input.show_password ? (
                      <FormControl fullWidth={input.fullWidth}>
                        <Field name={input.name}>
                          {({ field }) => (
                            <TextField
                              {...field}
                              type={showPassword ? "text" : "password"}
                              label={input.label}
                              fullWidth={input.fullWidth}
                              InputLabelProps={{
                                shrink: input.shrink,
                              }}
                              error={
                                touched[field.name] &&
                                Boolean(errors[field.name])
                              }
                              helperText={
                                touched[field.name] && errors[field.name]
                              }
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <IconButton
                                      aria-label="toggle password visibility"
                                      onClick={handleClickShowPassword}
                                      onMouseDown={handleMouseDownPassword}
                                      edge="end"
                                    >
                                      {showPassword ? (
                                        <Visibility />
                                      ) : (
                                        <VisibilityOff />
                                      )}
                                    </IconButton>
                                  </InputAdornment>
                                ),
                              }}
                            />
                          )}
                        </Field>
                      </FormControl>
                    ) : input.type === "image" ? (
                      <FormControl fullWidth={input.fullWidth}>
                        <Field name={input.name}>
                          {({ field, form }) => (
                            <ImageUpload field={field} form={form} />
                          )}
                        </Field>
                        {touched[input.name] && Boolean(errors[input.name]) && (
                          <div className="error-text">{errors[input.name]}</div>
                        )}
                      </FormControl>
                    ) : input.type === "multi-select-checkbox" ? (
                      <FormControl
                        component="fieldset"
                        error={
                          touched[input.name] && Boolean(errors[input.name])
                        }
                      >
                        <FormLabel component="legend">{input.label}</FormLabel>
                        <Grid container>
                          {input.options.map((option) => (
                            <Grid item xs={12} sm={6} key={option.value}>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={values?.[input.name]?.includes(
                                      option.value
                                    )}
                                    onChange={(event) => {
                                      const set = new Set(values?.[input.name]);
                                      if (event.target.checked) {
                                        set.add(option.value);
                                      } else {
                                        set.delete(option.value);
                                      }
                                      setFieldValue(
                                        input.name,
                                        Array.from(set)
                                      );
                                    }}
                                  />
                                }
                                label={option.label}
                              />
                            </Grid>
                          ))}
                        </Grid>
                        {touched[input.name] && Boolean(errors[input.name]) && (
                          <div className="error-text">{errors[input.name]}</div>
                        )}
                      </FormControl>
                    ) : input.type === "multi-select-dropdown" ? (
                      <FormControl fullWidth={input.fullWidth}>
                        <InputLabel>{input.label}</InputLabel>
                        <Field name={input.name}>
                          {({ field }) => (
                            <Select
                              {...field}
                              multiple
                              value={values[input.name]}
                              onChange={(event) =>
                                setFieldValue(input.name, event.target.value)
                              }
                              input={<OutlinedInput label={input.label} />}
                              renderValue={(selected) => selected.join(", ")}
                              error={
                                touched[field.name] &&
                                Boolean(errors[field.name])
                              }
                            >
                              {input?.options?.map((option) => (
                                <MenuItem
                                  key={option?.value}
                                  value={option?.value}
                                >
                                  <Checkbox
                                    checked={values?.[input?.name]?.includes(
                                      option?.value
                                    )}
                                  />
                                  <ListItemText primary={option?.label} />
                                </MenuItem>
                              ))}
                            </Select>
                          )}
                        </Field>
                        {touched[input.name] && Boolean(errors[input.name]) && (
                          <div className="error-text">{errors[input.name]}</div>
                        )}
                      </FormControl>
                    ) : (
                      <Field name={input.name}>
                        {({ field }) => (
                          <TextField
                            {...field}
                            type={input.type}
                            label={input.label}
                            fullWidth={input.fullWidth}
                            select={input.type === "select"}
                            InputLabelProps={{
                              shrink: input.shrink,
                            }}
                            rows={input.rows}
                            multiline={input.rows ? true : false}
                            error={
                              touched[field.name] && Boolean(errors[field.name])
                            }
                            helperText={
                              touched[field.name] && errors[field.name]
                            }
                            onKeyPress={
                              input.type === "number"
                                ? (e) => {
                                    // Allow only numbers and the decimal point
                                    if (!/[0-9.]/.test(e.key)) {
                                      e.preventDefault();
                                    }
                                  }
                                : undefined
                            }
                          >
                            {input.type === "select" &&
                              input.options.map((option) => (
                                <MenuItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </MenuItem>
                              ))}
                          </TextField>
                        )}
                      </Field>
                    )}
                  </Grid>
                );
              })}

              {children} {/* Render custom fields here */}
            </Grid>

            <Button
              type="submit"
              variant="contained"
              color="info"
              style={{ marginTop: "16px" }}
            >
              Submit
            </Button>
          </Form>
        );
      }}
    </Formik>
  );
};

export default GlobalForm;
