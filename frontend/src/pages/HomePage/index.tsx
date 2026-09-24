import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { usuarioService } from "../../services/usuario.service";
import { cursoService } from "../../services/curso.service";
import { matriculaService } from "../../services/matricula.service";
import { certificadoService } from "../../services/certificado.service";
import { trilhaService } from "../../services/trilha.service";
import { assinaturaService } from "../../services/assinatura.service";

interface CardResumo {
    titulo: string;
    valor: number;
    icon: string;
    cor: string;
    link: string;
}

export const HomePage = () => {

    const [resumo, setResumo] = useState<CardResumo[]>([]);
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        const carregar = async () => {
            try {
                const [usuarios, cursos, matriculas, certificados, trilhas, assinaturas] =
                    await Promise.all([
                        usuarioService.listar(),
                        cursoService.listar(),
                        matriculaService.listar(),
                        certificadoService.listar(),
                        trilhaService.listar(),
                        assinaturaService.listar(),
                    ]);
                setResumo([
                    { titulo: "Usuários", valor: usuarios.length, icon: "bi-people-fill", cor: "primary", link: "/usuarios" },
                    { titulo: "Cursos", valor: cursos.length, icon: "bi-journal-bookmark-fill", cor: "success", link: "/cursos" },
                    { titulo: "Matrículas", valor: matriculas.length, icon: "bi-card-checklist", cor: "info", link: "/matriculas" },
                    { titulo: "Certificados", valor: certificados.length, icon: "bi-patch-check-fill", cor: "warning", link: "/certificados" },
                    { titulo: "Trilhas", valor: trilhas.length, icon: "bi-signpost-split-fill", cor: "danger", link: "/trilhas" },
                    { titulo: "Assinaturas", valor: assinaturas.length, icon: "bi-credit-card-2-front-fill", cor: "dark", link: "/financeiro" },
                ]);
            } catch {
                setResumo([]);
            } finally {
                setCarregando(false);
            }
        };
        carregar();
    }, []);

    return (
        <div>
            <div className="p-4 mb-4 rounded-3 text-white" style={{ background: "linear-gradient(135deg, #212529, #495057)" }}>
                <h1 className="display-6 d-flex align-items-center gap-2">
                    <i className="bi bi-mortarboard-fill text-warning"></i>
                    Gustavo Milhomem Cursos
                </h1>
                <p className="lead mb-0">
                    Plataforma de Cursos Online — gestão acadêmica, progresso dos alunos e controle financeiro.
                </p>
            </div>

            {carregando ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-warning" role="status"></div>
                    <p className="mt-2 text-muted">Carregando indicadores...</p>
                </div>
            ) : resumo.length === 0 ? (
                <div className="alert alert-warning">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    Não foi possível carregar os dados. Verifique se a <strong>API NestJS</strong> está rodando em <code>http://localhost:3000</code>.
                </div>
            ) : (
                <div className="row g-3">
                    {resumo.map((card) => (
                        <div className="col-12 col-sm-6 col-lg-4" key={card.titulo}>
                            <Link to={card.link} className="text-decoration-none">
                                <div className={`card border-start border-4 border-${card.cor} h-100`}>
                                    <div className="card-body d-flex align-items-center justify-content-between">
                                        <div>
                                            <h6 className="text-muted mb-1">{card.titulo}</h6>
                                            <h2 className="mb-0 text-dark">{card.valor}</h2>
                                        </div>
                                        <i className={`bi ${card.icon} fs-1 text-${card.cor}`}></i>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            )}

            <div className="card mt-4">
                <div className="card-header bg-dark text-white">
                    <i className="bi bi-diagram-3-fill me-2"></i>
                    Módulos do Sistema
                </div>
                <div className="card-body">
                    <div className="row g-3">
                        <div className="col-md-4">
                            <h6 className="text-primary"><i className="bi bi-book me-1"></i> Acadêmico e Conteúdo</h6>
                            <p className="small text-muted mb-0">Categorias, Cursos, Trilhas, Módulos e Aulas.</p>
                        </div>
                        <div className="col-md-4">
                            <h6 className="text-success"><i className="bi bi-person-check me-1"></i> Usuário e Progresso</h6>
                            <p className="small text-muted mb-0">Usuários, Matrículas, Progresso e Certificados.</p>
                        </div>
                        <div className="col-md-4">
                            <h6 className="text-danger"><i className="bi bi-cash-coin me-1"></i> Financeiro</h6>
                            <p className="small text-muted mb-0">Planos, Assinaturas e Pagamentos (checkout).</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
