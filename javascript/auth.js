import { db, app, auth } from "./firebaseConfig.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

//CADASTRO

const emailInput = document.getElementById("email");
const senhaInput = document.getElementById("senha");
const btnCadastro = document.getElementById("btnCadastro");
const mensagemCadastro = document.getElementById("mensagemCadastro");

async function cadastrarUsuario(email, senha) {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      senha
    );
    return userCredential.user;
  } catch (error) {
    console.error("Erro ao cadastrar:", error.code, error.message);
    let mensagemErro = "Ocorreu um erro ao cadastrar. Tente novamente.";
    switch (error.code) {
      case "auth/email-already-in-use":
        mensagemErro = "O email informado já esta em uso.";
        break;
      case "auth/invalid-email":
        mensagemErro = "O email informado é inválido.";
        break;
      case "auth/weak-password":
        mensagemErro = "A senha informada deve ter pelo menos 6 caracteres.";
        break;
    }
    throw { message: mensagemErro };
  }
}

if (btnCadastro) {
  btnCadastro.addEventListener("click", async function () {
    const email = emailInput.value;
    const senha = senhaInput.value;
    mensagemCadastro.textContent = "";

    if (!email || !senha) {
      mensagemCadastro.textContent = "Por favor, preencha todos os campos.";
      return;
    }

    try {
      const user = await cadastrarUsuario(email, senha);
      console.log("Usuário cadastrado: ", user);
      mensagemCadastro.textContent;
      setTimeout(function () {
        window.location.href = "./login.html";
      }, 2000);
    } catch (error) {
      mensagemCadastro.textContent = "Erro no cadastro: ${error.message}";
    }
  });
}

//LOGIN

const emailLogin = document.getElementById("email-login");
const senhaLogin = document.getElementById("senha-login");
const btnLogin = document.getElementById("btnLogin");
const mensagemLogin = document.getElementById("mensagemLogin");

async function loginUsuario(email, senha) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, senha);
    console.log(userCredential);
    return userCredential.user;
  } catch (error) {
    console.error("Erro ao fazer login:", error.code, error.message);
    let mensagemErro = "Ocorreu um erro ao fazer login. Tente novamente.";
    switch (error.code) {
      case "auth/invalid-email":
        mensagemErro = "O email ou senha informados é inválido.";
        break;
      case "auth/user-not-found":
        mensagemErro = "O email informado nao foi encontrado.";
        break;
      case "auth/missing-password":
        mensagemErro = "A senha informada nao confere.";
        break;
      case "auth/user-disabled":
        mensagemErro = "Conta desativada.";
        break;
      case "auth/invalid-credential":
        mensagemErro = "O email ou senha informados é inválido.";
        break;
    }
    throw { message: mensagemErro };
  }
}

if (btnLogin) {
  btnLogin.addEventListener("click", async function () {
    const email = emailLogin.value;
    const senha = senhaLogin.value;
    mensagemLogin.textContent = "";

    try {
      const user = await loginUsuario(email, senha);
      window.location.href = "./estoque.html";
    } catch (error) {
      mensagemLogin.textContent = "Erro no Login: ${error.message}";
    }
  });
}
