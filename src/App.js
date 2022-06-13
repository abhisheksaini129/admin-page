import './App.css';
import axios from "axios";
import { useState ,useEffect} from 'react';

function App() {
 const dataPerPage=10;
  useEffect(()=>{
   const fetchdata=async ()=>{
     setLoading(true);
     const response = await axios.get("https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json",{});
     setdata(response.data);
     setLoading(false);
    }
    fetchdata();
  },[]);
  const [data, setdata] = useState([]);
  const [currPage,setPage] = useState(1);
  const [loading,setLoading]=useState(false);
  const [editFlag,setEdit]=useState(false);
  const [key,setKey]=useState(0);
  const [searchItem,setSearchItem]=useState("");
  const [deleteAll,setDeleteAll]=useState(false);
  
/////////////////////edited data storing hooks /////////////////

  const[newUserName,setNewUserName]=useState("");
  const[newUserEmail,setNewUserEmail]=useState("");
  const[newUserRole,setNewUserRole]=useState("");


  ///////////////////searching keyword method/////////

  const searchingKeys=["name","email","role"];
  const  searchingProcess=()=>{
    return( data.filter(user =>
    searchingKeys.some(key=>user[key].toLowerCase().includes(searchItem))
    ));
  }

  ///////////////current page content management /////////////////////////
  
  const indexOfLastData=currPage*dataPerPage;
  const indexOfFirstData=indexOfLastData-dataPerPage;
  let currentData = searchingProcess(data).slice(indexOfFirstData,indexOfLastData);
  ///////////////pagging material//////////////////////
  const PageNumbers=[];
    for(let i=1;i<=Math.ceil(searchingProcess(data).length / dataPerPage);i++){
        PageNumbers.push(i);
    }
    ////// if you delete all data of last page it will take you last second page
    if(PageNumbers.length < currPage && PageNumbers.length>0){
      setPage(PageNumbers.length);
    } 

    ////////////handling page  operation (NEXT----PREV)  ///////////////////////
    const handlePrevPage = ()=>{
      if(currPage === 1){
        return;
      }else {
        setPage(currPage-1);
      }
    }
    const handleNextPage = ()=>{
      if(currPage >= PageNumbers.length){
        return;
      }else {
        setPage(currPage+1);
      }
    }
    //////////////////// user data edit operation /////////////////
  const handleEditData=(id)=>{
    if(editFlag === false){
      setKey(id);
      setEdit(!editFlag);
    }else{
      setKey(id);
      if(key === id){
        setEdit(!editFlag);
      }
    }
  //  setEdit(false);
  }

  //////////////////// user data delete operations ////////////

  //////it is for one by one delete operation
  const handleDeleteData=(id)=>{
    setEdit(false);
    setdata( data.filter((user)=>user.id !== id ));
  }
  ////// if we select all for delete operation
  const handleDeleteAll=()=>{
    setDeleteAll(!deleteAll);
  }
  /// if delete all is selected
  const deleteProcess=()=>{
    if(deleteAll){
      setDeleteAll(!deleteAll);
     setdata(data.filter((user)=> user.id < indexOfFirstData || user.id > indexOfLastData));
    }/// if no data is selected to delete
    else{
      alert("Mark some data for delete Operation");
    }
  }


    /////// we want to save the edited text in the data field//////////////////////
  const handleSave =(id)=>{
    for(let i= 0;i<data.length;i++){
      if(data[i].id === id){
        if(newUserEmail.length> 1){
          data[i].email=newUserEmail;
        }
        if(newUserName.length>1){
          data[i].name=newUserName;
        }
        if(newUserRole.length>1){
          data[i].role=newUserRole;
        }
        handleEditData(0);
      }
    }
  }

  return (
    <div className="App">
      <div className="bodyArea">
      <h2>ADMIN PANEL</h2>
     <input type="text" className='inputbox' onChange={(e)=>setSearchItem(e.target.value)} placeholder='Search by name, email or role' />
     <div className="contentBody">
     <div className='card menuArea'>
       <div> 
        <input type="checkbox"  value="user"
            checked={deleteAll}
            onChange={()=>handleDeleteAll()}
         />Select All</div>
       <div>Name</div>
       <div>Email</div>
       <div>Role</div>
       <div>Actions</div>
     </div>
     {
      loading?
      <p>Fetching Data...Please wait</p>
      :
      <>
     { currentData.map((user,index)=>{
        return(
      <div className="card userdata" id={index}>
        { (editFlag && key === user.id)? 
        <>
        <p></p>
        <input className='editTab' type="text" placeholder={user.name} onChange={(e)=>(setNewUserName(e.target.value))}></input>
        <input className='editTab' type="text" placeholder={user.email}  onChange={(e)=>(setNewUserEmail(e.target.value))}></input>
        <input className='editTab' type="text" placeholder={user.role} onChange={(e)=>(setNewUserRole(e.target.value))}></input>
        <div className='Button-div'> 
        <svg  className="Layer_1 save" onClick={()=>handleSave(user.id)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><title>Save</title><path d="M0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256zM371.8 211.8C382.7 200.9 382.7 183.1 371.8 172.2C360.9 161.3 343.1 161.3 332.2 172.2L224 280.4L179.8 236.2C168.9 225.3 151.1 225.3 140.2 236.2C129.3 247.1 129.3 264.9 140.2 275.8L204.2 339.8C215.1 350.7 232.9 350.7 243.8 339.8L371.8 211.8z"/></svg>
        <svg className="Layer_1 cancel"onClick={()=>handleEditData(user.id)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><title>Cancel</title><path d="M310.6 361.4c12.5 12.5 12.5 32.75 0 45.25C304.4 412.9 296.2 416 288 416s-16.38-3.125-22.62-9.375L160 301.3L54.63 406.6C48.38 412.9 40.19 416 32 416S15.63 412.9 9.375 406.6c-12.5-12.5-12.5-32.75 0-45.25l105.4-105.4L9.375 150.6c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L160 210.8l105.4-105.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-105.4 105.4L310.6 361.4z"/></svg>
        </div>
        </>
        :
        <>
         <input type="checkbox" checked={deleteAll} onChange={(e)=>handleEditData()} />   
         <div> {user.name}</div>
         <div> {user.email}</div>
         <div> {user.role}</div>
         <div className='Button-div'> 
         <svg className="Layer_1 edit" data-name="Layer 1"onClick={( )=>handleEditData(user.id)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 122.88 121.51"><title>Edit</title><path d="M28.66,1.64H58.88L44.46,16.71H28.66a13.52,13.52,0,0,0-9.59,4l0,0a13.52,13.52,0,0,0-4,9.59v76.14H91.21a13.5,13.5,0,0,0,9.59-4l0,0a13.5,13.5,0,0,0,4-9.59V77.3l15.07-15.74V92.85a28.6,28.6,0,0,1-8.41,20.22l0,.05a28.58,28.58,0,0,1-20.2,8.39H11.5a11.47,11.47,0,0,1-8.1-3.37l0,0A11.52,11.52,0,0,1,0,110V30.3A28.58,28.58,0,0,1,8.41,10.09L8.46,10a28.58,28.58,0,0,1,20.2-8.4ZM73,76.47l-29.42,6,4.25-31.31L73,76.47ZM57.13,41.68,96.3.91A2.74,2.74,0,0,1,99.69.38l22.48,21.76a2.39,2.39,0,0,1-.19,3.57L82.28,67,57.13,41.68Z"/></svg>
         <svg className="Layer_1 delete" data-name="Layer 1"onClick={( )=>handleDeleteData(user.id)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 110.61 122.88"><title>Delete</title><path d="M39.27,58.64a4.74,4.74,0,1,1,9.47,0V93.72a4.74,4.74,0,1,1-9.47,0V58.64Zm63.6-19.86L98,103a22.29,22.29,0,0,1-6.33,14.1,19.41,19.41,0,0,1-13.88,5.78h-45a19.4,19.4,0,0,1-13.86-5.78l0,0A22.31,22.31,0,0,1,12.59,103L7.74,38.78H0V25c0-3.32,1.63-4.58,4.84-4.58H27.58V10.79A10.82,10.82,0,0,1,38.37,0H72.24A10.82,10.82,0,0,1,83,10.79v9.62h23.35a6.19,6.19,0,0,1,1,.06A3.86,3.86,0,0,1,110.59,24c0,.2,0,.38,0,.57V38.78Zm-9.5.17H17.24L22,102.3a12.82,12.82,0,0,0,3.57,8.1l0,0a10,10,0,0,0,7.19,3h45a10.06,10.06,0,0,0,7.19-3,12.8,12.8,0,0,0,3.59-8.1L93.37,39ZM71,20.41V12.05H39.64v8.36ZM61.87,58.64a4.74,4.74,0,1,1,9.47,0V93.72a4.74,4.74,0,1,1-9.47,0V58.64Z"/></svg>
        </div>
        </>
        }
      </div>);
      })}
      </>
      }
        <div className='footer'>
            <div className="deletebutton Page" onClick={()=>deleteProcess()} > Delete </div>
        <div className='Pagination'>
            <div className="first Page" onClick={()=>{setPage(1)}}> First </div>
            <div className="prev Page" onClick={()=>{handlePrevPage()}}> Prev  </div>
            {PageNumbers.map((number) => (
                <div className="Page" value={number} onClick={(e)=>{setPage(number)}}> {number}</div>
            ))}
            <div className="next Page" onClick={(e)=>{handleNextPage()}}>Next</div>
            <div className="last Page"onClick={(e)=>{setPage(PageNumbers.length)}}>Last</div>
          </div>     
        </div>
     </div>
     </div>
    </div>
  );
}

export default App;
