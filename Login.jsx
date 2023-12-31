import { Breadcrumbs, Button, FormControl, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { TextField } from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

import { Formik } from "formik";
import * as Yup from "yup";
import authService from "../service/auth.service";
import { toast } from "react-toastify";

import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../State/Slice/authSlice";
import shared from "../utils/shared";

const Login = () => {
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const authData = useSelector((state) => state.auth.user);
    const dispatch = useDispatch();

    useEffect(() => {
        const str = JSON.parse(localStorage.getItem("user"));
        if (str?.id) {
            dispatch(setUser(str));
            navigate("/");
        }
        const access = shared.hasAccess(pathname, authData);
        if (!access) {
            toast.warning("sorry, you are not authorized to access this page");
            navigate("/");
            return;
        }
        // eslint-disable-next-line
    }, []);

    const initialValues = {
        email: "",
        password: "",
    };
    const validate = Yup.object().shape({
        email: Yup.string()
            .email("Invalid email")
            .required("Email is Required"),
        password: Yup.string()
            .min(8, "Password must be atleast 8 characters")
            .required("Password is required"),
    });

    const onSubmit = (values) => {
        authService
            .login(values)
            .then((res) => {
                delete res._id;
                delete res.__v;
                // authContext.setUser(res);
                dispatch(setUser(res));
                navigate("/");
                toast.success("Logged In Successfully");
            })
            .catch((err) => {
                console.log(err);
            });
    };
    const breadcrumbs = [
        <Link to={"/"} underline="hover" key="1" color="inherit" href="/">
            Home
        </Link>,

        <Typography key="2" color={{ color: "#f14d54" }}>
            Login
        </Typography>,
    ];
    return (
        <div className="flex-1" style={{ width: "96%", margin: "auto" }}>
            <Breadcrumbs
                separator={<NavigateNextIcon fontSize="small" />}
                aria-label="breadcrumb"
                sx={{
                    display: "flex",
                    marginTop: "10px",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                {breadcrumbs}
            </Breadcrumbs>
            <Typography
                variant="h4"
                sx={{
                    display: "flex",
                    marginTop: "5px",
                    marginBottom: "15px",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                Login or Create an Account
            </Typography>
            <div className="flex items-center justify-center m-6">
                <div className="border-t-2 border-[#f14d54] w-32"></div>
            </div>
            <div
                className="grid grid-cols-2 gap-36 mt-12"
                style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "10px",
                    marginBottom: "10px",
                }}
            >
                <div
                    className="ml-40"
                    style={{
                        width: "40%",
                        marginRight: "10%",
                        borderRight: "1px solid black",
                    }}
                >
                    <Typography variant="h6">New Customer</Typography>
                    {/* <Divider
                        sx={{
                            marginTop: "20px",
                            width: "inherit",
                        }}
                    /> */}
                    <hr style={{ width: "50%" }} />
                    <Typography variant="body2" sx={{ marginTop: "20px" }}>
                        Registration is free and easy.
                    </Typography>

                    <ul className="list-disc mt-5 ml-5">
                        <li>Faster Checkout</li>
                        <li>Save Multiple shipping addresses</li>
                        <li>View and track orders and more</li>
                    </ul>
                    <Button
                        variant="contained"
                        sx={{
                            color: "white",
                            backgroundColor: "#f14d54",
                            "&:hover": {
                                backgroundColor: "#f14d54", // Change the hover background color
                            },
                            textTransform: "capitalize",
                        }}
                        onClick={() => {
                            navigate("/register");
                        }}
                    >
                        Create an Account
                    </Button>
                </div>
                <div style={{ width: "30%" }}>
                    <Typography variant="h6">Registered Customers</Typography>
                    {/* <Divider
                        sx={{
                            marginTop: "20px",
                            marginRight: "160px",
                        }}
                    /> */}
                    <hr style={{ width: "80%" }} />
                    <Typography variant="body2" sx={{ marginTop: "20px" }}>
                        If you have an account with us, please log in.
                    </Typography>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validate}
                        onSubmit={onSubmit}
                    >
                        {({
                            values,
                            errors,
                            touched,
                            handleChange,
                            handleBlur,
                            handleSubmit,
                            isSubmitting,
                        }) => (
                            <form onSubmit={handleSubmit} className="">
                                <FormControl
                                    fullWidth
                                    sx={{ marginTop: "10px" }}
                                >
                                    <label>Email Address</label>
                                    <TextField
                                        size="small"
                                        type="email"
                                        name="email"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.email}
                                        sx={{
                                            width: "357px",
                                            marginTop: "5px",
                                        }}
                                    />
                                    <div className="text-red-600">
                                        {errors.email &&
                                            touched.email &&
                                            errors.email}
                                    </div>
                                </FormControl>
                                <FormControl
                                    fullWidth
                                    sx={{ marginTop: "10px" }}
                                >
                                    <label>Password</label>
                                    <TextField
                                        type="password"
                                        name="password"
                                        size="small"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.password}
                                        sx={{
                                            width: "357px",
                                            marginTop: "5px",
                                        }}
                                    />
                                    <div className="text-red-600">
                                        {errors.password &&
                                            touched.password &&
                                            errors.password}
                                    </div>
                                </FormControl>
                                <Button
                                    variant="contained"
                                    type="submit"
                                    sx={{
                                        color: "white",
                                        backgroundColor: "#f14d54",
                                        "&:hover": {
                                            backgroundColor: "#f14d54", // Change the hover background color
                                        },
                                        marginTop: "15px",
                                        marginBottom: "10px",
                                    }}
                                >
                                    Submit
                                </Button>
                            </form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    );
};

export default Login;
