import React from 'react';
import axios from 'axios';

console.log(`Updated: ${new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false })}`)

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      id: '',
      names: []
    };
    this.getNames = this.getNames.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  componentDidMount() {
    this.getNames();
  }

  handleChange(event) {
    this.setState({[event.target.name]: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    if (this.state.item !== '' && this.state.quantity !== '') {
        axios.post('/names', { name: this.state.name, id: this.state.id})
      this.getNames();
      this.setState({name: '', id: ''});
    }
  }

  handleDelete(event) {
    event.preventDefault();
    axios.options('/names')
    this.getNames();
  }

  getNames () {
    axios.get('/names')
      .then(({ data }) => {
        this.setState({ names: data })
      })
  }


  render() {
    return (
      <div>
        <form
          onSubmit={this.handleSubmit}
        ><input
          className="name"
          placeholder="name"
          name="name"
          value={this.state.name}
          onChange={this.handleChange}
        /><input
          className="id"
          placeholder="id"
          name="id"
          value={this.state.id}
          onChange={this.handleChange}
        /><button
          className="button"
        >Add Name</button><button
          name='delete'
          onClick={this.handleDelete}
          className="button"
        >Delete List</button>
        </form>
        {this.state.names.map((nameCard, index) =>
          <div
          key={nameCard.id + index}
          >{nameCard.name}</div>
        )}
      </div>
    );
  }
}

export default App;
