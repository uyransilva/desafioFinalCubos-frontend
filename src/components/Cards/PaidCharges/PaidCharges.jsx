import * as React from 'react';
import './style.css'
import Paper from '@mui/material/Paper';
import PaperIcon from '../../../assets/paper.svg'
import { formatValue } from '../../../utils/format'

function PaidCharges({ valuePaidCharges }) {
    return (
        <div className='paidCharges-box'>
            <Paper elevation={2}
                sx={{
                    display: 'flex',
                    backgroundColor: '#EEF6F6',
                    padding: '23px 40px',
                    width: '360px',
                    gap: '20px',
                    borderRadius: '10px'
                }}>
                <img src={PaperIcon} alt="Ícone de contas pagas" />
                <div className='paid-values'>
                    <p>Cobranças Pagas</p>
                    <span>{formatValue(valuePaidCharges)}</span>
                </div>
            </Paper>
        </div>
    );
};

export default PaidCharges;