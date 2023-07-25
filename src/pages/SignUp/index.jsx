import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ActualStage from "../../assets/actualStage.svg";
import checkedPoint from '../../assets/checkedPoint.svg';
import done from '../../assets/done.svg';
import greenLine from '../../assets/greenLine.svg';
import iconPassword from '../../assets/iconPassword.svg';
import NextStage from "../../assets/notStage.svg";
import passedCheck from '../../assets/passedCheck.svg';
import toCheckPoint from '../../assets/toCheckPoint.svg';
import api from '../../services/api';
import "../../styles/cards.css";
import { formatName } from '../../utils/format';
import { toastError } from '../../utils/toast';
import "./style.css";
import "./styleToCompleted.css";

export function SignUp() {

    const [stepsPass, setStepsPass] = useState(0);
    const [showPassword, setShowPassword] = useState(false)
    const [showPassword2, setShowPassword2] = useState(false)
    const [form, setForm] = useState({
        nome: "",
        email: "",
        senha: "",
        senhaAuth: ""
    });
    const navigate = useNavigate();

    const steps = [
        {
            label: "Cadastre-se",
            description: `Por favor, escreva seu nome e e-mail`,
        },
        {
            label: "Escolha uma senha",
            description: "Escolha uma senha segura",
        },
        {
            label: "Cadastro realizado com sucesso",
            description: `E-mail e senha cadastrados com sucesso`,
        },
    ];

    function nextStep() {
        if (!form.nome || !form.email) {
            return toastError('Preencha todos os campos')
        }
        setStepsPass((step) => step + 1)
    };

    async function handleRegister(e) {
        e.preventDefault()

        if (form.senhaAuth !== form.senha) {
            return toastError('As senhas não conferem')
        }

        try {
            const { data } = await api.post("/usuarios", {
                nome: formatName(form.nome),
                email: form.email,
                senha: form.senha
            })
            nextStep()
        } catch (error) {
            if (error.response.data.mensagem == 'A senha precisa conter, no mínimo 3 caracteres') {
                toastError(error.response.data.mensagem)
                return
            }
            if (error.response.data.mensagem == 'O campo senha é obrigatório') {
                toastError(error.response.data.mensagem)
                return
            }
            toastError(error.response.data.mensagem)
            setTimeout(() => {
                setStepsPass((step) => step + -1)
            }, 3000)
            return
        }
    };

    console.log(form)

    return (
        <div className="signupContent">
            <div className="progressBar">
                {stepsPass === 0 && (
                    <>
                        <ul className="progressList">
                            <li>
                                <img src={checkedPoint} alt="checked circle" />
                            </li>
                            <li>
                                <img src={greenLine} alt="green line" />
                            </li>
                            <li>
                                <img src={toCheckPoint} alt="check circle" />
                            </li>
                            <li>
                                <img src={greenLine} alt="green line" />
                            </li>
                            <li>
                                <img src={toCheckPoint} alt="check circle" />
                            </li>

                        </ul>
                    </>
                )}
                {stepsPass === 1 && (
                    <>
                        <ul className="progressList">
                            <li>
                                <img src={passedCheck} alt="checked circle" />
                            </li>
                            <li>
                                <img src={greenLine} alt="green line" />
                            </li>
                            <li>
                                <img src={checkedPoint} alt="check circle" />
                            </li>
                            <li>
                                <img src={greenLine} alt="green line" />
                            </li>
                            <li>
                                <img src={toCheckPoint} alt="check circle" />
                            </li>
                        </ul>
                    </>
                )}
                {stepsPass === 2 && (
                    <>
                        <ul className="progressList">
                            <li>
                                <img src={passedCheck} alt="passed circle" />
                            </li>
                            <li>
                                <img src={greenLine} alt="green line" />
                            </li>
                            <li>
                                <img src={passedCheck} alt="passed circle" />
                            </li>
                            <li>
                                <img src={greenLine} alt="green line" />
                            </li>
                            <li>
                                <img src={passedCheck} alt="passed circle" />
                            </li>
                        </ul>
                    </>
                )}
                <div className="statusList">
                    <div className="statusProgress">
                        <h3 className="statusTitle">
                            Cadastre-se
                        </h3>
                        <p className="statusText">
                            Por favor, escreva seu nome e e-mail
                        </p>
                    </div>
                    <div className="statusProgress">
                        <h3 className="statusTitle">
                            Escolha uma senha
                        </h3>
                        <p className="statusText">
                            Escolha uma senha segura
                        </p>
                    </div>
                    <div className="statusProgress">
                        <h3 className="statusTitle">
                            Cadastro realizado com sucesso
                        </h3>
                        <p className="statusText">
                            E-mail e senha cadastrados com sucesso
                        </p>
                    </div>
                </div>
            </div>
            <div className="cardSignup">
                <form onSubmit={handleRegister} className="cardForm">
                    {stepsPass === 0 && (
                        <>
                            <div className="card">
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
                                <h2>
                                    Adicione seus dados
                                </h2>
                                <p>Nome*</p>
                                <input type="text"
                                    required
                                    name="nome"
                                    placeholder="Digite seu nome"
                                    value={form.nome}
                                    onChange={(e) =>
                                        setForm({ ...form, [e.target.name]: e.target.value })
                                    }
                                />
                                <p>E-mail*</p>
                                <input type="text"
                                    placeholder="Digite seu e-mail"
                                    required
                                    name="email"
                                    value={form.email}
                                    onChange={(e) =>
                                        setForm({ ...form, [e.target.name]: e.target.value.trim() })
                                    }
                                />
                                <button onClick={nextStep} className="cardButton hover-btn-one">Continuar</button>
                                <p className="textLink">
                                    Já possui uma conta? Faça seu
                                    <span onClick={() => navigate('/login')} className="link">Login</span>
                                </p>
                            </div>
                            <div className="stageBar">
                                <img src={ActualStage}></img>
                                <img src={NextStage}></img>
                                <img src={NextStage}></img>
                            </div>
                        </>
                    )}
                    {stepsPass === 1 && (
                        <>
                            <div className="card">
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
                                <h2>
                                    Escolha uma senha
                                </h2>
                                <p>Senha*</p>
                                <input
                                    required
                                    placeholder="Digite sua senha"
                                    type={showPassword ? 'text' : 'password'}
                                    name="senha"
                                    value={form.senha.trim()}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            [e.target.name]: e.target.value,
                                        })
                                    }
                                />
                                <img onClick={() => setShowPassword(!showPassword)} className="iconPassword1" src={iconPassword} />
                                <p>Repita a senha*</p>
                                <input
                                    required
                                    placeholder="Repita a senha"
                                    type={showPassword2 ? 'text' : 'password'}
                                    name="senhaAuth"
                                    value={form.senhaAuth.trim()}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            [e.target.name]: e.target.value,
                                        })
                                    }
                                />
                                <img onClick={() => setShowPassword2(!showPassword2)} className="iconPassword2" src={iconPassword} />
                                <button className="cardButton hover-btn-one" onClick={handleRegister}>
                                    Finalizar cadastro
                                </button>
                                <p className="textLink">
                                    Já possui uma conta? Faça seu
                                    <a href="/login" className="link">Login</a>
                                </p>
                            </div>
                            <div className="stageBar">
                                <img src={NextStage}></img>
                                <img src={ActualStage}></img>
                                <img src={NextStage}></img>
                            </div>
                        </>
                    )}
                    {stepsPass === 2 && (
                        <>
                            <div className="signupCompleted">
                                <div className="signupCardContent">
                                    <img src={done} alt="" />
                                    <h2>
                                        Cadastro realizado com sucesso!
                                    </h2>
                                </div>
                                <button className="cardButton hover-btn-one">
                                    <a href="/login">
                                        Ir para o Login
                                    </a>
                                </button>
                                <div className="stageBar">
                                    <img src={NextStage}></img>
                                    <img src={NextStage}></img>
                                    <img src={ActualStage}></img>
                                </div>
                            </div>
                        </>
                    )}
                </form>
            </div>
        </div>
    )
}