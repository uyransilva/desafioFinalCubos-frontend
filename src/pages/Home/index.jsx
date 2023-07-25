import AnticipatedCharges from "../../components/Cards/AnticipatedCharges/AnticipatedCharges";
import OverdueCharges from "../../components/Cards/OverdueCharges/OverdueCharges";
import PaidCharges from "../../components/Cards/PaidCharges/PaidCharges";
import { HeaderProfile } from "../../components/HeaderProfile";
import { SideNavBar } from "../../components/SideNavBar";
import { useState, useEffect } from 'react'
import { getLocalItem } from '../../utils/localStorage'
import { toastError } from '../../utils/toast'
import { ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css';
import api from "../../services/api";
import TableAnticipated from "../../components/Tables/TableAnticipated/TableAnticipated";
import TableDefaulters from "../../components/Tables/TableDefaulters/TableDefaulters";
import TableOverdue from "../../components/Tables/TableOverdue/TableOverdue";
import TablePaid from "../../components/Tables/TablePaid/TablePaid";
import TablesCorrects from "../../components/Tables/TablesCorrects/TablesCorrects";
import "./style.css";

export function Home() {
    const [chargesData, setChargesData] = useState([]);
    const [customersData, setCustomersData] = useState([]);
    const token = getLocalItem('token');
    const headers = {
        Authorization: `Bearer ${token}`
    };
    const navigate = useNavigate();

    async function getAllCharges() {
        try {
            const response = await api.get('/charges', { headers })
            setChargesData(response.data)
        } catch (error) {
            toastError(error.response.data.mensagem)
            if (error.response.data.mensagem == 'Não autorizado') {
                clearLocalItem();
                navigate('/login')
            }
            return
        }
    }
    useEffect(() => {
        getAllCharges();
        getAllClients();
    }, []);

    async function getAllClients() {
        try {
            const response = await api.get('/clients', { headers })
            setCustomersData(response.data)
            setGetApi(true)
        } catch (error) {
            toastError(error.response.data.mensagem)
            if (error.response.data.mensagem == 'Não autorizado') {
                clearLocalItem();
                navigate('/login')
            }
            return
        }
    }

    let paidCharges = chargesData.filter((item) => {
        return item.status == 'pago'
    })

    let pendingCharges = chargesData.filter((item) => {
        return item.status == 'pendente'
    })

    let overdueCharges = chargesData.filter((item) => {
        return item.status == 'vencida'
    })

    let defaulterClients = customersData.filter((item) => {
        return item.counterstatus != 0
    })

    let upToDateCustomers = customersData.filter((item) => {
        return item.counterstatus == 0
    })

    let valuePaidCharges = 0
    for (let item of paidCharges) {
        valuePaidCharges = valuePaidCharges + Number(item.valor)
    }

    let valuePendingCharges = 0
    for (let item of pendingCharges) {
        valuePendingCharges = valuePendingCharges + Number(item.valor)
    }

    let valueOverdueCharges = 0
    for (let item of overdueCharges) {
        valueOverdueCharges = valueOverdueCharges + Number(item.valor)
    }

    return (
        <main className="homeContent">
            <ToastContainer
                position="top-right"
                autoClose={111111100}
                hideProgressBar={true}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover />
            <SideNavBar activePage='home' />
            <div className="container-cards-main">
                <section className="cardsMainPage">
                    <HeaderProfile />
                </section>
                <div className="main">
                    <div className='cards-top'>
                        <PaidCharges valuePaidCharges={valuePaidCharges} />
                        <OverdueCharges valueOverdueCharges={valueOverdueCharges} />
                        <AnticipatedCharges valuePendingCharges={valuePendingCharges} />
                    </div>
                    <div className='cards-main'>
                        <TablePaid paidCharges={paidCharges} />
                        <TableOverdue overdueCharges={overdueCharges} />
                        <TableAnticipated pendingCharges={pendingCharges} />
                    </div>
                    <div className='cards-footer'>
                        <TableDefaulters defaulterClients={defaulterClients} />
                        <TablesCorrects upToDateCustomers={upToDateCustomers} />
                    </div>
                </div>
            </div>
        </main>
    )
}