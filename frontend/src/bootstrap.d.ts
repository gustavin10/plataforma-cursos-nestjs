// Tipagem mínima para a API JS do Bootstrap usada no projeto (Offcanvas).
declare module "bootstrap" {
    export class Offcanvas {
        constructor(element: Element);
        static getInstance(element: Element): Offcanvas | null;
        hide(): void;
        show(): void;
    }
}
