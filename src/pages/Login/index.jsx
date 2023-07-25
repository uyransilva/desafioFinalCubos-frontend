import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import iconPassword from '../../assets/iconPassword.svg';
import api from '../../services/api';
import "../../styles/cards.css";
import { setLocalItem } from '../../utils/localStorage';
import { toastError } from '../../utils/toast';
import "./style.css";

export function Login() {
    const [form, setForm] = useState({
        email: "",
        senha: ""
    });
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false)

    function handleChangeInput(e) {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    async function handleLogin(e) {
        e.preventDefault()
        try {
            const { data } = await api.post("/login", {
                email: form.email,
                senha: form.senha
            })
            setLocalItem('token', data.token)
            setLocalItem('UserId', data.userData.id)
            setLocalItem('UserName', data.userData.nome)
            setLocalItem('UserEmail', data.userData.email)
            setLocalItem('UserCpf', data.userData.cpf)
            setLocalItem('UserTell', data.userData.telefone)
            navigate('/home')
        } catch (error) {
            return toastError(error.response.data.mensagem)
        }
    };

    return (
        <div className="loginContent">
            <div className="imageSide">
                <h1 className="imageTitle">
                    Gerencie todos os pagamentos da sua empresa em um só lugar
                </h1>
            </div>
            <div className="cardSide">
                <div className="cardLogin">
                    <h2>
                        Faça seu login!
                    </h2>
                    <form onSubmit={handleLogin} className="cardFormLogin">
                        <p>Email</p>
                        <input
                            type="text"
                            placeholder="Digite seu e-mail"
                            name="email"
                            onChange={handleChangeInput}
                            value={form.email}
                        />
                        <span className="recoverPass">Esqueceu a sua senha?</span>
                        <p>Senha</p>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Digite sua senha"
                            onChange={handleChangeInput}
                            name="senha"
                            value={form.senha.trim()}
                        />
                        <img onClick={() => setShowPassword(!showPassword)} src={iconPassword} />
                        <button className="cardButton hover-btn-one">Entrar</button>
                    </form>
                    <p className="textLink">
                        Ainda não possui uma conta?
                        <span onClick={() => navigate('/signup')} className="link">Cadastre-se</span>
                    </p>
                </div>
            </div>
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
        </div>
    )
}