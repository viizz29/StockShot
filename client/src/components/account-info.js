import * as React from 'react';
import Box from '@mui/material/Box';


class AccountInfo extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      info: {},
    };
    this.tkn = localStorage.getItem('token');
  }

  load_data(){
    let data = JSON.parse(localStorage.getItem('data'));
    //console.log(data);
    this.setState({
      info: data
    })
  }

 
  componentDidMount() {
    this.load_data();
  }

  render() { 
    const {info} = this.state;
      
      return (
       
              <Box component="fieldset" sx = {{width: 1}}>
                <legend>Account Info</legend>
                Name: {info.firstName}
                <br/>
                Email: {info.email}
              </Box>  
          
      );
    
  }        
}


export default AccountInfo;