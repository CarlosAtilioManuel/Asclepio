
// classe que gerencia o localStorage ou seja a memoria local;
class LocalStorage {
    store = localStorage;
    name = ''

    // funcao construtora, que pega no nome do localStorage e o armazena numa variavel e depois faz o seu uso normalmente. 
    constructor (itemName = '') {
        this.name = itemName;
    }

    // metodo que insere um dado novo num localstorage especifico;
    set (itemNam = '', value) {
        if(itemNam.length == 0) {
            this.store.setItem(this.name, JSON.stringify(value));
        }else{
            this.store.setItem(itemNam, JSON.stringify(value));
        }
    }

    // metodo que busca ou retorna os dados num localstorage especifico;
    get() {
        if(this.store.getItem(this.name) == 'undefined' || this.store.getItem(this.name) == undefined)
            return [];
        else
            return JSON.parse(this.store.getItem(this.name));
    }

    // metodo que remove ou apaga um um localstorage especifico;
    delete ( itemName = '') {
        if(itemName || itemName.length > 0){
            this.store.removeItem(itemName);
        }else{
            this.store.removeItem(this.name)
        }
    }

    // metodo que apaga os dados de todos os localstorage existentes;
    clear () {
        this.store.clear()
    }
}
