-----

# 📅 Projeto de Agendamento de Aulas - Frontend

Este repositório contém a **parte de frontend** do sistema de **GEA - Gestão de espaços acadêmicos**, desenvolvido em **Angular**.
O objetivo do projeto é fornecer uma interface moderna, intuitiva e responsiva para que professores e administradores possam gerenciar seus agendamentos de forma prática.

-----

## 🚀 Tecnologias Utilizadas

  * [Angular](https://angular.io/)
  * [TypeScript](https://www.typescriptlang.org/)
  * [ESLint](https://eslint.org/)
  * [Prettier](https://prettier.io/)

-----

## ⚙️ Como executar o projeto

1.  **Clone o repositório**

    ```bash
    git clone https://github.com/seu-usuario/seu-repositorio.git
    cd seu-repositorio
    ```

2.  **Instale as dependências**

    ```bash
    npm install
    ```

3.  **Execute o servidor de desenvolvimento**

    ```bash
    ng serve
    ```

    O projeto estará disponível em: [http://localhost:4200](https://www.google.com/search?q=http://localhost:4200)

-----

## 🛠️ Configuração do Ambiente

Para manter a padronização do código, utilize as seguintes extensões no **VS Code**:

  * [**Prettier - Code Formatter**](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
  * [**ESLint**](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

Após instalar as extensões, configure nas configurações de usuário (settings.json). Para acessar basta utilizar `ctrl+shift+p` e digitar `User settings (JSON)`:

```json
    "eslint.validate": [
        "javascript",
        "javascriptreact",
        "typescript",
        "typescriptreact",
        "html",
    ],
    "editor.codeActionsOnSave": {
        "source.fixAll.eslint": "always"
    }
```

Essas ferramentas garantem a formatação automática e a análise de código em tempo real, seguindo as regras definidas no projeto.

-----

## 📚 Documentação do Código (TSDoc)

O projeto utiliza [**TSDoc**](https://tsdoc.org/) para a documentação interna do código-fonte. Geramos esta documentação em um site local interativo para consulta.

**Para gerar e visualizar a documentação:**

1.  Execute o script de documentação:
    ```bash
    npm run doc
    ```
2.  Após executar o comando, acesse o link fornecido no terminal (geralmente [http://127.0.0.1:8080](http://127.0.0.1:8080)).

-----

## 👥 Equipe de Desenvolvimento

  * [**Isaque Barbosa**](https://github.com/IsaqueBatist) – *Líder do Frontend*
  * [Felipe Santos nascimento](https://github.com/felip-SN)
  * [Nicolas Augusto Almeida](https://github.com/Nicolas-Augusto-Almeida)
  * [Enzo de Aguiar Rodrigues](https://github.com/YungCrock)

-----

## 📌 Fluxo de Contribuição

1.  Escolha ou crie uma **issue**.
2.  Crie uma **branch** com o nome da issue.
3.  Desenvolva a solução e faça **commits** claros.
4.  Abra um **Pull Request (PR)** para a branch principal.
5.  O líder revisará e aprovará (ou solicitará ajustes).
6.  A issue será fechada após a aprovação do PR.

-----

## 📄 Licença

Este projeto é de uso acadêmico e foi desenvolvido no contexto da **FATEC Itu**.
