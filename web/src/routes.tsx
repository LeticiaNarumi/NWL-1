import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import CreatePoint from "./Pages/CreatePoint";

const DefaultRouter = () => {
    return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create-point" element={<CreatePoint />} />
        </Routes>
    </BrowserRouter>
    )
}

export default DefaultRouter