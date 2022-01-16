import React from 'react'
import axios from "axios";
import  {useState,useEffect} from 'react'
import { useHistory } from 'react-router-dom'
import {Card, Container,Modal,Button,Form,Table} from 'react-bootstrap'
import FileBase64 from "react-file-base64";

export default function Dashboard() {
     const [error,setError]=useState('')
     const [name,setName]=useState('')
     const [image,setImage]=useState('')
     const [base,setBase64]=useState('')
     const [id,setId]=useState()
     const [imgs,setImages]=useState([])
     const [show, setShow] = useState(false);
     const handleClose = () => setShow(false);
     const handleShow = () => setShow(true);
     const [imgTitle,setTitle]=useState('')
     const [smShow, setSmShow] = useState(false);
     const [lgShow, setLgShow] = useState(false);
     const [labe,setlabels]=useState([])
     const [conf,setConf]=useState([])
   

     let history=useHistory()
     useEffect(()=>{

          let varr=[]
          const input={"token":localStorage.getItem('token')}
          if(input['token']==null)
          {
               console.log("No Token")
               history.push("/Login")
               return
          }
          axios.post("http://localhost:8000/userImgs",input).then(res=>{

               if(res.data['res']['status']==false)
               {    
                    setError("Session Expired")
                    history.push("/Login")
                    window.location.reload()
                    return
               }
               

               setName(res.data['res']['token']['name']['data'][0][1])
               setId(res.data['res']['token']['name']['data'][0][0])
               console.log(res.data['images'])
               if(res.data['images'].length==0)
               {
                    console.log("No Images Available")
                    return
               }
               else{
               setImage(res.data['images'][0][1])
               const arr=res.data['images']
               const labels=res.data['images'][0][5].split(',')
               const confidences=res.data['images'][0][6].split(',')
               var labs=[]

               for(var p=0;p<labels.length;p++)
               {
                    labs.push({"labels":labels[p],"conf":confidences[p]})
               }     
               for(var i=0;i<arr.length;i++)
               {
                    varr.push({"blob":arr[i][1],"title":arr[i][3],"date":arr[i][4],"labels":res.data['images'][i][5].split(','),"Confidence":res.data['images'][i][6].split(',')})
               }

               }
               console.log("--0:",varr)
               setImages(varr)
               

               
        })


     },[])


     const onDone=(e)=>{

          if(!imgTitle)
          {
               console.log("please enter title")
               return
          }
          if(e.base64==undefined)
          {
               console.log("please upload any image")
               return
          }
          setBase64(e.base64)
          var currentDate=new Date()
          const inputs={
               "userId":id,
               "base64":e.base64.split(",")[1],
               "title":imgTitle,
               "Date":currentDate.toISOString()
          }
          console.log(e.base64.split(","))
          
          axios.post("http://localhost:8000/postImage",inputs).then(res=>{
               console.log(res)
          })
          window.location.reload()

     }
     const divClick=(e)=>{
          setLgShow(true)
          
          setConf(imgs[e]['Confidence'])
          var table=[]
          for(var i=0;i<imgs[e]['Confidence'].length;i++)
          {
               table.push({"id":i,"Label":imgs[e]['labels'][i],"conf":imgs[e]['Confidence'][i]})
          }
          setlabels(table)
          console.log(table)
     }

     return (
          <div style={{justifyContent:"center", marginTop:"35px", marginLeft:"25px"}}>
               <h1>
                    {error} 
               </h1>
               <div>
               <Button variant="primary" onClick={handleShow}>
                    Upload New Image
               </Button>
               <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                         <Modal.Title>Modal heading</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Please Choose File
                    <FileBase64  type="file" multiple={false} onDone={(e)=>onDone(e)}/>
                    <Form.Control style={{marginTop:"5px"}} onChange={(e)=>setTitle(e.target.value)} size="sm" name="foo" placeholder="Image Text" />
                    </Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                    Cancel
                    </Button>
                    <Button variant="primary" onClick={onDone}>
                    Upload
                    </Button>
                    </Modal.Footer>
               </Modal>
               </div>
               <h1>
                    {name}'s Gallery
               </h1>
               <Container fluid>
                    {
                    imgs.map((item,i)=>{
                         return (
                         <div  key={i} id={i} style={{float:"left", padding:"2rem"}}>
                              <Card style={{borderRadius:"15px", width:"20rem"}}>
                                   <Card.Img style={{borderRadius:"15px"}} width={200} height={200} variant="top" src={`data:image/png;base64,${item['blob']}`} />
                                   <Card.Body>
                                   <Card.Title>{item['title']}</Card.Title>
                                   <p className="card-text"><small className="text-muted">Created at: {item['date']}</small></p>
                                   </Card.Body>
                                   <Card.Body>
                                   </Card.Body>
                                    <Modal size="lg" show={lgShow} onHide={() => setLgShow(false)} aria-labelledby="example-modal-sizes-title-lg">
                                             <Modal.Header closeButton>
                                                  <Modal.Title id="example-modal-sizes-title-lg">
                                                  Image Labels
                                                  </Modal.Title>
                                             </Modal.Header>
                                             <Modal.Body>

                                             <Container fluid>
                                                  <div style={{float:"left"}}>
                                                  {/* {labe.map((lb,p)=>{
                                                       return <p key={p} style={{marginLeft:"12px",marginRight:"5x"}} className="card-text"><strong>{lb}</strong></p>
                                                  })}
                                                  </div>
                                                  <div style={{float:"left"}}>
                                                  {conf.map((lb,p)=>{
                                                       return <p key={p} style={{marginLeft:"12px",marginRight:"5px"}} className="card-text"><small>{lb.substring(0,4)}%</small></p>
                                                  })} */}
                                                  </div>
                                             </Container>
                                             <Table >
                                                  <thead>
                                                       <tr>
                                                            
                                                            <th>
                                                                 #
                                                            </th>
                                                            <th>
                                                                 Label
                                                            </th>
                                                            
                                                            <th>
                                                                 Confidence
                                                            </th>
                                                       </tr>
                                                  </thead>
                                                  <tbody>
                                                       
                                                       {labe.map((lb,p)=>{return <tr key={p}><td>{lb['id']}</td><td>{lb['Label']}</td><td>{lb['conf']}</td></tr>})}

                                                  </tbody>

                                             </Table>
                                             </Modal.Body>
                                   </Modal>
                                   <Button  onClick={()=>divClick(i)}>Details</Button>
                              </Card>
                         </div>
                         )
                    })
                    }

               </Container>
          
          

               
          </div>
     )
}
