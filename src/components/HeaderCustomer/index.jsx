import { useState } from 'react';
import './style.css';
import ExitIconBtn from '../../assets/exitIcon.svg';
import EditProfileBtn from '../../assets/editIcon.svg';
import ModalEditProfile from "../ModalEditProfile";
import BallonPoint from '../../assets/ballonTip.svg'
import editProfileButton from '../../assets/editProfileButton.svg'
import { getLocalItem, removeLocalItem } from '../../utils/localStorage'
import { useNavigate } from 'react-router-dom';

export function HeaderCustomer({ page }) {

  const [openProfileOptions, setOpenProfileOptions] = useState(false)
  const [openEditProfile, setOpenEditProfile] = useState(false)
  const navigate = useNavigate();
  const userName = getLocalItem('UserName')
  const [charges, setCharges] = useState(page === 'charges' ? true : false)

  function formatName(name) {
    const newName = name.substr(0, 2).toUpperCase();
    return newName
  }

  const handleLogout = () => {
    removeLocalItem('token')
    removeLocalItem('UserEmail')
    removeLocalItem('UserName')
    removeLocalItem('UserId')
    navigate('/');
  }

  function handleCloseEditProfile() {
    setOpenEditProfile(false)
  }
  function handleEditProfile() {
    setOpenEditProfile(true)
  }
  function handleProfileOptions() {
    if (openProfileOptions === false) {

      setOpenProfileOptions(true)
      return
    }
    if (openProfileOptions === true) {
      setOpenProfileOptions(false)
      return
    }
  }

  return (
    <>
      <header className='headerCustomerPage'>
        <h2 className='headerTitleCustomer'>
          {charges ? 'Cobranças' : 'Clientes'}
        </h2>
        <div className='profileMainPage'>
          <div className='userNameProfile'>
            {formatName(userName)}
          </div>
          <h4>
            {userName}
          </h4>
          <button onClick={() => handleProfileOptions()}>
            <img className='edit-button' src={editProfileButton} alt="Ícone de editar" />
          </button>

          {openProfileOptions &&
            <>
              <div className='profileOptions'>
                <img
                  src={BallonPoint}
                  className='ballonPoint'
                ></img>
                <div className='container-edit'>
                  <img className='edit-option'
                    onClick={() => handleEditProfile()}
                    src={EditProfileBtn}
                    open={openEditProfile}
                    alt="Ícone de editar"
                  ></img>
                  <span>Editar</span>
                </div>
                <div className='container-delete'>
                  <a href='/login'>
                    <img onClick={() => handleLogout()} className='delete-option'
                      src={ExitIconBtn} alt="Ícone de saída">
                    </img>
                  </a>
                  <span>Sair</span>
                </div>
              </div>
            </>
          }

        </div>
      </header>
      <ModalEditProfile
        open={openEditProfile}
        handleclose={handleCloseEditProfile} />
    </>
  )
}