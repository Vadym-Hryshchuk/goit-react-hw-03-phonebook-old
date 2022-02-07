import { Component } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import defaultContacts from '../defaultContacts.json';
import Form from '../components/form/Form';
import ContactsList from '../components/contactsList/ContactsList';
import SearchFilter from '../components/searchFilter/SearchFilter';
import { Container, Title, Header } from './App.styled';

class App extends Component {
  state = {
    contacts: defaultContacts,
    filter: '',
  };
  componentDidMount() {
    const contacts = localStorage.getItem('contacts');
    const parsedContact = JSON.parse(contacts);
    if (parsedContact) {
      this.setState({ contacts: parsedContact });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.contacts !== prevState.contacts) {
      localStorage.setItem('contacts', JSON.stringify(this.state.contacts));
    }
  }

  filterChange = e => {
    const { name, value } = e.currentTarget;
    this.setState({ [name]: value });
  };

  addContactToList = contact => {
    if (
      this.state.contacts.some(
        value => value.name.toLowerCase() === contact.name.toLowerCase(),
      )
    ) {
      toast.error(`${contact.name} is already in the contact list`);
      return;
    }
    this.setState(({ contacts }) => ({
      contacts: [...contacts, contact],
    }));
    toast.success(`${contact.name} added to contact list`);
  };

  filterContacts = () => {
    const { contacts, filter } = this.state;
    const filterValueToLowerCase = filter.toLowerCase();

    return contacts.filter(contact =>
      contact.name.toLowerCase().includes(filterValueToLowerCase),
    );
  };

  removeContact = ({ id, name }) => {
    this.setState(({ contacts }) => ({
      contacts: contacts.filter(contact => contact.id !== id),
    }));
    toast.success(`${name} has been removed from the contact list`);
  };

  render() {
    const { filter } = this.state;
    return (
      <Container>
        <Title>Phonebook</Title>
        <Form
          handleChange={this.handleChange}
          onSubmit={this.addContactToList}
        />
        <Header>Contacts</Header>
        <SearchFilter value={filter} filterChange={this.filterChange} />
        <ContactsList
          filterContacts={this.filterContacts()}
          removeContact={this.removeContact}
        />
        <Toaster
          toastOptions={{
            className: '',
            style: {
              fontFamily: 'sans-serif',
            },
          }}
        />
      </Container>
    );
  }
}

export default App;
