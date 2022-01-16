import React from 'react'
import axios from "axios";
import  {useState} from 'react'
import {Card,Form,Button,Alert} from 'react-bootstrap'
import { useHistory } from 'react-router-dom'

export default function Login() {

     const [username,setUsername]=useState('')
      const [password,setPassword]=useState('')
      const [error,setError]=useState('')
      const [show, setShow] = useState(false);
      let histoy=useHistory()
     
     //  useEffect(()=>{
     //       console.log(localStorage.getItem("token"))
     //       if(localStorage.getItem("token")!=null)
     //       {
                     
     //           setdisable("enabled") 
     //           histoy.push("/Dashboard")         
     //      }
     //  })

      const handleSubmit = (event) => {
     
          localStorage.clear()
        event.preventDefault();
        
        if(!username || !password){
          setError("Please Enter Credentials")
          setShow(true)
          return
        }

        const input={"username":username,"password":password}
        axios.post("http://localhost:8000/login",input).then(res=>{
          
          if(res.data['status']===false)
          {
               setShow(true)
               setError(res.data['msg'].msg)
               return
          }

          const token=res.data.token
          localStorage.clear()
          localStorage.setItem('token',token)      
          setShow(false)
          histoy.push('/Dashboard')

        })



      }


     return (
          <div>
               <div style={{ width: '28rem', height:"14rem", justifyContent:"center", marginTop:"250px", marginLeft:"600px" }}>
               <Card>
                    <Card.Body>
                    <h1>Login</h1>
                    <Form onSubmit={handleSubmit}>
                         
                         <Form.Group>
                         <Form.Label>Username</Form.Label>
                         <Form.Control  name='username' value={username} onChange={(e)=>setUsername(e.target.value)} placeholder='Username' />
                         </Form.Group>

                         <Form.Group style={{marginTop:"10px"}}>
                         <Form.Label>Password</Form.Label>
                         <Form.Control type='password' name='password' value={password} onChange={(e)=>setPassword(e.target.value)}  placeholder='Password' />
                         </Form.Group>
                         <Button type="submit" style={{marginTop:"10px",width:"150px"}}>Login</Button>

                    </Form>
                    <Alert style={{marginTop:"10px"}} show={show} variant='danger'>{error}</Alert>
                    </Card.Body>
               </Card>
          </div>
     </div>
     )
}
