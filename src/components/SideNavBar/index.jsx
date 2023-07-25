import { useState } from 'react';
import { Link } from 'react-router-dom';
import ActivedClientesIcon from '../../assets/activedClientesIcon.svg';
import ActivedHomeIcon from '../../assets/activedHomeIcon.svg';
import ClientsIcon from '../../assets/clientesIcon.svg';
import CobrancaIcon from '../../assets/cobrancaIcon.svg';
import PaperActive from '../../assets/paperActive.svg';
import HomeIcon from '../../assets/homeIcon.svg';
import { removeLocalItem } from '../../utils/localStorage'
import './style.css';

export function SideNavBar({ activePage }) {

    const [home, setHome] = useState(activePage === 'home' ? true : false)
    const [customers, setCustomers] = useState(activePage === 'customers' ? true : false)
    const [charges, setCharges] = useState(activePage === 'charges' ? true : false)

    function handleChangeHome() {
        if (activePage === 'home') {
            setHome(true)
            setCustomers(false)
        }
        removeLocalItem('currentPage')
    }

    function handleChangeCustomers() {
        if (activePage === 'customers') {
            setCustomers(true)
            setHome(false)
            setCharges(false)
        }
        removeLocalItem('currentPage')
    }

    function handleChangeCharges() {
        if (activePage === 'charges') {
            setCharges(true)
            setCustomers(false)
            setHome(false)
        }
        removeLocalItem('currentPage')
    }

    return (
        <div className="Navbar">
            <nav className="">
                <div className={home ? 'borderRight' : ''}>
                    <a href='/' className='linksNavBar'>
                        <img className='height' onClick={() => handleChangeHome()} src={home ? ActivedHomeIcon : HomeIcon} alt="Ícone da home" />
                        <p className={home ? 'linksNavBarText navActive' : 'linksNavBarText'}>Home</p>
                    </a>
                </div>

                <div className={customers ? 'borderRight' : ''}>
                    <Link to='/clientes' className='linksNavBar '>
                        <img className='height' onClick={() => handleChangeCustomers()} src={customers ? ActivedClientesIcon : ClientsIcon} alt="Ícone dos clientes" />
                        <p className={customers ? 'linksNavBarText navActive' : 'linksNavBarText'}>Clientes</p>
                    </Link>
                </div>
                <div className={charges ? 'borderRight' : ''}>
                    <Link to='/charges' className='linksNavBar'>
                        <img className='height' onClick={() => handleChangeCharges()} src={charges ? PaperActive : CobrancaIcon} alt="Ícone das cobranças" />
                        <p className={charges ? 'linksNavBarText navActive' : 'linksNavBarText'}>Cobranças</p>
                    </Link>
                </div>
            </nav>
        </div>
    )
}