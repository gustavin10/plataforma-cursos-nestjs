-- CreateTable
CREATE TABLE "notificacoes" (
    "id" SERIAL NOT NULL,
    "idUsuario" INTEGER NOT NULL,
    "titulo" TEXT NOT NULL,
    "mensagem" TEXT NOT NULL,
    "lida" BOOLEAN NOT NULL DEFAULT false,
    "criadaEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notificacoes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "notificacoes" ADD CONSTRAINT "notificacoes_idUsuario_fkey" FOREIGN KEY ("idUsuario") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
