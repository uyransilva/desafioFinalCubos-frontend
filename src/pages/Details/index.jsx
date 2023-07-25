import { CustomerCharges } from '../../components/Cards/CustomerCharges'
import { CustomerDetails } from '../../components/Cards/CustomerDetails'
import ModalRegisterCharges from '../../components/ModalRegisterCharges'
import ModalEditCharges from '../../components/ModalEditCharges'
import ModalDeleteCharges from '../../components/ModalDeleteCharges'
import ModalDetailCharges from '../../components/ModalDetailCharges'
import { HeaderCustomerDetails } from '../../components/HeaderCustomerDetails'
import { SideNavBar } from '../../components/SideNavBar'
import { useState } from 'react'
import './styles.css'

export function Details() {
    const [openModalCharges, setOpenModalCharges] = useState(false)
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [openModalDetail, setOpenModalDetail] = useState(false);
    const [nameClientCharge, setOpenNameClient] = useState(null)

    return (
        <div className='containerDetails'>
            <SideNavBar activePage='customers' />
            <div className='container-section-header'>
                <HeaderCustomerDetails />
                <CustomerDetails />
                <CustomerCharges setOpenModalDetail={setOpenModalDetail} setOpenModalCharges={setOpenModalCharges} setOpenNameClient={setOpenNameClient} setOpenEditModal={setOpenEditModal} setOpenDeleteModal={setOpenDeleteModal} />
            </div>
            {openModalCharges && <ModalRegisterCharges setOpenModalCharges={setOpenModalCharges} nameClientCharge={nameClientCharge} />}
            {openEditModal && <ModalEditCharges setOpenEditModal={setOpenEditModal} />}
            {openDeleteModal && <ModalDeleteCharges setOpenDeleteModal={setOpenDeleteModal} />}
            {openModalDetail && <ModalDetailCharges setOpenModalDetail={setOpenModalDetail} />}
        </div>
    )
}

