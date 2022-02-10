import React from 'react';
import Loader from "react-loader-spinner";
import './LoaderSpinner.css';

function LoaderSpinner() {
    return (
        <div className="loader-spinner">
            <Loader
            type="Oval"
            color="#B84257"
            height={100}
            width={100}
            />
        </div>
    );
}

export default LoaderSpinner;