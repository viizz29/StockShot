import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';


class AdminWidget extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      data: [],
    };
    this.tkn = localStorage.getItem('token');
  }

  load_data(){
    fetch("/api/get-usage-data", {
      method: 'GET',
      headers: {
        'x-access-token': this.tkn,
      },
    })
      .then(res => res.json())
      .then(
        (result) => {
          console.log(result);
          if(result.code == 200){
            this.setState({
              isLoaded: true,
              data: result.data
            });
          }
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error: error,
          });
        }
      )
  }

 
  componentDidMount() {
    this.load_data();
  }

  render() { 
    const { error, isLoaded, data} = this.state;
      if (error) {
        return <div>Error: {error.message}</div>;
      } else if (!isLoaded) {
        return <div>Loading...</div>;
      } else {
      return (
       
              <Box component="fieldset" sx = {{width: 1}}>
                <legend>Admin Widget</legend>
                Number of broker API calls: {data.broker_api_call_count}
                <br/>
                Number of requests: {data.app_request_count}
                <br/>
                User wise request counts:
                <br/>
                {Object.keys(data.app_users).map((user) =>
                  <div>{data.app_users[user].user.firstName} made {data.app_users[user].request_count} requests</div>
                )}
              </Box>  
          
      );
    }
  }        
}


export default AdminWidget;