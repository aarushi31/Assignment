import React,{useEffect, useState} from 'react'
import app from '../firebase'
import {useAuth} from '../contexts/AuthContext'
import { Link,useHistory } from 'react-router-dom';
import {Card,Form,Button, Alert} from 'react-bootstrap'

function Dashboard() {
    const [name,setName]=useState('');
    const [gender,setGender]=useState('');
    const [birthPlace,setBirthplace]=useState('')
    const [details,setDetails]=useState();
    const {currentUser,logout}=useAuth()
    const [submitted,setSubmit]=useState(false);
    const [error, setError] = useState("")

    const history=useHistory()


    useEffect(()=>{
    const detailRef=app.database().ref("Detail");
    detailRef.once('value',function(snapshot){
        console.log(snapshot.val(),snapshot.key);
        const dets=snapshot.val();
            for(let id in dets){
                if(dets[id].email===localStorage.getItem('email')){
                    console.log(dets[id].name)
                    setName(dets[id].name);
                    setGender(dets[id].gender);
                    setBirthplace(dets[id].birthPlace)
                    setSubmit(true);
                }
            }
    })
},[])

async function handleLogout() {
    setError("")

    try {
      await logout()
      history.push("/login")
    } catch {
      setError("Failed to log out")
    }
  }  


    const handleChange=(e)=>{
        setName(e.target.value)
    }
    const submit=()=>{
        const nameRef=app.database().ref("Detail")
        const detail={
            name,
            gender,
            birthPlace,
            email:localStorage.getItem('email'),
            filled:true
        }
        nameRef.push(detail)
        setSubmit(true);
    }

    

    return (
        <div>
           {!submitted && <div>
            <h1>Please fill your details : </h1>
            Name : <input type="text" onChange={handleChange} value={name}/>
            <br/>
            Gender : <input type="text" onChange={(e)=>setGender(e.target.value)} value={gender}/>
            <br/>
            Birth Place : <input type="text" onChange={(e)=>setBirthplace(e.target.value)} value={birthPlace}/>
            <button onClick={submit}>Submit</button>
            </div>
           }
           {submitted && 
           <div>
               <h1>Your details : </h1>
           Name : <span>{name}</span><br/>
           Gender : <span>{gender}</span><br/>
           Birth Place : <span>{birthPlace}</span>
           </div>}
           {error && <Alert variant="danger">{error}</Alert>}
           <Button variant="link" onClick={handleLogout}>
          Log Out
        </Button>

        </div>
    )
}

export default Dashboard

