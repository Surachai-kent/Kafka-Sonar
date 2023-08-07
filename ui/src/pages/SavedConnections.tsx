import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import Tooltip from '@mui/material/Tooltip';
// Referenced guide for migration from MUI v5 to v6 in order to get import Data Grid from MUI X v6: https://mui.com/x/migration/migration-data-grid-v5/
import { DataGrid, GridEventListener, useGridApiRef } from '@mui/x-data-grid';
// MUI types
import { GridColDef } from '@mui/x-data-grid';
// TS types
import {
  GridRowDef,
  SavedConnectionsProps,
  UserConnection,
} from './../types/types';
// Docker client library
import { createDockerDesktopClient } from '@docker/extension-api-client';
import { format } from 'date-fns';

const columns: GridColDef[] = [
  // Reference https://mui.com/x/react-data-grid/row-definition/#row-identifier: It is not necessary to create a column to display the unique identifier data. The data grid pulls this information directly from the data set itself, not from anything that is displayed on the screen.
  {
    field: 'clientId',
    headerName: 'Client ID',
    description: 'Kafka application name',
    headerClassName: 'header',
    headerAlign: 'center',
    width: 130,
  },
  {
    field: 'host',
    headerName: 'Hostname',
    description: 'Your cluster is found at this host.',
    headerClassName: 'header',
    headerAlign: 'center',
    width: 140,
  },
  {
    field: 'port',
    headerName: 'Port',
    description: 'Your cluster is found at this port.',
    headerClassName: 'header',
    headerAlign: 'center',
    width: 110,
  },
  {
    field: 'auth',
    headerName: 'Authentication',
    description:
      'SASL method to authenticate to the cluster (or not applicable)',
    headerClassName: 'header',
    headerAlign: 'center',
    width: 170,
  },
  {
    field: 'network',
    headerName: 'Docker Network',
    description: 'Your cluster is in this network.',
    headerClassName: 'header',
    headerAlign: 'center',
    width: 180,
  },
];

// 1) need to send connectedClientId (for download file path in metricsServer.ts)
// 2) need to send the database ClusterId (for numOfBrokers in ID 6 in promController.ts)
// 3) need to convert to use ddClient.extension.vm.service
const DownloadPastMetrics = async () => {
  fetch(`http://localhost:3333/download/`)
    .then((response) => response.blob())
    .then((blob) => {
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      const currentDateTime = format(new Date(), 'yyyy-MM-dd_HH-mm-ss');
      const filename = `metrics_table_${currentDateTime}.csv`;
      link.href = url;
      link.setAttribute('download', `${filename}`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    });
};

export default function SavedConnectionsDataGrid({
  connectedClientId,
  setConnectedClientId,
}: SavedConnectionsProps) {
  const [rows, setRows] = useState<GridRowDef[]>([]);
  const [selectedRow, setSelectedRow] = useState<number>(0); // selectedRow = cluster_id on BE

  const navigate = useNavigate();

  const apiRef = useGridApiRef();
  useEffect(() => {
    // Event reference: https://mui.com/x/react-data-grid/events/#api, see rowSelectionChange
    // handles updating selectedRow in state with the id of the selected row in the DataGrid (id = cluster_id from BE)
    // updates selectedRow to 0 when no rows are selected
    const handleRowSelectionChange: GridEventListener<'rowSelectionChange'> = (
      params
    ) => {
      params[0] ? setSelectedRow(Number(params[0])) : setSelectedRow(0);
    };
    // imperative subscription
    // `subscribeEvent` method will automatically unsubscribe in the cleanup function of the `useEffect`
    return apiRef.current.subscribeEvent(
      'rowSelectionChange',
      handleRowSelectionChange
    );
  }, [apiRef]);

  // instantiate DD client object
  const ddClient = createDockerDesktopClient();

  const getUserConnections = async () => {
    // must pass user_id to BE
    // GET all connections associated with logged-in user
    // Issue with type UserConnection[]
    const allUserConnections: any = await ddClient.extension.vm.service.get(
      `/api/clusters/userclusters/${localStorage.getItem('id')}`
    );

    // error handling
    if (allUserConnections instanceof Error) {
      // toast error message
      ddClient.desktopUI.toast.error(
        'ERROR retrieving your saved connections.'
      );
      // exit handler
      return;
    }

    // map over allUserConnections
    const gridRows = allUserConnections.map(
      // destructure each connection object and keep only the properties needed for the DataGrid
      ({
        cluster_id,
        client_id,
        bootstrap_hostname,
        port_number,
        auth_mechanism,
        user_network,
      }) => {
        return {
          // See references: https://mui.com/x/react-data-grid/row-definition/#row-identifier, https://mui.com/x/react-data-grid/getting-started/#define-rows
          id: cluster_id, // all cluster_ids should be unique
          clientId: client_id,
          host: bootstrap_hostname,
          port: port_number,
          auth: auth_mechanism,
          network: user_network,
        };
      }
    );

    // update rows in state
    setRows(gridRows);
  };

  // useEffect is called 2x on component mount as of React v18 (need to fact check version)
  useEffect(() => {
    getUserConnections();
  }, []); // called once on component mount

  const connectToSelected = async () => {
    // if selectedRow is 0, don't do the API call!
    if (selectedRow === 0) {
      // alert user that no grid row is selected
      alert('Select a row to connect to a client.');
      // exit handler
      return;
    }

    // if there IS a running connection, don't do the API call!
    if (connectedClientId) {
      // alert user there's a currently running connection
      alert(
        `${connectedClientId} is currently running. Disconnect a running client before connecting to another.`
      );
      // exit handler
      return;
    }

    // must pass clientId AND network of the selected row to BE
    const selectedClientId = rows.filter((row) => row.id === selectedRow)[0]
      .clientId;
    const selectedNetwork = rows.filter((row) => row.id === selectedRow)[0]
      .network;
    // request to connect to the selected cluster
    const connected: any = await ddClient.extension.vm.service.get(
      `/api/clusters/connect/${selectedClientId}/${selectedNetwork}`
    );

    // error handling
    if (connected instanceof Error) {
      // toast error message
      ddClient.desktopUI.toast.error(
        `ERROR connecting to ${selectedClientId}.`
      );
      // exit handler
      return;
    }

    // store selectedClientId as connectedClientId (this will be used to disconnect later on)
    setConnectedClientId(selectedClientId);
    // in case user leaves extension while cluster is running, store connectedClientId in localStorage
    localStorage.setItem('connectedClientId', selectedClientId); // we're using selectedClientId instead of connectedClientId since the latter does not set in time!

    // toast success message
    ddClient.desktopUI.toast.success(
      `SUCCESS! You are connected to ${selectedClientId}.`
    );

    // redirect to Metrics
    navigate('/metrics');

    // reload after 2 seconds to allow Grafana panels a moment to appear
    setTimeout(() => {
      location.reload();
    }, 2000);
  };

  const disconnectFromCurrent = async () => {
    // if there is NO running connection, don't do the API call!
    if (!connectedClientId) {
      // alert user there's no currently running connection
      alert('You are not connected to any client.');
      // exit handler
      return;
    }

    // must pass connectedClientId to BE (network is not necessary to disconnect)
    // request to disconnect from the connected cluster
    const disconnected: any = await ddClient.extension.vm.service.get(
      `/api/clusters/disconnect/${connectedClientId}`
    );

    // error handling
    if (disconnected instanceof Error) {
      // toast error message
      ddClient.desktopUI.toast.error(
        `ERROR disconnecting ${connectedClientId}.`
      );
      // exit handler
      return;
    }

    // toast success message
    ddClient.desktopUI.toast.success(
      `SUCCESS! You have disconnected from ${connectedClientId}.`
    );
    // reset connectedClientId to empty string
    setConnectedClientId('');
    // in case user leaves extension while cluster is running, set connectedClientId in localStorage to be ''
    localStorage.setItem('connectedClientId', '');
  };

  const deleteUserConnection = async () => {
    // if selectedRow is 0, don't do the API call!
    if (selectedRow === 0) {
      // alert user that no grid row is selected
      alert('Select a saved connection to delete.');
      // exit handler
      return;
    }

    // if the selected connection is currently running, don't do the API call! Users should NOT be able to delete a running connection.
    const selectedClientId = rows.filter((row) => row.id === selectedRow)[0]
      .clientId;
    if (connectedClientId === selectedClientId) {
      // alert user that the connection they selected is currently running
      alert(
        `${connectedClientId} is currently running. Disconnect the running client before deleting it from your saved connections.`
      );
      // exit function
      return;
    }

    // must pass user_id and cluster_id to BE
    // DELETE selected connection
    const deletedConnection: any = await ddClient.extension.vm.service.delete(
      `/api/clusters/${localStorage.getItem(
        'id'
      )}/${selectedRow}/${selectedClientId}`
    );

    // error handling
    if (deletedConnection instanceof Error) {
      // toast error message
      ddClient.desktopUI.toast.error(`ERROR deleting ${selectedClientId}.`);
      // exit handler
      return;
    }

    // toast success message
    ddClient.desktopUI.toast.success(
      `SUCCESS! You have deleted ${selectedClientId}.`
    );
    // refreshing the page should trigger useEffect / getUserConnections to update the grid rows
    location.reload();
  };

  return (
    <Grid container gap={5}>
      {/* The following Grids are both items AND containers. 
      As child items, they flow in the row direction of the parent Grid. 
      As containers, their child elements flow in the column direction. 
      This setup is necessary to center both text headings and Add button.
      */}
      <Grid
        container
        flexDirection={'column'}
        gap={2}
        item
        xs
        sm
        md
        sx={{
          '.header': {
            backgroundColor: '#ff8c42',
          },
        }}
      >
        <Typography component="h1" variant="h5" margin={'-20px auto 0'}>
          SAVED CONNECTIONS
        </Typography>
        <Button
          variant="contained"
          size="medium"
          onClick={() => {
            navigate('/connect');
          }}
        >
          ADD NEW CONNECTION
        </Button>
        <DataGrid
          apiRef={apiRef}
          showCellVerticalBorder
          showColumnVerticalBorder
          columns={columns}
          rows={rows}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          pageSizeOptions={[10]}
          autoHeight
        />
      </Grid>
      <Grid container flexDirection={'column'} gap={1} item xs sm md>
        <Typography component="h1" variant="h6" margin={'-20px auto 0'}>
          AVAILABLE ACTIONS
        </Typography>
        <List>
          <ListItemText primary="1. Select 1 row to take an action. To de-select a row, CMD+click on it or select another row. You cannot select multiple rows." />
          <ListItemText primary="2. You can run only 1 client at a time. You must disconnect a running client before connecting to another client or deleting the running client from your saved connections." />
          <ListItemText primary="3. You can navigate outside the extension while a client is running. However, if you log out, the client will be disconnected." />
          <ListItemText primary="4. Downloading metrics or logs will get you up-to-the-minute data, including for a running client." />
        </List>
        <Button onClick={connectToSelected} variant="outlined" size="medium">
          CONNECT TO SELECTED CLUSTER
        </Button>
        <Button
          onClick={disconnectFromCurrent}
          variant="outlined"
          color="error"
          size="medium"
        >
          DISCONNECT RUNNING CLUSTER
        </Button>
        <Tooltip
          title="Gets a CSV of metrics for all runs of the selected client."
          placement="left"
        >
          <Button
            variant="contained"
            color="success"
            size="medium"
            onClick={DownloadPastMetrics}
          >
            DOWNLOAD PAST METRICS
          </Button>
        </Tooltip>
        <Tooltip
          title="Gets a CSV of errors for all runs of the selected client."
          placement="left"
        >
          <Button variant="contained" color="success" size="medium">
            DOWNLOAD PAST LOGS
          </Button>
        </Tooltip>
        <Tooltip
          title="Deletes the selected client from your saved connections. THIS ACTION CANNOT BE UNDONE!"
          placement="left"
        >
          <Button
            onClick={deleteUserConnection}
            variant="contained"
            color="error"
            size="medium"
          >
            DELETE SELECTED CONNECTION
          </Button>
        </Tooltip>
      </Grid>
    </Grid>
  );
}
