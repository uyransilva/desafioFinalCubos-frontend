import * as React from 'react';
import Paper from '@mui/material/Paper';
import Icon from '../../../assets/anticipated.svg'
import { formatValue } from '../../../utils/format'
import './style.css'

function AnticipatedCharges({ valuePendingCharges }) {
    return (
        <div className='anticipatedcharges-box'>
            <Paper elevation={2}
                sx={{
                    display: 'flex',
                    backgroundColor: '#FCF6DC',
                    padding: '23px 40px',
                    width: '360px',
                    borderRadius: '10px',
                    gap: '10px'
                }}>
                <img src={Icon} alt="Ícone de contas pagas" />
                <div className='anticipated-values'>
                    <p>Cobranças Previstas</p>
                    <span>{formatValue(valuePendingCharges)}</span>
                </div>
            </Paper>
        </div>
    );
};

export default AnticipatedCharges;