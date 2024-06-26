import { createContext, ReactNode, useState } from "react"

import UsuarioLogin from "../models/UsuarioLogin"
import { login } from "../services/Service"
import { toastAlerta } from "../util/ToastAlerta"
// import { toastAlerta } from "../utils/toastAlerta"

interface AuthContextProps {
    usuario: UsuarioLogin
    handleLogout(): void
    handleLogin(usuario: UsuarioLogin): Promise<void>
    isLoading: boolean
}

interface AuthProviderProps {
    children: ReactNode
}
//Construção inicial do contexto de armazenamento
export const AuthContext = createContext({} as AuthContextProps)
// Função que gerencia o contexto de Armazenamento
export function AuthProvider({ children }: AuthProviderProps) {
 // Criando o estado de Usuario Logado - useState
    const [usuario, setUsuario] = useState<UsuarioLogin>({
        id: 0,
        nome: "",
        usuario: "",
        senha: "",
        foto: "",
        token: ""
    })
    
    const [isLoading, setIsLoading] = useState(false)
    // Responsalvel por logar o usuario e atualizar o estado de usuario

    async function handleLogin(userLogin: UsuarioLogin) {
        setIsLoading(true) // Indica que está havendo algum processamento
        try {
            await login(`/usuarios/logar`, userLogin, setUsuario)
            toastAlerta("Usuário logado com sucesso",'info')
            setIsLoading(false)

        } catch (error) {
            console.log(error)
            toastAlerta("Dados do usuário inconsistentes",'erro')
            setIsLoading(false)
        }
    }

    // Responsavel por deslogar o usuario reiniciando o estado de usuario logado
    function handleLogout() {
        setUsuario({
            id: 0,
            nome: "",
            usuario: "",
            senha: "",
            foto: "",
            token: ""
        })
    }

    return (
        <AuthContext.Provider value={{ usuario, handleLogin, handleLogout, isLoading }}>
            {children}
        </AuthContext.Provider>
    )
}