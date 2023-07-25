import * as React from 'react';
import './style.css'
import Paper from '@mui/material/Paper';
import PaperIcon from '../../../assets/overdue.svg'
import { formatValue } from '../../../utils/format'

function OverdueCharges({ valueOverdueCharges }) {
    return (
        <div className='overdue-box'>
            <Paper elevation={2}
                sx={{
                    display: 'flex',
                    backgroundColor: '#FFEFEF',
                    padding: '23px 40px',
                    gap: '10px',
                    borderRadius: '10px',
                    width: '360px'
                }}>
                <img src={PaperIcon} alt="Ícone de contas vencidas" />
                <div className='overdue-values'>
                    <p>Cobranças Vencidas</p>
                    <span>{formatValue(valueOverdueCharges)}</span>
                </div>
            </Paper>
        </div>
    );
};

export default OverdueCharges;