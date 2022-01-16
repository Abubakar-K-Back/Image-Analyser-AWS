import 'bootstrap/dist/css/bootstrap.min.css'
import { Route, Switch,BrowserRouter as Router } from 'react-router-dom';
import SignUp from '../src/Signup'
import Login from './Login';
import { Navbar,Nav,Container,Button } from 'react-bootstrap'
import Dashboard from './Dashboard';
import  {useState,useEffect} from 'react'
import { useHistory } from 'react-router-dom'



function App() {
  const [disable,setdisable]=useState("disabled")
  const [hide,setHide]=useState(false)
  let history= useHistory()
      
    useEffect(()=>{

    })
    const logout=()=>{
      console.log("logout")
      localStorage.clear()
      setHide(true)
      window.location.reload()

    }


  return (
    <div>
  <Navbar bg="light" expand="lg">
  <Container>
    <Navbar.Brand href="#home">Image Analyser</Navbar.Brand>
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Collapse id="basic-navbar-nav">
      <Nav className="me-auto">
        <Nav.Link href="/Login">Login</Nav.Link>
        <Nav.Link  href="/SignUp">SignUp</Nav.Link>
        <Button disabled={hide} onClick={logout} >Logout</Button>
      </Nav>
    </Navbar.Collapse>
  </Container>
</Navbar>
      <Router>
      <Switch>
          <Route exact path="/Login">
            <Login/>
          </Route>
          <Route exact path="/SignUp">
            <SignUp/>
          </Route>
          <Route exact path="/Dashboard">
            <Dashboard/>
          </Route>
        </Switch>
      </Router>
    </div>

      );
}

export default App;
