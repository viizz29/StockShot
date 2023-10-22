import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';



  
class InstrumentSearch extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      instruments:[],
      selectedItem: null,
    };
    this.tkn = localStorage.getItem('token');

  }

  load_instruments(query){
    fetch("/api/search-instruments?q="+query.toLowerCase(), {
      method: 'GET',
      headers: {
        'x-access-token': this.tkn,
      },
    })
      .then(res => res.json())
      .then(
        (result) => {
          //console.log(query);
          //console.log(result);
          this.setState({
            isLoaded: true,
            instruments: result
          });
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }
  
  componentDidMount() {
    
  }

  render() { 
    const { instruments, selectedItem} = this.state;
      return (
       
            <Stack spacing={2} direction="row" sx={{mr: 2}}>
            <Autocomplete
                disablePortal
                id="instrument-search"
                options={instruments}
                sx={{ width: 300 }}
                renderInput={(params) => <TextField {...params} label="Search Instrument" />}
                onChange={(event, newValue)=>{
                    console.log("Selected value: ");
                    console.log(newValue);
                    this.setState({
                        selectedItem: newValue,
                    });

                }}
                
                onInputChange={(event, newInputValue) => {
                    //console.log("New Input Value: ");
                    //console.log(newInputValue);
                  this.load_instruments(newInputValue);
                }}
            />
            <Button variant="contained" color="success"
            onClick={() => (window.open("/instrument?name="+selectedItem.id))}>Go</Button>
            </Stack>
         
      );
    }
         
}


export default InstrumentSearch;