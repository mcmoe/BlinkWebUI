import React, { PropsWithChildren } from 'react';
import {
    Paper, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from '@material-ui/core';
import { Cloud } from '@material-ui/icons';
import DashboardPageLayout from '../../layouts/dashboard-page/DashboardPageLayout';
import Session from '../../../domain/entities/Session';
import SyncModuleRepositoryImpl from '../../../infrastructure/repositories/impl/blink/SyncModuleRepositoryImpl';
import SyncModule from '../../../domain/entities/SyncModule';
import SignalIndicatorComponent from '../../components/signal-indicator/SignalIndicatorComponent';
import './SyncModulesPageStyle.scss';

interface CamerasPageState {
    syncModules: SyncModule[];
    loading: boolean;
}

interface CamerasPageProps {
    session: Session;
}


export default class SyncModulesPage
    extends React.PureComponent<PropsWithChildren<CamerasPageProps>, CamerasPageState> {
    constructor(props: CamerasPageProps) {
        super(props);
        this.state = {
            syncModules: [],
            loading: true
        };
    }

    componentDidMount(): void {
        this.getModuleList();
    }

    getModuleList(): Promise<any> {
        return new SyncModuleRepositoryImpl('http://localhost:8080')
            .getSyncModuleList(
                this.props.session.region.tier,
                this.props.session.account.id.toString(),
                this.props.session.authtoken.authtoken
            )
            .then((syncModules) => {
                this.setState((previousState) => ({
                    loading: false,
                    syncModules: previousState.syncModules.concat(syncModules)
                }));
            });
    }

    render(): JSX.Element {
        return (
            <DashboardPageLayout
                className="sync-modules-page"
                loading={this.state.loading}
                title="Sync Modules"
                icon={<Cloud />}
            >
                <TableContainer component={Paper}>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell align="center">Status</TableCell>
                                <TableCell align="center">WiFi Strength</TableCell>
                                <TableCell align="center">Temp Alerts</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.state.syncModules.map((row) => (
                                <TableRow key={row.name}>
                                    <TableCell component="th" scope="row">
                                        {row.name}
                                    </TableCell>
                                    <TableCell align="center">{row.status}</TableCell>
                                    <TableCell align="center">
                                        <SignalIndicatorComponent strength={row.wifiStrength} />
                                    </TableCell>
                                    <TableCell align="center">
                                        <Switch
                                            disabled
                                            checked={row.enableTempAlerts}
                                            color="primary"
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </DashboardPageLayout>
        );
    }
}
