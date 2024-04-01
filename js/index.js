// variaveis especias
const btnLogin = document.getElementById("btnLogin");
const email = document.getElementById("email");
const password = document.getElementById("password");

// screens
const loginPage = document.getElementById("loginPage");
const cadastroPage = document.getElementById("cadastroPage");
const btn_close_cadastro_screen = document.getElementById("btn-close-cadastro");
const btnCadastro = document.getElementById("btnCadastro");
const btnCadastrar = document.getElementById('btnCadastrar');
const homePage = document.getElementById('home_page');
const bodyClasseNotesPage = document.getElementById('bodyClasseNotes');

// variaveis de dados
const cadastro_fullname = document.getElementById('cadastro_fullname')
const cadastro_email = document.getElementById('cadastro_email')
const cadastro_password = document.getElementById('cadastro_password')
const cadastro_password_confirmation = document.getElementById('cadastro_password_confirmation')

// variaveis de botoes 
const btnSignOut = document.getElementById('btnSignOut');
const btnRegistrarClasse_10 = document.getElementById('btnRegistrarClasse_10');
const btnRegistrarClasse_11 = document.getElementById('btnRegistrarClasse_11');
const btnRegistrarClasse_12 = document.getElementById('btnRegistrarClasse_12');

// variaveis de suporte
const loginEmail = document.getElementById('login_email')
const loginPassword = document.getElementById('login_password')
const selectClasseDoAluno = document.getElementById('select_class');

// variaveis principais e globais
const studentDB = new LocalStorage("student_notes");
const accountDB = new LocalStorage("account");
const loginData = new LocalStorage("loginData");

// variaveis auxiliares 
const user = [accountDB.get()].length > 0 ? accountDB.get() : [
  {
    email: "admin@gmail.com", 
    password: "admin",
    fullname: "MonjiOilita",
    logged: false,
    id: 1
  },
];


// notes sao todas as notas 
// notes.first sao as notas da 10ª classe 
// notes.second sao as notas da 11ª classe 
// notes.third sao as notas da 12ª classe 
let notes = null;

if (studentDB.get().length == 0) {
  notes = {
    first: [],
    second: [],
    third: []
  }
}else if (
  studentDB.get().first.length > 0 || 
  studentDB.get().second.length > 0 || 
  studentDB.get().third.length > 0){
  notes = studentDB.get();
}


 


// inserindo o primeiro usuario  ou admin na base de dados local 
// accountDB.clear()
if(!accountDB.get().length > 0 ) {
  accountDB.set(user);
}

// verificando se o usuario ja esta logado ou nao. Caso , redirecionando ele a pagina inicial... 
loggedUser();

// botoes 
// botao de login ou que permite que o login seja possivel
btnLogin.addEventListener("click", (evt) => {
  evt.preventDefault();

  // buscando o usuário caso estejá cadastrado... 
  const filteredUser = user.filter(user => user.email == loginEmail.value && user.password == loginPassword.value);

  // se o usuário foi realmente encontrado, da as boas vindas a ele, senao informa o erro na senha ou email... 
  if(filteredUser.length > 0){
    alert(`Olá sejá muito bem vindo(a) ${filteredUser[0].fullname}`);
    loginPage.classList.add("hide");
    homePage.classList.remove('hide');

    const userId = filteredUser[0].id;

    user[userId-1] = {
      email: filteredUser[0].email, 
      password: filteredUser[0].password,
      fullname: filteredUser[0].fullname,
      logged: true,
      id: filteredUser[0].id
    };

    accountDB.set('account', user); 


    // Essa estrutura de codigo iria cuidar de me avisar quem é o usuário no login atual mas dai que lembrei que devo fazer bom e racional uso do localStorage, entao lembrei tambem de uma forma de saber quem esta no comando que nem na funcao loggedUser(); 
    // loginData.set({
    //   email: filteredUser[0].email, 
    //   password: filteredUser[0].password,
    //   fullname: filteredUser[0].fullname,
    //   logged: true,
    //   id: 1
    // });
  }else{
    alert('Email e Senha incorretos. O usuário provavelmente não existe. Tente novamente!');
  }
});

// botao de Logout ou Sign-out ou terminar sessão 
btnSignOut.addEventListener('click', (evt) => {
  // evitando que a pagina faça reload ou recarregue após o botao for clicado 
  evt.preventDefault();

  // perguntando ao usuairo se realmente deseja sair ou terminar sessão
  const exit = confirm('Tem certeza que deseja sair?');

  // verifcando se o usuário respondeu sim ou não! 
  if (exit == true) {
      const filteredUser = user.filter(user => user.logged == true)[0];

      user[filteredUser.id - 1] = {email: filteredUser.email, password: filteredUser.password, fullname: filteredUser.fullname, logged: false, id: filteredUser.id};

      // alert(user[filteredUser.id - 1].logged);
      // atualizando os dados do usuário 
      accountDB.set('account', user);

      // funcao que atualiza a pagina ou a recarrega;
      location.reload();
    }


});

btn_close_cadastro_screen.addEventListener("click", () => {
  cadastroPage.classList.add("hide");
});

btnCadastro.addEventListener("click", (event) => {
  event.preventDefault();
  cadastroPage.classList.remove('hide');
});

// botão de cadastro 
btnCadastrar.addEventListener('click', () => {
  // Fazendo um pouco de validacao
  // Validando se a palavra-passe e a confirmaçao de palavra-passe são identicas 

  if (!(cadastro_password.value == cadastro_password_confirmation.value)) {
    alert('A palavra-passe e a sua confirmação não são identicas.');
    return;
  }

  // verificando se a algum campo vazio sendo passado 
  if (cadastro_email.value == '' || cadastro_fullname.value == '' || cadastro_password.value == '' || cadastro_password_confirmation.value == '') {
    alert('Não pode haver campo vazio! Preencha bem todos os campos');
    return;
  }

  let newUserID = null;

  if(user.length == 0){
    newUserID = 0;
  }else{
    newUserID = user[user.length - 1].id;
  }


  const newUser = {email: cadastro_email.value, password: cadastro_password.value, fullname: cadastro_fullname.value, logged: false, id: newUserID + 1};

  user.push(newUser);
  accountDB.set('account', user);

  alert('Usuário cadastrado com sucesso!');

  cadastro_email.value = '';
  cadastro_fullname.value = '';
  cadastro_password.value = '';
  cadastro_password_confirmation.value = '';
});

 

selectClasseDoAluno.addEventListener('change', () => {
  const selected_classe = +selectClasseDoAluno.selectedOptions.item(0).value;
  const students_notes = studentDB.get();
  
  const userSelFirst = Array.from(students_notes.first);
  const userSelSecond = [...students_notes.second];
  const userSelThird = [...students_notes.third];

  // =========================================================
  if (selected_classe == 10) {
    if (userSelFirst.length == 0) {
      bodyClasseNotesPage.innerHTML = `<h2>De momento não temos notas disponíveis! Espere o cadastro de alguma nota ou volte mais tarde ou então contacte o programador!</h2>`;
      return;
    }
    
    bodyClasseNotesPage.innerHTML = '';

    userSelFirst.map(note => {

      bodyClasseNotesPage.innerHTML += `
        <tr>
          <td>${note.student}</td>
          <td>${note.biologia}</td>
          <td>${note.lingua_estrangeira}</td>
          <td>${note.anatomia_e_fisiologia_humana}</td>
          <td>${note.matematica}</td>
          <td>${note.portugues}</td>
          <td>${note.edt}</td>
          <td>${note.iec}</td>
          <td>${note.fai}</td>
          <td>${note.quimica_geral}</td>
          <td>${note.informatica}</td>
          <td>${note.educacao_fisica}</td>
          <td>${note.fisica}</td>
        </tr>
    `})
    return;
  }

  // =========================================================
  if (selected_classe == 11) {
    if (userSelSecond.length == 0) {
      bodyClasseNotesPage.innerHTML = `<h2>De momento não temos notas disponíveis! Espere o cadastro de alguma nota ou volte mais tarde ou então contacte o programador!</h2>`;
      return;
    }

    bodyClasseNotesPage.innerHTML = '';
    
    userSelSecond.map(note => {

      bodyClasseNotesPage.innerHTML += `
        <tr>
          <td>${note.student}</td>
          <td>${note.lingua_portuguesa}</td>
          <td>${note.lingua_estrangeira}</td>
          <td>${note.quimica_organica}</td>
          <td>${note.educacao_fisica}</td>
          <td>${note.matematica}</td>
          <td>${note.psicologia_geral}</td>
          <td>${note.anatomina_e_fisiologia_humana}</td>
          <td>${note.biologia}</td>
          <td>${note.epidemiologia_e_estatistica}</td>
          <td>${note.farmatologia}</td>
          <td>${note.enfermagem_e_patologia_medico_cirurgica}</td>
          <td>${note.tecnicas_de_enfermagem}</td>
          <td>${note.assistencia_de_enfermagem_em_saude_da_mulher}</td>
          <td>${note.assistencia_de_enfermagem_em_saude_da_crianca}</td>
        </tr>
    `})
    return;
  }

  // ===================================================
  if (selected_classe == 12) {
    if (userSelThird.length == 0) {
      bodyClasseNotesPage.innerHTML = `<h2>De momento não temos notas disponíveis! Espere o cadastro de alguma nota ou volte mais tarde ou então contacte o programador!</h2>`;
      return;
    }
    
    bodyClasseNotesPage.innerHTML = '';

    userSelThird.forEach(note => {
      bodyClasseNotesPage.innerHTML += `
        <tr>
          <td>${note.student}</td>
          <td>${note.enfermagem_e_saude_mental}</td>
          <td>${note.enfermagem_e_saude_colectiva}</td>
          <td>${note.assitencia_em_enfermagem_em_urgencias_e_emergencias}</td>
          <td>${note.nutricao_e_dietetica}</td>
          <td>${note.enfermagem_e_patologia_medico_cirurgica}</td>
          <td>${note.tecnicas_de_enfermagem}</td>
          <td>${note.assistencia_de_enfermagem_em_saude_da_mulher}</td>
          <td>${note.assistencia_de_enfermagem_em_saude_da_crianca}</td>
          <td>${note.projecto_tecnologico}</td>
          <td>${note.gestao_em_saude}</td>
        </tr>
    `})
    return;
  }

  // exibindo uma mensagem ideal caso não hajá nenhuma opção ideal selecionada;
  // ========================================================
  if(selected_classe == 0){
    bodyClasseNotesPage.innerHTML = '';
    bodyClasseNotesPage.innerHTML = '<p>Por favor selecione uma das opções no menu</p>';
  }
});


// botao de registro das notas da 10ª classe 
btnRegistrarClasse_10.addEventListener('click', (evt) => {
  // evitando a atualização da pagina 
  evt.preventDefault();

  // buscando os dados de cada input necessarios para o funcionamento adecuado da estrutura de objecto abaixo... 

  // buscando o nome do usuario logado ou seja do AudioWorkletNode... 
  const loggedUser = [...accountDB.get()].filter(user => user.logged == true)[0].fullname;

  const newNote = {
    student: loggedUser,
    portugues: document.getElementById('Classe_10_portugues').value,
    lingua_estrangeira: document.getElementById('Classe_10_lingua_estrangeira').value,
    fai: document.getElementById('Classe_10_fai').value,
    educacao_fisica: document.getElementById('Classe_10_educacao_fisica').value,
    matematica: document.getElementById('Classe_10_matematica').value,
    biologia: document.getElementById('Classe_10_biologia').value,
    fisica: document.getElementById('Classe_10_fisica').value,
    quimica_geral: document.getElementById('Classe_10_quimica_geral').value,
    informatica: document.getElementById('Classe_10_informatica').value,
    edt: document.getElementById('Classe_10_edt').value,
    iec: document.getElementById('Classe_10_iec').value,
    anatomia_e_fisiologia_humana: document.getElementById('Classe_10_anatomia').value
  }

  notes.first.push(newNote);
  studentDB.set('student_notes',notes);

  console.log(newNote);
  console.log(notes);
  console.log(studentDB.get());

  alert('Registrado com sucesso! Por favor acesse as notas pra visualiza-las');
});

// botao de registro das notas da 11ª classe 
btnRegistrarClasse_11.addEventListener('click', (evt) => {
  // evitando a atualização da pagina 
  evt.preventDefault();

  // buscando os dados de cada input necessarios para o funcionamento adecuado da estrutura de objecto abaixo... 

  const loggedUser = [...accountDB.get()].filter(user => user.logged == true)[0].fullname;

  const newNote = {
    student: loggedUser,
    lingua_portuguesa: document.getElementById('Classe_11_portugues').value,
    lingua_estrangeira: document.getElementById('Classe_11_lingua_estrangeira').value,
    quimica_organica: document.getElementById('Classe_11_quimica_org').value,
    educacao_fisica: document.getElementById('Classe_11_educacao_fisica').value,
    matematica: document.getElementById('Classe_11_matematica').value,
    psicologia_geral: document.getElementById('Classe_11_psicologia').value,
    anatomina_e_fisiologia_humana: document.getElementById('Classe_11_anatomia').value,
    biologia: document.getElementById('Classe_11_biologia').value,
    epidemiologia_e_estatistica: document.getElementById('Classe_11_epidemologia').value,
    farmatologia: document.getElementById('Classe_11_farmatologia').value,
    enfermagem_e_patologia_medico_cirurgica: document.getElementById('Classe_11_enfermagem_mc').value,
    tecnicas_de_enfermagem: document.getElementById('Classe_11_tecnicas').value,
    assistencia_de_enfermagem_em_saude_da_mulher: document.getElementById('Classe_11_assistencia_saude_m').value,
    assistencia_de_enfermagem_em_saude_da_crianca: document.getElementById('Classe_11_assistencia_saude_c').value
  }

  notes.second.push(newNote);

  studentDB.set('student_notes', notes);

  console.log(newNote);
  console.log(notes);
  console.log(studentDB.get());

  alert('Registrado com sucesso! Por favor acesse as notas pra visualiza-las');
});

// botao de registro das notas da 12ª classe 
btnRegistrarClasse_12.addEventListener('click', (evt) => {
  // evitando a atualização da pagina 
  evt.preventDefault();

  // buscando os dados de cada input necessarios para o funcionamento adecuado da estrutura de objecto abaixo... 

  const loggedUser = [...accountDB.get()].filter(user => user.logged == true)[0].fullname;

  const newNote = {
    student: loggedUser,
    enfermagem_e_saude_mental: document.getElementById('Classe_12_enfermagem_saude_m').value,
    enfermagem_e_saude_colectiva: document.getElementById('Classe_12_enfermagem_saude_c').value,
    assitencia_em_enfermagem_em_urgencias_e_emergencias: document.getElementById('Classe_12_asssitencia_emergencia').value,
    nutricao_e_dietetica: document.getElementById('Classe_12_nutricao').value,
    enfermagem_e_patologia_medico_cirurgica: document.getElementById('Classe_12_enfermagem_mc').value,
    tecnicas_de_enfermagem: document.getElementById('Classe_12_tecnicas').value,
    assistencia_de_enfermagem_em_saude_da_mulher: document.getElementById('Classe_12_assistencia_mulher').value,
    assistencia_de_enfermagem_em_saude_da_crianca: document.getElementById('Classe_12_assistencia_crianca').value,
    projecto_tecnologico: document.getElementById('Classe_12_pt').value,
    gestao_em_saude: document.getElementById('Classe_12_gestao').value
  }

  notes.third.push(newNote);

  studentDB.set('student_notes',notes);

  console.log(newNote);
  console.log(notes);
  console.log(studentDB.get());

  alert('Registrado com sucesso! Por favor acesse as notas pra visualiza-las');
});


// functions 
// funcao que verifica se o usuario ja tem acesso logado e caso sim, mantem a pagina inicial aberta.
function loggedUser () {
  const loggedUser = user.filter(user => user.logged == true);

  if (loggedUser.length > 0) {
    loginPage.classList.add('hide');
    cadastroPage.classList.add('hide');
    homePage.classList.remove('hide');
  }
}

// handle functions 
function handleDeleteUser(userId, evt){
  evt.preventDefault();
  const answer = confirm('Desejá apagar este usuário?')

  if (answer == true) {
    
    user.splice(userId-1, 1);

    accountDB.set('account', user);

    alert('Usuário apagado com sucesso!');

    console.log('O usuario ' + userId + ' foi apagado!')
  }
}


// exibindo informações importantes, como se há usuário ou não ou dados de estudantes ou não no console log pra no caso de eventuais erros...
console.log('=====================================');
console.log(`Usuários:`);
console.log(accountDB.get());
console.log('=====================================');
console.log(`Estudantes:`);
console.log(studentDB.get());
console.log('=====================================');