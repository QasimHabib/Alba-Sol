import React from 'react';
import './containers/Projects.css';
import { BrowserRouter as Router} from 'react-router-dom';
import SideNavBar from './components/SideNavBar';



function App() {

  

//   const[name,setName]=useState("");
//   const[age,setAge]=useState(0);
//   const[country,setCountry]=useState("");
//   const[position,setPosition]=useState("");
//   const[wage,setWage]=useState(0);
//   const[newwage,setNewWage]=useState(0);
//   const[show,setShow]=useState(false);
//   /*
//   สิ่งที่ getEmployees ทำ
//   Axios request รับค่าจาก http://localhost:3001/employees แล้วใส่ข้อมูล respond ลงไป ด้านในคือ respond.data หรือ req.body
//   ใส่ลงไปใน setEmployeeList
//   */
//   const [employeeList, setEmployeeList] =useState([]);
//   const getEmployees =()=>{
//     Axios.get("http://localhost:3001/projects").then((response)=>{
//         setEmployeeList(response.data);
//         setShow(!show);  
//         console.log(response.data);
//       }  
//     );
//   };

  

// /*
//   สิ่งที่ addEmployee ทำ
//   Axios request ส่งค่าไป http://localhost:3001/employees โดนมีข้อมูลคือจาก state ที่รับมาจาก event.target.value ของฟอร์ม
//   หลังจากนั้น setEmployeeList เพิ่มข้อมูลไปยัง employeeList โดย...spread operator เพื่อก๊อปปี้ข้อมูลเดิมก่อน แล้วแทรกข้อมูลใหม่ลงไป
//   let arrC = [1, 2, 3];
//   let arrD = [4, 5, 6];
//   arrC = [...arrC, ...arrD]; //ผลลัพธ์ ==> [1, 2, 3, 4, 5, 6]
//   ในที่นี้[...employeeList,{name: name,age: age,country: country,position: position,wage: wage,},]
//   =[ค่าเดิม,ค่าใหม่]
//   */
//   const addEmployee = () => {
//     Axios.post("http://localhost:3001/create", {
//       name: name,
//       age: age,
//       country: country,
//       position: position,
//       wage: wage,
//     }).then(() => {
//       setEmployeeList([
//         ...employeeList,
//         {
//           name: name,
//           age: age,
//           country: country,
//           position: position,
//           wage: wage,
//         }
//       ]);
//     });
//   };
// /*
// สิ่งที่ updateEmployeeWage ทำ
// Axios request updateค่าไปที่ http://localhost:3001/employees ค่าที่ส่งคือ wage: newwage(val.wage ที่ถูกดึงจาก event.target.value ของ input), 
// id: id(ส่งมาจาก input val.id)
// */ 
//   const updateEmployeeWage=(id)=>{
//     if (window.confirm("Are you sure")){
//     Axios.put("http://localhost:3001/updateWage", {
//       wage: newwage,
//       id: id
//     }).then((response)=>{
//       setEmployeeList(
//         employeeList.map((val)=>{
//           return val.id === id ? {
//             id:val.id,
//             name:val.name,
//             age:val.age,
//             country:val.country,
//             position:val.position,
//             wage:newwage
//           }:val;
//         })
//       );
//     });
//   }};

//   const deleteEmployee=(id)=>{
//     if (window.confirm("Delete the item?")) {
//     Axios.delete(`http://localhost:3001/delete/${id}`).then((response)=>{
//       setEmployeeList(
//         employeeList.filter((val)=>{
//           return val.id!==id;
//         })
//       );
//     });
//   }};
  return (
    <Router>
    <div className="App">
          <SideNavBar />
    </div>
    </Router>
  );
}

export default App;
