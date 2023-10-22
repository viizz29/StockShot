import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';


class Favorites extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      favs: [],
    };
    this.tkn = localStorage.getItem('token');
  }

  load_data(){
    fetch("/api/get-favorites", {
      method: 'GET',
      headers: {
        'x-access-token': this.tkn,
      },
    })
      .then(res => res.json())
      .then(
        (result) => {
          console.log(result);
          this.setState({
            isLoaded: true,
            favs: result
          });
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
    const { error, isLoaded, favs} = this.state;
      if (error) {
        return <div>Error: {error.message}</div>;
      } else if (!isLoaded) {
        return <div>Loading...</div>;
      } else {
      return (
       
              <Box component="fieldset" sx = {{width: 1}}>
                <legend>Favorites</legend>
                {favs.map((fav) =>
                  <Button key={fav.id} color="inherit"
                  onClick={() => (window.open("/instrument?name="+fav.symbol, "_self"))}
                  >{fav.symbol}</Button>
                )}
              </Box>  
          
      );
    }
  }        
}


export default Favorites;