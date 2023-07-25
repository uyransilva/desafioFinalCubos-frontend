import CustomersIcon from '../../../assets/clientesIcon.svg'
import EditIcon from '../../../assets/editIcon.svg'
import { getLocalItem } from '../../../utils/localStorage'
import ModalEditClient from '../../ModalEditClient'
import './style.css'
import { useState } from 'react'

export function CustomerDetails() {
    const clientData = JSON.parse(getLocalItem('ClientData'))
    const [openEdit, setOpenEdit] = useState(false)

    function handleEditClient() {
        setOpenEdit(true)
    }

    return (
        <>
            <div className='customerName'>
                <img src={CustomersIcon} alt="Ícone de clientes" />
                <h1>{clientData.nome}</h1>
            </div>

            <div className='customerData'>
                <div className='customerDataHeader'>
                    <h3>Dados do Cliente</h3>
                    <button
                        onClick={() => handleEditClient()}
                    ><img src={EditIcon} alt="Ícone de editar"></img>EditarCliente</button>
                </div>
                <div className='customerDataTable'>
                    <div className='upperCells'>
                        <div className='dataCell'>
                            <h4>E-email</h4>
                            <p>{clientData.email}</p>
                        </div>
                        <div className='dataCell'>
                            <h4>Telefone</h4>
                            <p>{clientData.telefone}</p>
                        </div>
                        <div className='dataCell'>
                            <h4>CPF</h4>
                            <p>{clientData.cpf}</p>
                        </div>
                        <div className='dataCell'>
                            <h4></h4>
                            <p></p>
                        </div>
                        <div className='dataCell'>
                            <h4></h4>
                            <p></p>
                        </div>
                        <div className='dataCell'>
                            <h4></h4>
                            <p></p>
                        </div>
                    </div>
                    <div className='lowerCells'>

                        <div className='dataCell'>
                            <h4>Endereço</h4>
                            <p>{!clientData.logradouro ? "Não Informado" : clientData.logradouro}</p>
                        </div>
                        <div className='dataCell'>
                            <h4>Bairro</h4>
                            <p>{!clientData.bairro ? "Não Informado" : clientData.bairro}</p>
                        </div>
                        <div className='dataCell'>
                            <h4>Complemento</h4>
                            <p>{!clientData.complemento ? "Não Informado" : clientData.complemento}</p>
                        </div>
                        <div className='dataCell'>
                            <h4>CEP</h4>
                            <p>{!clientData.cep ? "Não Informado" : clientData.cep}</p>
                        </div>
                        <div className='dataCell'>
                            <h4>Cidade</h4>
                            <p>{!clientData.cidade ? "Não Informado" : clientData.cidade}</p>
                        </div>
                        <div className='dataCell'>
                            <h4>UF</h4>
                            <p>{!clientData.estado ? "Não Informado" : clientData.estado}</p>
                        </div>
                    </div>
                </div>
                <ModalEditClient openEdit={openEdit} setOpenEdit={setOpenEdit} clientData={clientData} />
            </div>
        </>
    )
}