import React from 'react';
import './Pagination.css';


const Pagination = (props) => {
    const pageNumbers = [];

    for(let i=1; i <= Math.ceil(props.totalClients / props.clientsPerPage); i++){
        pageNumbers.push(i);
    }

    return (
        <nav className="d-flex justify-content-end container">
            <ul className="pagination" style={props.style}>
                <li className="page-item">
                    <a onClick={props.prev} className="page-link"><i className="fas fa-chevron-left"></i></a>
                </li>
                {/* {pageNumbers.map(number => (
                    <li key={number} className="page-item">
                        <a onClick={() => props.paginate(number)} className="page-link">
                            {number}
                        </a>
                    </li>
                ))} */}
                <li className="page-item" style={props.numStyle}>
                    <a className="page-link">
                    {/* {pageNumbers[0]} / {pageNumbers.length} */}
                    {props.pageNo} / {props.totalClients}
                    </a>
                </li>
                <li className="page-item">
                    <a onClick={props.next} className="page-link"><i className="fas fa-chevron-right"></i></a>
                </li>
            </ul>
            
        </nav>
    );
};

export default Pagination;