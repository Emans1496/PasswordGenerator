const charactersUppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const charactersLowercase = "abcdefghijklmnopqrstuvwxyz".split("");
const charactersNumbers = "0123456789".split("");
const charactersSymbols = "~`!@#$%^&*()_-+={}[]|:;<>.?/".split("");

let passwordOne = "";
let passwordTwo = "";
const errorMessageText = "Please select at least one type of character";
const successMessage = "Password copied to clipboard";

let passwordOneParagraphEl = document.getElementById("passwordOneParagraph");
let passwordTwoParagraphEl = document.getElementById("passwordTwoParagraph");
let copyMessageEl = document.getElementById("copyMessage");

let generatePasswordsBtn = document.getElementById("generatePasswordsBtn");
let errorMessageEl = document.getElementById("errorMessage");

let passwordLengthInput = document.getElementById("passwordLength");
let passwordLengthValueEl = document.getElementById("passwordLengthValue");
passwordLengthInput.addEventListener("input", function () {
  passwordLengthValueEl.textContent = passwordLengthInput.value;
});

generatePasswordsBtn.addEventListener("click", generatePasswords);

passwordOneParagraphEl.addEventListener("click", copyTextOne);
passwordTwoParagraphEl.addEventListener("click", copyTextTwo);

function resetPasswords() {
  passwordOne = "";
  passwordTwo = "";
  passwordOneParagraphEl.textContent = "Option One";
  passwordTwoParagraphEl.textContent = "Option Two";
  errorMessageEl.textContent = "";
}

function generateCharacterPool() {
  let characterPool = [];
  if (document.getElementById("includeUppercase").checked) {
    characterPool = characterPool.concat(charactersUppercase);
  }
  if (document.getElementById("includeLowercase").checked) {
    characterPool = characterPool.concat(charactersLowercase);
  }
  if (document.getElementById("includeNumbers").checked) {
    characterPool = characterPool.concat(charactersNumbers);
  }
  if (document.getElementById("includeSymbols").checked) {
    characterPool = characterPool.concat(charactersSymbols);
  }
  return characterPool;
}

function generatePasswords() {
  resetPasswords();
  let characterPool = generateCharacterPool();
  if (characterPool.length === 0) {
    errorMessageEl.textContent = errorMessageText;
    return;
  }

  let passwordLength = parseInt(passwordLengthInput.value) || 15;

  for (let i = 0; i < passwordLength; i++) {
    let randomIndexOne = Math.floor(Math.random() * characterPool.length);
    passwordOne += characterPool[randomIndexOne];

    let randomIndexTwo = Math.floor(Math.random() * characterPool.length);
    passwordTwo += characterPool[randomIndexTwo];
  }

  passwordOneParagraphEl.textContent = passwordOne;
  passwordTwoParagraphEl.textContent = passwordTwo;

  updateStrengthMeter(passwordOne);
}

function copyTextOne() {
  if (passwordOneParagraphEl.textContent === "Option One") {
    copyMessageEl.textContent = errorMessageText;
  } else {
    navigator.clipboard.writeText(passwordOneParagraphEl.textContent);
    copyMessageEl.textContent = successMessage;
  }
}

function copyTextTwo() {
  if (passwordTwoParagraphEl.textContent === "Option Two") {
    copyMessageEl.textContent = errorMessageText;
  } else {
    navigator.clipboard.writeText(passwordTwoParagraphEl.textContent);
    copyMessageEl.textContent = successMessage;
  }
}

function checkPasswordStrength(password) {
  let strength = 0;

  if (password.length > 20) {
    strength += 4;
  } else if (password.length >= 17) {
    strength += 3;
  } else if (password.length >= 13) {
    strength += 2;
  } else if (password.length >= 8) {
    strength += 1;
  }

  let hasUppercase = /[A-Z]/.test(password);
  let hasLowercase = /[a-z]/.test(password);
  let hasNumbers = /[0-9]/.test(password);
  let hasSymbols =
    /[\~\`\!\@\#\$\%\^\&\*\(\)\_\-\+\=\{\[\}\]\,\|\:\;\<\>\.\?\/]/.test(
      password
    );

  let varietyCount = 0;
  if (hasUppercase) varietyCount++;
  if (hasLowercase) varietyCount++;
  if (hasNumbers) varietyCount++;
  if (hasSymbols) varietyCount++;

  if (varietyCount >= 4) {
    strength += 3;
  } else if (varietyCount === 3) {
    strength += 2;
  } else if (varietyCount === 2) {
    strength += 1;
  }

  let hasSequential =
    /(012|123|234|345|456|567|678|789|890|abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)/i.test(
      password
    );
  let hasRepetition = /(.)\1{2,}/.test(password);

  if (!hasSequential && !hasRepetition) {
    strength += 1;
  }

  return Math.min(strength, 5);
}

function updateStrengthMeter(password) {
  let strength = checkPasswordStrength(password);
  let strengthTextEl = document.getElementById("strengthText");
  let strengthIndicatorEl = document.getElementById("strengthIndicator");

  strengthIndicatorEl.classList.remove("weak", "medium", "good", "strong");

  if (strength <= 2) {
    strengthTextEl.textContent = "Bad Strength";
    strengthIndicatorEl.classList.add("weak");
  } else if (strength === 3) {
    strengthTextEl.textContent = "Medium Strength";
    strengthIndicatorEl.classList.add("medium");
  } else if (strength === 4) {
    strengthTextEl.textContent = "Good Strength";
    strengthIndicatorEl.classList.add("good");
  } else if (strength === 5) {
    strengthTextEl.textContent = "Perfect Strength";
    strengthIndicatorEl.classList.add("strong");
  }
}
