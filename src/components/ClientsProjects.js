import React, { useState, useEffect } from 'react';
import axios from 'axios';
var qs = require('qs');
 
function App() {
  const [data, setData] = useState({ hits: [] });
 
  useEffect(() => {
    const fetchData = async () => {
        var data = qs.stringify({
            'entreprise_name': 'Ado' 
        });

        var config = {
             method: 'get',
             url: 'http://192.168.100.232:3001/client-projects',
             headers: { 
               'Content-Type': 'application/x-www-form-urlencoded'
             },
             data : data
        };

        console.log(config);
           
        axios(config)
           .then(function (response) {
             console.log(JSON.stringify(response.data));
           })
           .catch(function (error) {
             console.log(error);
        });
    };
    fetchData();
  }, []);
 
  return (
    <ul>

    </ul>
  );
}
 
export default App;
