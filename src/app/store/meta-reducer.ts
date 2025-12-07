import type { ActionReducer } from '@ngrx/store';
import type { MetaReducer } from '@ngrx/store';
import { localStorageSync } from 'ngrx-store-localstorage';

// Função que cria o nosso meta-reducer de sincronização
function localStorageSyncReducer(reducer: ActionReducer<any>): ActionReducer<any> {
  return localStorageSync({
    // 1. Defina as "chaves" (as fatias do seu estado) que você quer salvar.
    // O nome aqui DEVE ser o mesmo que você usou no StoreModule.forRoot().
    keys: ['auth'], // Vamos salvar apenas o estado de autenticação por enquanto

    // 2. (Opcional, mas recomendado) Remove o estado do localStorage no logout.
    // Isso garante que se um usuário fizer logout, o próximo não verá seus dados.
    rehydrate: true, // Diz ao NgRx para "re-hidratar" (carregar) o estado do localStorage no início
    removeOnUndefined: true, // Remove a chave 'auth' do localStorage se o estado for 'undefined' (útil no logout)
  })(reducer);
}

export const metaReducers: Array<MetaReducer<any, any>> = [localStorageSyncReducer];
