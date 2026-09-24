export type PerfilUsuario = "administrador" | "instrutor" | "aluno";

export interface IUsuario {
    id?: number;
    nomeCompleto: string;
    email: string;
    // A senha só é enviada ao criar/alterar; a API nunca devolve este campo
    senha?: string;
    perfil: PerfilUsuario;
    dataCadastro: string;
}

// Dados do usuário autenticado, devolvidos pela rota POST /auth/login
export interface IUsuarioLogado {
    id: number;
    nomeCompleto: string;
    email: string;
    perfil: PerfilUsuario;
}
