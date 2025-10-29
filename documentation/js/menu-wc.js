'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">agenda-salas-fatec-front-end documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                                <li class="link">
                                    <a href="overview.html" data-type="chapter-link">
                                        <span class="icon ion-ios-keypad"></span>Overview
                                    </a>
                                </li>

                            <li class="link">
                                <a href="index.html" data-type="chapter-link">
                                    <span class="icon ion-ios-paper"></span>
                                        README
                                </a>
                            </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>

                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-bs-toggle="collapse" ${ isNormalMode ?
                                'data-bs-target="#modules-links"' : 'data-bs-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-AppModule-938e46efe0cccfd5b66239e177b53acf887377c8035b1cf9a3df05bb738fcfb2487be0e14095b46cee2904d5083bd181302fb0a7c248d20fe4dfb988818da4e0"' : 'data-bs-target="#xs-components-links-module-AppModule-938e46efe0cccfd5b66239e177b53acf887377c8035b1cf9a3df05bb738fcfb2487be0e14095b46cee2904d5083bd181302fb0a7c248d20fe4dfb988818da4e0"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AppModule-938e46efe0cccfd5b66239e177b53acf887377c8035b1cf9a3df05bb738fcfb2487be0e14095b46cee2904d5083bd181302fb0a7c248d20fe4dfb988818da4e0"' :
                                            'id="xs-components-links-module-AppModule-938e46efe0cccfd5b66239e177b53acf887377c8035b1cf9a3df05bb738fcfb2487be0e14095b46cee2904d5083bd181302fb0a7c248d20fe4dfb988818da4e0"' }>
                                            <li class="link">
                                                <a href="components/Agenda.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >Agenda</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/App.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >App</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/Aulas.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >Aulas</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AuthLayout.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthLayout</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ClassInfoCard.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ClassInfoCard</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/Configuracoes.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >Configuracoes</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ConfirmationModal.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ConfirmationModal</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DaySelector.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DaySelector</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EditarAula.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EditarAula</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/Header.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >Header</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/Login.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >Login</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MainLayout.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MainLayout</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/Notificacoes.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >Notificacoes</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/NotificationCard.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >NotificationCard</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RommInformationComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RommInformationComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/Scheduling.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >Scheduling</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TabBar.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TabBar</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TitleHighligh.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TitleHighligh</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppRoutingModule.html" data-type="entity-link" >AppRoutingModule</a>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#classes-links"' :
                            'data-bs-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/FormatUtils.html" data-type="entity-link" >FormatUtils</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#injectables-links"' :
                                'data-bs-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AgendamentoEffects.html" data-type="entity-link" >AgendamentoEffects</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AgendamentoService.html" data-type="entity-link" >AgendamentoService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AuthEffects.html" data-type="entity-link" >AuthEffects</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AuthService.html" data-type="entity-link" >AuthService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CursoService.html" data-type="entity-link" >CursoService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/DisciplinaService.html" data-type="entity-link" >DisciplinaService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/IconRegistryService.html" data-type="entity-link" >IconRegistryService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/NotificationService.html" data-type="entity-link" >NotificationService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SalaService.html" data-type="entity-link" >SalaService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interfaces-links"' :
                            'data-bs-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/Agendamento.html" data-type="entity-link" >Agendamento</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AgendamentoState.html" data-type="entity-link" >AgendamentoState</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AuthState.html" data-type="entity-link" >AuthState</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Curso.html" data-type="entity-link" >Curso</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Curso-1.html" data-type="entity-link" >Curso</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Day.html" data-type="entity-link" >Day</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Disciplina.html" data-type="entity-link" >Disciplina</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/EditAgendamento.html" data-type="entity-link" >EditAgendamento</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Field.html" data-type="entity-link" >Field</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Notificacao.html" data-type="entity-link" >Notificacao</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Option.html" data-type="entity-link" >Option</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RoomData.html" data-type="entity-link" >RoomData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Sala.html" data-type="entity-link" >Sala</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Teacher.html" data-type="entity-link" >Teacher</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/User.html" data-type="entity-link" >User</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UserCredencials.html" data-type="entity-link" >UserCredencials</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <a data-type="chapter-link" href="routes.html"><span class="icon ion-ios-git-branch"></span>Routes</a>
                        </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});