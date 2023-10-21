import React, { useEffect, useState } from "react";
import axios from 'axios';
import Table from 'react-bootstrap/Table';

const ViewUserSellingHistory = () => {
  const [sellingHistory, setSellingHistory] = useState([]);

  useEffect(() => {
    const accountID = 9;
    
    // Fetch selling history based on the account identifier
    axios.get(`http://localhost:5000/api/users/getUserSellingHistory/${accountID}`)
      .then(sellingHistoryResponse => {
        setSellingHistory(sellingHistoryResponse.data);
      })
      .catch(sellingHistoryError => {
        console.error("Failed to fetch selling history:", sellingHistoryError);
      });

  }, []);

  return (
    <div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Order Status</th>
          </tr>
        </thead>
        <tbody>
          {sellingHistory.map((sale) => (
            <tr key={sale.saleID}>
              <td>{sale.orderID}</td>
              <td>{sale.order.orderStatus}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ViewUserSellingHistory;
