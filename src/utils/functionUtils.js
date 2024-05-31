export const handle_edit = async (edit_data, api, path, id, state, setState, set_open) => {
    let res;
    try {
        res = await api.patch(path, edit_data);

        const indexToUpdate = state?.findIndex((item) => item.id === id);

        if (indexToUpdate > -1) {
            // Replace the item at found index with the updated item from the response
            const updatedData = [...state];
            updatedData[indexToUpdate] = res; // Assuming `res.data` contains the updated item
            setState(updatedData);
        }
    } catch (error) {
        console.error("Error updating item:", error);
    } finally {
        set_open(false);
    }

    return res;
};

const form_json = [
    {
        type: "text",
        name: "convertible_note_name",
        label: "Convertible Note Name",
        fullWidth: true,
        xs: 12,
        sm: 12,
        md: 6,
        lg: 6,
        validation_message: "Convertible Note Name is required",
    },
    {
        type: "text",
        name: "beneficiary_type",
        label: "Beneficiary Type",
        fullWidth: true,
        xs: 12,
        sm: 12,
        md: 6,
        lg: 6,
        validation_message: "Beneficiary Type is required",
    },
    {
        type: "date",
        name: "issue_date",
        label: "Issue Date",
        fullWidth: true,
        xs: 12,
        sm: 12,
        md: 6,
        lg: 6,
        shrink: true,
        validation_message: "Issue Date is required",
    },
    {
        type: "date",
        name: "maturity_date",
        label: "Maturity Date",
        fullWidth: true,
        xs: 12,
        sm: 12,
        md: 6,
        lg: 6,
        shrink: true,
        validation_message: "Maturity Date is required",
    },
    {
        type: "number",
        name: "principal_investment",
        label: "Principal Investment",
        fullWidth: true,
        xs: 12,
        sm: 12,
        md: 6,
        lg: 6,
        validation_message: "Principal Investment is required",
    },
    {
        type: "number",
        name: "interest_rate",
        label: "Interest Rate %",
        fullWidth: true,
        xs: 12,
        sm: 12,
        md: 6,
        lg: 6,
        validation_message: "Interest Rate is required",
    },
    {
        type: "number",
        name: "valuation_cap",
        label: "Valuation Cap",
        fullWidth: true,
        xs: 12,
        sm: 12,
        md: 6,
        lg: 6,
        validation_message: "Valuation Cap is required",
    },
    {
        type: "number",
        name: "discount",
        label: "Discount %",
        fullWidth: true,
        xs: 12,
        sm: 12,
        md: 6,
        lg: 6,
        validation_message: "Discount is required",
    },
];
