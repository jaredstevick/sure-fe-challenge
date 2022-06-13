import { Typography, Box, Button, List, ListItem, ListItemText } from '@mui/material';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import InfoTable from '../InfoTable';
import { useState, useEffect } from 'react';

const apiUrl = 'https://fe-interview-technical-challenge-api-git-main-sure.vercel.app/api/policyholders';

interface IAddress {
  line1: string,
  line2: string | undefined,
  city: string,
  state: string,
  postalCode: string,
}

interface IPolicyHolder {
  name: string,
  age: number,
  address: IAddress,
  phoneNumber: string,
  isPrimary: boolean
}

const newUser = {
  name: 'Jeffrey Lebowski',
  age: 79,
  phoneNumber: '310-537-3375',
  address: {
    line1: '606 Venezia Avenue',
    line2: undefined,
    city: 'Venice',
    state: 'CA',
    postalCode: '90291'
  },
  isPrimary: true
};

const todos = [
  'Add new policyholder form, maybe in a modal',
  'Maybe add a form library?',
  'Add form validation (probably use Yup)',
  'Remove hardcoded new user data',
  'Make the new user post persist data',
  'The post response currently returns isActive: false for the new user, regardless of what you send',
  'Break out fetch logic for more reusability, readability',
  'Error handling!!',
  'All routes are currently wrapped in QueryClientProvider. This may not be necessary since this is currently the only page concerned with fetching/posting data',
  'Add some more tests around fetching/posting',
  'Loading states, animation maybe?',
  'Swap out <Link /> for <NavLink /> in the navbar to use built-in active logic',
  'Refactor <InfoTable /> to accept a wider variety of data types',
  'Mobile responsiveness',
  'Remove this list of todos :-)'
];

function PolicyholdersView() {
  const [userData, setUserData] = useState([]);

  const loadData = async () => {
    const response = await axios.get(apiUrl);
    return response.data;
  }

  const { data, status } = useQuery('policyHolderData', loadData);

  useEffect(() => {
    if (data && data.policyHolders) {
      setUserData(data.policyHolders);  
    }
  }, [data]);

  const createPolicyholder = async () => {
    const { data: response } = await axios.post(apiUrl, newUser);
    return response;
  }

  const queryClient = useQueryClient();

  const { mutate } = useMutation(createPolicyholder, {
      onSuccess: response => {
        setUserData(response.policyHolders);
        queryClient.setQueryData('policyHolderData', { policyHolders: response.policyHolders });

      },
      onError: () => {
        console.log('error')
      },
    },
  );

  const handleSumbit = () => {
    mutate();
  }

  const formatData = (user: IPolicyHolder) => {
    return [
      { key: 'Name', value: user.name },
      { key: 'Age', value: user.age },
      { key: 'Address', value: Object.values(user.address).join(', ') },
      { key: 'Phone Number', value: user.phoneNumber },
      { key: 'Primary Policyholder', value: user.isPrimary.toString() },
    ];
  }

  return (
    <>
      <Typography variant='h2' textAlign='center' marginBottom='24px'>
        Policyholders
      </Typography>
      <Box sx={{ paddingBottom: '16px', textAlign: 'right' }}>
        <Button
          onClick={handleSumbit}
          variant='contained'
          color='secondary'
          size='large'
          sx={{ textTransform: 'none' }}
        >
          Add a policyholder
        </Button>
      </Box>
      <Box sx={{ textAlign: 'center' }}>
        {status === 'error' && <p>There was a problem loading policyholders</p>}
        {status === 'loading' && <p>Loading Policyholders...</p>}
        {status === 'success' && userData.length && (
          userData.map((user: IPolicyHolder) => (
            <Box key={user.name} sx={{ marginBottom: '24px' }}>
              <InfoTable header={user.name} rows={formatData(user)} />
            </Box>
          ))
        )}
      </Box>
      <Box sx={{ textAlign: 'left', marginTop: '36px' }}>
        <Typography variant='h4' textAlign='center' >
          ToDos
        </Typography>
        <List>
          {todos.map(t => (
            <ListItem key={t}>
              <CheckBoxOutlineBlankIcon />
              <ListItemText sx={{ marginLeft: '8px' }}>{t}</ListItemText>
            </ListItem>
          ))}
        </List>
      </Box>
    </>
  );
}

export default PolicyholdersView;
