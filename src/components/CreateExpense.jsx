import { Box, Button, Input, useToast } from "@chakra-ui/react"
import MyDatePicker from "./common/MyDatePicker"
import { formatDate } from "@fullcalendar/core"
import SelectSupply from "./common/SelectSupply"
import { useState } from "react"
import axios from "axios"

const CreateExpense = () => {
    const toast = useToast();
    const currDate = new Date();
    const currTime = currDate.getHours() + ":"
        + currDate.getMinutes() + ":"
        + currDate.getSeconds();
    const [expenses, setExpenses] = useState([]);
    const [newExpense, setNewExpense] = useState({
        description: "",
        createdAt: `${currDate}`,
        date1: "",
        time1: currTime,
        amountReceived: 0,
        categories: []
    });
    const [selectSupplies, setSelectSupplies] = useState([]);

    const fetchExpense = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_BASE}/api/admin/getAllExpenses`
            );
            setExpenses(response.data);
        } catch (error) {
            console.error("Error fetching sources:", error);
        }
    };

    // console.log(expenses)

    const handleAddExpense = async () => {
        try {
            if (newExpense.length === 0) {
                toast({
                    title: "Error",
                    description: "Please fill all the fields",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            } else {
                await axios.post(`${import.meta.env.VITE_API_BASE}/api/admin/createExpenses`, newExpense);
                setNewExpense({
                    description: "",
                    createdAt: `${currDate}`,
                    date1: "",
                    time1: currTime,
                    amountReceived: 0,
                    categories: []
                });
                fetchExpense();
            }
        } catch (error) {
            console.error("Error adding source:", error);
        }
    };

    const handleExpenseChange = (field, value) => {
        let updatedService = { ...newExpense };
        const selectedexpense = expenses.find((product) => product._id === value);
        updatedService["categories"] = selectedexpense;
        setNewExpense(updatedService);
    };

    console.log(selectSupplies)

    return (
        <Box
            mx="auto"
            borderWidth="1px"
            borderRadius="lg"
            p="4"
            boxShadow="lg"
            m="4"
        >
            <h1 className="text-2xl font-semibold">Add Expense</h1>
            <p className="font-light mb-4">Fill the below form to add a new invoice</p>
            <div className="flex flex-col gap-3 max-w-[400px]">
                <Input
                    placeholder="Enter description"
                    value={newExpense.description}
                    onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                />
                <div>
                    <MyDatePicker
                        className="h-[40px]"
                        selected={newExpense.date1}
                        onChange={(date) =>
                            handleExpenseChange("date1", date)
                        } // Corrected to use 'date' instead of 'startDate'
                    // disabledDate={(current) => {
                    //   return newSupply.endDate && current > newSupply.endDate;
                    // }}
                    />
                    <div>{formatDate(newExpense?.date1)}</div>
                </div>
                <Input
                    placeholder="Amount"
                    value={newExpense?.amountReceived}
                    onChange={(e) => setNewExpense({ ...newExpense, amountReceived: e.target.value })}
                />
                <SelectSupply
                    selectSourceValue={selectSupplies}
                    setSelectSourceValue={setSelectSupplies}
                />
            </div>
            <Button
                mt={4}
                colorScheme="purple"
                onClick={handleAddExpense}
            >
                Craete Expense
            </Button>
        </Box>
    )
}

export default CreateExpense